from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Roles,Usuario, Pacientes, HistorialesClinicos, Odontologos
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json
import re
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
from datetime import datetime, timedelta


def home(request):
    return HttpResponse("Bienvenido a la API de Odomed.")
#crud de roles
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
    elif request.method == 'GET':
        return JsonResponse(rol)
    elif request.method == 'DELETE':
        rol.activo = False
        rol.save()
        return JsonResponse({'message': 'Rol eliminado lógicamente'})

    # Si no es PUT, devolver un error de método no permitido
    return JsonResponse({'error': 'Método no permitido'}, status=405)

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

        return JsonResponse({'message': 'Paciente Creado Correctamente'}, status=201)
#crud de roles

def usuario_list(request):
    if request.method == 'GET':
        # Obtiene todos los pacientes activos
        pacientes = Pacientes.objects.filter(activo=True).select_related('id_paciente').prefetch_related('historialesclinicos_set')

        data = []
        for paciente in pacientes:
            # Agrega los detalles del paciente
            paciente_info = {
                'id_paciente': paciente.id_paciente.id_usuario,  # Acceso a Usuario a través del OneToOne
                'nombres': paciente.id_paciente.nombres,
                'apellidos': paciente.id_paciente.apellidos,
                'nombre_completo': f"{paciente.id_paciente.nombres} {paciente.id_paciente.apellidos}",
                'ci': paciente.id_paciente.ci,
                'fecha_nacimiento': paciente.id_paciente.fecha_nacimiento,
                'email': paciente.id_paciente.email,
                'direccion': paciente.id_paciente.direccion,
                'telefono': paciente.id_paciente.telefono,
                'seguro_medico': paciente.seguro_medico,
                'alergias': paciente.alergias,
                'antecedentes_medicos': paciente.antecedentes_medicos,
                'historiales': []
            }
            
            # Agrega la información de los historiales clínicos
            for historial in paciente.historialesclinicos_set.all():
                paciente_info['historiales'].append({
                    'id_historial': historial.id_historial,
                    'id_odontologo': historial.id_odontologo_id,  # Solo el ID del odontólogo
                    'fecha_hora_creacion': historial.fecha_hora_creacion,
                    'notas_generales': historial.notas_generales,
                })

            data.append(paciente_info)

        return JsonResponse(data, safe=False)

