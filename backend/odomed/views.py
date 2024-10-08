from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Roles,Usuario, Odontologo,Practicante,Recepcionista,Paciente
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json
import re
from django.http import HttpResponse


def home(request):
    return HttpResponse("Bienvenido a la API de Odomed.")


@csrf_exempt
def rol_list(request):
    if request.method == 'GET':
        roles = list(Roles.objects.filter(activo=True).values())
        return JsonResponse(roles, safe=False)

@csrf_exempt
def rol_detail(request, id_rol):
    try:
        rol = Roles.objects.get(id_rol=id_rol)
    except Roles.DoesNotExist:
        return JsonResponse({'error': 'Rol no encontrado'}, status=404)

    if request.method == 'PUT':
        data = json.loads(request.body)
        errors = {}

        # Validar y convertir nombre_rol a mayúsculas
        nombre_rol = data.get('nombre_rol', rol.nombre_rol).strip().upper()

        # Expresión regular para validar solo letras y espacios
        nombre_rol_regex = re.compile(r'^[A-Z\s]+$')

        # Validar nombre_rol
        if not nombre_rol:
            errors['nombre_rol'] = 'El nombre del rol es obligatorio.'
        elif len(nombre_rol) < 4 or len(nombre_rol) > 50:
            errors['nombre_rol'] = 'El nombre del rol debe tener entre 4 y 50 caracteres.'
        elif not nombre_rol_regex.match(nombre_rol):
            errors['nombre_rol'] = 'El nombre del rol solo puede contener letras y espacios.'
        elif Roles.objects.filter(nombre_rol=nombre_rol).exclude(id_rol=rol.id_rol).exists():
            errors['nombre_rol'] = 'El nombre del rol ya está en uso.'

        # Validar permisos
        permisos = data.get('permisos', rol.permisos).strip()
        if not permisos:
            errors['permisos'] = 'Debe seleccionar al menos un permiso.'

        # Si hay errores, devolverlos
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Actualizar el rol si no hay errores
        rol.nombre_rol = nombre_rol
        rol.permisos = permisos
        rol.save()

        return JsonResponse({'message': 'Rol actualizado con éxito'})

    # Si no es PUT, devolver un error de método no permitido
    return JsonResponse({'error': 'Método no permitido'}, status=405)
    rol = get_object_or_404(Roles, id_rol=id_rol)
    if request.method == 'GET':
        return JsonResponse(rol)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        rol.nombre_rol = data.get('nombre_rol', rol.nombre_rol)
        rol.permisos = data.get('permisos', rol.permisos)
        rol.save()
        return JsonResponse({'message': 'Rol actualizado'})

    elif request.method == 'DELETE':
        rol.activo = False
        rol.save()
        return JsonResponse({'message': 'Rol eliminado lógicamente'})

@csrf_exempt
def rol_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        errors = {}

        # Validar y convertir nombre_rol a mayúsculas
        nombre_rol = data.get('nombre_rol', '').strip().upper()

        # Expresión regular para validar solo letras y espacios
        nombre_rol_regex = re.compile(r'^[A-Z\s]+$')

        # Validar que el nombre_rol no esté vacío, tenga la longitud adecuada y contenga solo letras y espacios
        if not nombre_rol:
            errors['nombre_rol'] = 'El nombre del rol es obligatorio.'
        elif len(nombre_rol) < 4 or len(nombre_rol) > 50:
            errors['nombre_rol'] = 'El nombre del rol debe tener entre 4 y 50 caracteres.'
        elif not nombre_rol_regex.match(nombre_rol):
            errors['nombre_rol'] = 'El nombre del rol solo puede contener letras y espacios.'
        elif Roles.objects.filter(nombre_rol=nombre_rol).exists():
            errors['nombre_rol'] = 'El nombre del rol ya está en uso.'

        # Validar permisos
        permisos = data.get('permisos', '').strip()
        if not permisos:
            errors['permisos'] = 'Debe seleccionar al menos un permiso.'

        # Si hay errores, devolver el diccionario de errores
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Si no hay errores, crear el rol con el nombre en mayúsculas
        rol = Roles.objects.create(
            nombre_rol=nombre_rol,  # El nombre se guarda en mayúsculas
            permisos=permisos
        )

        return JsonResponse({'id_rol': rol.id_rol, 'nombre_rol': rol.nombre_rol, 'permisos': rol.permisos}, status=201)


@csrf_exempt
def usuario_list(request):
    if request.method == 'GET':
        usuarios = list(Usuario.objects.filter(activo=True).values())
        return JsonResponse(usuarios, safe=False)