@csrf_exempt
def usuario_detail(request, id_usuario):
    usuario = get_object_or_404(Usuario, id_usuario=id_usuario)
    
    if request.method == 'GET':
        return JsonResponse(usuario)

    elif request.method == 'PUT':
        data = json.loads(request.body)
        errors = {}
        # Validación de nombres
        nombres = data.get('nombres', '').strip().upper()  # Convertir a mayúsculas
        nombres_regex = re.compile(r'^[A-Z\s]+$')  # Regex modificado para letras mayúsculas
        if not nombres or len(nombres) < 3 or len(nombres) > 100 or not nombres_regex.match(nombres):
            errors['nombres'] = 'Los nombres deben contener solo letras y espacios, y tener entre 3 y 100 caracteres.'

        # Validación de apellidos
        apellidos = data.get('apellidos', '').strip().upper()  # Convertir a mayúsculas
        if not apellidos or len(apellidos) < 3 or len(apellidos) > 100 or not nombres_regex.match(apellidos):
            errors['apellidos'] = 'Los apellidos deben contener solo letras y espacios, y tener entre 3 y 100 caracteres.'

        # Validación de CI (Cédula de Identidad)
        ci = data.get('ci', '').strip()
        if not re.match(r'^\d{6,12}$', ci) or Usuario.objects.filter(ci=ci).exclude(id_usuario=id_usuario).exists():
            errors['ci'] = 'La cédula de identidad debe ser única y contener entre 6 y 12 dígitos.'

        # Validación de email
        email = data.get('email', '').strip().upper()  # Convertir a mayúsculas
        if email and Usuario.objects.filter(email=email).exclude(id_usuario=id_usuario).exists():
            errors['email'] = 'El email ya está en uso por otro usuario.'
        # Validación de teléfono
        telefono = data.get('telefono', '').strip()
        if not re.match(r'^\d{8}$', telefono):
            errors['telefono'] = 'El teléfono debe contener exactamente 8 dígitos.'

        # Validación de fecha de nacimiento
        fecha_nacimiento = data.get('fecha_nacimiento')
        if fecha_nacimiento:
            try:
                fecha_nacimiento = datetime.strptime(fecha_nacimiento, '%Y-%m-%d')
                if fecha_nacimiento < datetime.now() - timedelta(days=365 * 80) or fecha_nacimiento > datetime.now() - timedelta(days=365 * 3):
                    errors['fecha_nacimiento'] = 'La fecha de nacimiento debe ser entre 80 años atrás y 3 años atrás.'
            except ValueError:
                errors['fecha_nacimiento'] = 'La fecha de nacimiento debe tener el formato correcto (YYYY-MM-DD).'

        # Validación de dirección
        direccion = data.get('direccion', '').strip().upper()  # Convertir a mayúsculas
        direccion_regex = re.compile(r'^[A-Z0-9\s.]+$')  # Regex modificado para letras mayúsculas
        if not 5 <= len(direccion) <= 255 or not direccion_regex.match(direccion):
            errors['direccion'] = 'La dirección debe tener entre 5 y 255 caracteres y solo contener letras, números, espacios y puntos.'

        # Validación de rol
        rol_id = data.get('rol')
        if not Roles.objects.filter(id_rol=rol_id).exists():
            errors['rol'] = 'El rol seleccionado no existe.'

        # Validación de contraseña
        contrasenia = data.get('contrasenia', '')
        password_regex = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,250}$')
        if not password_regex.match(contrasenia):
            errors['contrasenia'] = 'La contraseña debe tener entre 8 y 250 caracteres y contener al menos una letra, un número y un carácter especial.'

        if errors:
            return JsonResponse({'errors': errors}, status=400)
        # Actualizar atributos
        usuario.nombres = data.get('nombres', usuario.nombres).upper()
        usuario.apellidos = data.get('apellidos', usuario.apellidos).upper()
        usuario.ci = data.get('ci', usuario.ci)
        usuario.email = data.get('email', usuario.email).upper()
        usuario.telefono = data.get('telefono', usuario.telefono)
        usuario.fecha_nacimiento = data.get('fecha_nacimiento', usuario.fecha_nacimiento)
        usuario.rol_id = data.get('rol', usuario.rol.id_rol)  # Asegúrate de que se pasa el ID del rol
        usuario.direccion = data.get('direccion', usuario.direccion).upper()
        usuario.contrasenia = data.get('contrasenia', usuario.contrasenia)
        
        usuario.save()
        return JsonResponse({'message': 'USUARIO ACTUALIZADO'})

    elif request.method == 'DELETE':
        # Extraer el id del usuario del request (asumiendo que el ID del usuario es pasado)
        usuario_id = id_usuario
        
        try:
            # Obtén el usuario
            usuario = Usuario.objects.get(id_usuario=usuario_id)
            
            # Primero, desactivar el historial clínico relacionado
            # Asumiendo que tienes un método para encontrar los historiales clínicos del paciente
            pacientes = Pacientes.objects.filter(id_paciente=usuario)  # Asumiendo que el paciente está relacionado con el usuario
            for paciente in pacientes:
                # Desactivar todos los historiales clínicos asociados a este paciente
                HistorialesClinicos.objects.filter(id_paciente=paciente).update(activo=False)
                # Desactivar el paciente
                paciente.activo = False
                paciente.save()

            # Desactivar el usuario
            usuario.activo = False
            usuario.save()

            return JsonResponse({'message': 'Usuario eliminado lógicamente'})
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)