@csrf_exempt
def usuario_detail(request, id_usuario):
    usuario = get_object_or_404(Usuario, id_usuario=id_usuario)
    
    if request.method == 'GET':
        return JsonResponse(usuario)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        usuario.nombres = data.get('nombres', usuario.nombres)
        usuario.apellidos = data.get('apellidos', usuario.apellidos)
        usuario.ci = data.get('ci', usuario.ci)
        usuario.email = data.get('email', usuario.email)
        usuario.telefono = data.get('telefono', usuario.telefono)
        usuario.fecha_nacimiento = data.get('fecha_nacimiento', usuario.fecha_nacimiento)
        usuario.rol_id = data.get('rol', usuario.rol.id_rol)  # Asegúrate de que se pasa el ID del rol
        usuario.direccion = data.get('direccion', usuario.direccion)
        usuario.contrasenia = data.get('contrasenia', usuario.contrasenia)
        usuario.save()
        return JsonResponse({'message': 'Usuario actualizado'})

    elif request.method == 'DELETE':
        usuario.activo = False
        usuario.save()
        return JsonResponse({'message': 'Usuario eliminado lógicamente'})

@csrf_exempt
def usuario_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        usuario = Usuario.objects.create(
            nombres=data.get('nombres'),
            apellidos=data.get('apellidos'),
            ci=data.get('ci'),
            email=data.get('email'),
            telefono=data.get('telefono'),
            fecha_nacimiento=data.get('fecha_nacimiento'),
            rol_id=data.get('rol'),  # Asegúrate de que se pasa el ID del rol
            direccion=data.get('direccion'),
            contrasenia=data.get('contrasenia')
        )
        return JsonResponse({'id_usuario': usuario.id_usuario, 'nombres': usuario.nombres, 'apellidos': usuario.apellidos}, status=201)   
@csrf_exempt
def paciente_list(request):
    if request.method == 'GET':
        pacientes = list(Paciente.objects.filter(activo=True).values())
        return JsonResponse(pacientes, safe=False)

@csrf_exempt
def paciente_detail(request, id_paciente):
    paciente = get_object_or_404(Paciente, usuario_id=id_paciente)
    
    if request.method == 'GET':
        return JsonResponse(paciente)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        paciente.seguro_medico = data.get('seguro_medico', paciente.seguro_medico)
        paciente.alergias = data.get('alergias', paciente.alergias)
        paciente.antecedentes_medicos = data.get('antecedentes_medicos', paciente.antecedentes_medicos)
        paciente.save()
        return JsonResponse({'message': 'Paciente actualizado'})

    elif request.method == 'DELETE':
        paciente.activo = False
        paciente.save()
        return JsonResponse({'message': 'Paciente eliminado lógicamente'})

@csrf_exempt
def paciente_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        usuario = Usuario.objects.create(
            nombres=data.get('nombres'),
            apellidos=data.get('apellidos'),
            ci=data.get('ci'),
            email=data.get('email'),
            telefono=data.get('telefono'),
            fecha_nacimiento=data.get('fecha_nacimiento'),
            rol_id=data.get('rol'),  # Asegúrate de que se pasa el ID del rol
            direccion=data.get('direccion'),
            contrasenia=data.get('contrasenia')
        )
        paciente = Paciente.objects.create(
            usuario=usuario,
            seguro_medico=data.get('seguro_medico'),
            alergias=data.get('alergias'),
            antecedentes_medicos=data.get('antecedentes_medicos')
        )
        return JsonResponse({'id_paciente': paciente.usuario.id_usuario, 'nombres': paciente.usuario.nombres, 'apellidos': paciente.usuario.apellidos}, status=201)

@csrf_exempt
def odontologo_list(request):
    if request.method == 'GET':
        odontologos = list(Odontologo.objects.filter(activo=True).values())
        return JsonResponse(odontologos, safe=False)

@csrf_exempt
def odontologo_detail(request, id_odontologo):
    odontologo = get_object_or_404(Odontologo, usuario_id=id_odontologo)

    if request.method == 'GET':
        return JsonResponse(odontologo)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        odontologo.numero_licencia = data.get('numero_licencia', odontologo.numero_licencia)
        odontologo.especializacion = data.get('especializacion', odontologo.especializacion)
        odontologo.save()
        return JsonResponse({'message': 'Odontólogo actualizado'})

    elif request.method == 'DELETE':
        odontologo.activo = False
        odontologo.save()
        return JsonResponse({'message': 'Odontólogo eliminado lógicamente'})