@csrf_exempt
def usuario_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        errors = {}

        # Validación de nombres
        nombres = data.get('nombres', '').strip().upper()  # Convertir a mayúsculas
        nombres_regex = re.compile(r'^[A-Z\s]+$')  # Regex modificado para letras mayúsculas
        if not nombres or len(nombres) < 3 or len(nombres) > 100 or not nombres_regex.match(nombres):
            errors['nombres'] = 'Los nombres deben contener solo letras y espacios, y tener entre 3 y 100 caracteres.'

        # Validación de apellidos
        apellidos = data.get('apellidos', '').strip().upper()  # Convertir a mayúsculas
        if not apellidos or len(apellidos) < 3 or len(apellidos) > 100 or not nombres_regex.match(apellidos):
            errors['apellidos'] = 'Los apellidos deben contener solo letras y espacios, y tener entre 3 y 100 caracteres.'

        # Validación de CI (Cédula de Identidad)
        ci = data.get('ci', '').strip()
        if not re.match(r'^\d{6,12}$', ci) or Usuario.objects.filter(ci=ci).exists():
            errors['ci'] = 'La cédula de identidad debe ser única y contener entre 6 y 12 dígitos.'

        # Validación de email
        email = data.get('email', '').strip().upper()  # Convertir a mayúsculas
        if Usuario.objects.filter(email=email).exists():
            errors['email'] = 'El email ya está en uso.'

        # Validación de teléfono
        telefono = data.get('telefono', '').strip()
        if not re.match(r'^\d{8}$', telefono):
            errors['telefono'] = 'El teléfono debe contener exactamente 8 dígitos.'

        # Validación de fecha de nacimiento
        fecha_nacimiento = data.get('fecha_nacimiento')
        if fecha_nacimiento:
            try:
                fecha_nacimiento = datetime.strptime(fecha_nacimiento, '%Y-%m-%d')
                if fecha_nacimiento < datetime.now() - timedelta(days=365 * 80) or fecha_nacimiento > datetime.now() - timedelta(days=365 * 3):
                    errors['fecha_nacimiento'] = 'La fecha de nacimiento debe ser entre 80 años atrás y 3 años atrás.'
            except ValueError:
                errors['fecha_nacimiento'] = 'La fecha de nacimiento debe tener el formato correcto (YYYY-MM-DD).'

        # Validación de dirección
        direccion = data.get('direccion', '').strip().upper()  # Convertir a mayúsculas
        direccion_regex = re.compile(r'^[A-Z0-9\s.]+$')  # Regex modificado para letras mayúsculas
        if not 5 <= len(direccion) <= 255 or not direccion_regex.match(direccion):
            errors['direccion'] = 'La dirección debe tener entre 5 y 255 caracteres y solo contener letras, números, espacios y puntos.'

        # Validación de rol
        rol_id = data.get('rol')
        if not Roles.objects.filter(id_rol=rol_id).exists():
            errors['rol'] = 'El rol seleccionado no existe.'

        # Validación de contraseña
        contrasenia = data.get('contrasenia', '')
        password_regex = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,250}$')
        if not password_regex.match(contrasenia):
            errors['contrasenia'] = 'La contraseña debe tener entre 8 y 250 caracteres y contener al menos una letra, un número y un carácter especial.'

        # Validación de seguro médico
        seguro_medico = data.get('seguro_medico', '').strip().upper()  # Convertir a mayúsculas
        if not 8 <= len(seguro_medico) <= 15 or not re.match(r'^[A-Z0-9]+$', seguro_medico):  # Regex modificado para letras mayúsculas
            errors['seguro_medico'] = 'El seguro médico debe tener entre 8 y 15 caracteres y contener solo letras y números.'

        # Validación de alergias y antecedentes médicos
        alergias = data.get('alergias', '').strip().upper()  # Convertir a mayúsculas
        antecedentes_medicos = data.get('antecedentes_medicos', '').strip().upper()  # Convertir a mayúsculas
        if not re.match(r'^[A-Z0-9\s]*$', alergias):  # Regex modificado para letras mayúsculas
            errors['alergias'] = 'Las alergias solo pueden contener letras, números y espacios.'
        if not re.match(r'^[A-Z0-9\s]*$', antecedentes_medicos):  # Regex modificado para letras mayúsculas
            errors['antecedentes_medicos'] = 'Los antecedentes médicos solo pueden contener letras, números y espacios.'

        # Validación de id_paciente e id_odontologo
        id_odontologo = data.get('id_odontologo')
        if not Odontologos.objects.filter(id_odontologo=id_odontologo).exists():
            errors['id_odontologo'] = 'El odontólogo seleccionado no existe.'

        # Validación de notas generales
        notas_generales = data.get('notas_generales', '').strip().upper()  # Convertir a mayúsculas
        if not re.match(r'^[A-Z0-9\s]*$', notas_generales):  # Regex modificado para letras mayúsculas
            errors['notas_generales'] = 'Las notas generales solo pueden contener letras, números y espacios.'

        # Si hay errores, devolver el diccionario de errores
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Si no hay errores, crear el usuario y paciente
        usuario = Usuario.objects.create(
            nombres=nombres,
            apellidos=apellidos,
            ci=ci,
            email=email,
            telefono=telefono,
            fecha_nacimiento=fecha_nacimiento,
            rol_id=rol_id,
            direccion=direccion,
            contrasenia=contrasenia  # Asegúrate de que la contraseña se maneje correctamente (hashing)
        )

        paciente = Pacientes.objects.create(
            id_paciente=usuario,
            seguro_medico=seguro_medico,
            alergias=alergias,
            antecedentes_medicos=antecedentes_medicos
        )

        historial = HistorialesClinicos.objects.create(
            id_paciente=paciente,
            notas_generales=notas_generales,
            id_odontologo=Odontologos.objects.get(id_odontologo=id_odontologo)
        )
        
        return JsonResponse({
            'message': 'Paciente Creado Correctamente'
        }, status=201)


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