@csrf_exempt
def odontologo_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        usuario = Usuario.objects.create(
            nombres=data.get('nombres'),
            apellidos=data.get('apellidos'),
            ci=data.get('ci'),
            email=data.get('email'),
            telefono=data.get('telefono'),
            fecha_nacimiento=data.get('fecha_nacimiento'),
            rol_id=data.get('rol'),  # Asegúrate de que se pasa el ID del rol
            direccion=data.get('direccion'),
            contrasenia=data.get('contrasenia')
        )
        odontologo = Odontologo.objects.create(
            usuario=usuario,
            numero_licencia=data.get('numero_licencia'),
            especializacion=data.get('especializacion')
        )
        return JsonResponse({'id_odontologo': odontologo.usuario.id_usuario, 'nombres': odontologo.usuario.nombres, 'apellidos': odontologo.usuario.apellidos}, status=201)

@csrf_exempt
def recepcionista_list(request):
    if request.method == 'GET':
        recepcionistas = list(Recepcionista.objects.filter(activo=True).values())
        return JsonResponse(Recepcionista, safe=False)

@csrf_exempt
def recepcionista_detail(request, id_recepcionista):
    recepcionista = get_object_or_404(Recepcionista, usuario_id=id_recepcionista)

    if request.method == 'GET':
        return JsonResponse(recepcionista)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        recepcionista.activo = data.get('activo', recepcionista.activo)
        recepcionista.save()
        return JsonResponse({'message': 'Recepcionista actualizado'})

    elif request.method == 'DELETE':
        recepcionista.activo = False
        recepcionista.save()
        return JsonResponse({'message': 'Recepcionista eliminado lógicamente'})

@csrf_exempt
def recepcionista_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        usuario = Usuario.objects.create(
            nombres=data.get('nombres'),
            apellidos=data.get('apellidos'),
            ci=data.get('ci'),
            email=data.get('email'),
            telefono=data.get('telefono'),
            fecha_nacimiento=data.get('fecha_nacimiento'),
            rol_id=data.get('rol'),  # Asegúrate de que se pasa el ID del rol
            direccion=data.get('direccion'),
            contrasenia=data.get('contrasenia')
        )
        recepcionista = Recepcionista.objects.create(usuario=usuario)
        return JsonResponse({'id_recepcionista': recepcionista.usuario.id_usuario, 'nombres': recepcionista.usuario.nombres, 'apellidos': recepcionista.usuario.apellidos}, status=201)

@csrf_exempt
def practicante_list(request):
    if request.method == 'GET':
        practicantes = list(Practicante.objects.filter(activo=True).values())
        return JsonResponse(practicantes, safe=False)

@csrf_exempt
def practicante_detail(request, id_practicante):
    practicante = get_object_or_404(Practicante, usuario_id=id_practicante)

    if request.method == 'GET':
        return JsonResponse(practicante)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        practicante.universidad = data.get('universidad', practicante.universidad)
        practicante.fecha_inicio_practicas = data.get('fecha_inicio_practicas', practicante.fecha_inicio_practicas)
        practicante.fecha_fin_practicas = data.get('fecha_fin_practicas', practicante.fecha_fin_practicas)
        practicante.save()
        return JsonResponse({'message': 'Practicante actualizado'})

    elif request.method == 'DELETE':
        practicante.activo = False
        practicante.save()
        return JsonResponse({'message': 'Practicante eliminado lógicamente'})

@csrf_exempt
def practicante_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        usuario = Usuario.objects.create(
            nombres=data.get('nombres'),
            apellidos=data.get('apellidos'),
            ci=data.get('ci'),
            email=data.get('email'),
            telefono=data.get('telefono'),
            fecha_nacimiento=data.get('fecha_nacimiento'),
            rol_id=data.get('rol'),  # Asegúrate de que se pasa el ID del rol
            direccion=data.get('direccion'),
            contrasenia=data.get('contrasenia')
        )
        practicante = Practicante.objects.create(
            usuario=usuario,
            universidad=data.get('universidad'),
            fecha_inicio_practicas=data.get('fecha_inicio_practicas'),
            fecha_fin_practicas=data.get('fecha_fin_practicas')
        )
        return JsonResponse({'id_practicante': practicante.usuario.id_usuario, 'nombres': practicante.usuario.nombres, 'apellidos': practicante.usuario.apellidos}, status=201)
@csrf_exempt
def login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        email = data.get('email')
        contrasenia = data.get('contrasenia')

        try:
            usuario = Usuario.objects.get(email=email, contrasenia=contrasenia)
            return JsonResponse({'message': 'Login exitoso', 'usuario_id': usuario.id_usuario}, status=200)
        except Usuario.DoesNotExist:
            return JsonResponse({'message': 'Email o contraseña incorrectos'}, status=400)
    return JsonResponse({'message': 'Método no permitido'}, status=405)