@csrf_exempt
def odontologo_list(request):
    if request.method == 'GET':
        # Filtrar los odontólogos activos y obtener los datos necesarios desde la tabla Usuarios
        odontologos = Odontologos.objects.filter(activo=True).select_related('id_odontologo').values(
            'id_odontologo', 'id_odontologo__nombres', 'id_odontologo__apellidos', 'numero_licencia', 'especializacion', 'activo'
        )

        # Crear una nueva lista con el nombre completo del odontólogo
        odontologos_con_nombre_completo = [
            {
                'id_odontologo': odontologo['id_odontologo'],
                'nombre_completo': f"{odontologo['id_odontologo__nombres']} {odontologo['id_odontologo__apellidos']}",
                'numero_licencia': odontologo['numero_licencia'],
                'especializacion': odontologo['especializacion'],
                'activo': odontologo['activo']
            }
            for odontologo in odontologos
        ]

        # Enviar la lista como respuesta JSON
        return JsonResponse(odontologos_con_nombre_completo, safe=False)

@csrf_exempt
def historial_detail(request, id_historial):
    historial = get_object_or_404(HistorialesClinicos, id_historial=id_historial)
    
    if request.method == 'GET':
        return JsonResponse(historial)
    elif request.method == 'PUT':
        try:
            historial = get_object_or_404(HistorialesClinicos, id_historial=id_historial)
            data = json.loads(request.body.decode('utf-8'))

            # Validaciones y guardado en mayúsculas
            notas_generales = data.get('notas_generales', '').upper()
            
            if not notas_generales:
                return JsonResponse({'error': 'LAS NOTAS GENERALES SON REQUERIDAS'}, status=400)

            historial.notas_generales = notas_generales
            historial.save()

            return JsonResponse({'message': 'Historial actualizado correctamente'})
        
        except Exception as e:
            return JsonResponse({'error': 'ERROR AL ACTUALIZAR EL HISTORIAL'}, status=500)
    
    return JsonResponse({'error': 'MÉTODO NO PERMITIDO'}, status=405)

@csrf_exempt
def paciente_detail(request, id_paciente):
    paciente = get_object_or_404(Pacientes, id_paciente=id_paciente)
    
    if request.method == 'GET':
        return JsonResponse(paciente)
    if request.method == 'PUT':
        try:
            paciente = get_object_or_404(Pacientes, id_paciente=id_paciente)
            data = json.loads(request.body.decode('utf-8'))

            # Validaciones y guardado en mayúsculas
            seguro_medico = data.get('seguro_medico', '').upper()
            alergias = data.get('alergias', '').upper()
            antecedentes_medicos = data.get('antecedentes_medicos', '').upper()

            if not seguro_medico:
                return JsonResponse({'error': 'EL SEGURO MÉDICO ES REQUERIDO'}, status=400)

            paciente.seguro_medico = seguro_medico
            paciente.alergias = alergias
            paciente.antecedentes_medicos = antecedentes_medicos
            paciente.save()

            return JsonResponse({'message': 'Paciente actualizado correctamente'})
        
        except Exception as e:
            return JsonResponse({'error': 'ERROR AL ACTUALIZAR EL PACIENTE'}, status=500)
    
    return JsonResponse({'error': 'MÉTODO NO PERMITIDO'}, status=405)