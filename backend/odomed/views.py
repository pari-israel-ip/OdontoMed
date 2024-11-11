from django.shortcuts import render
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Horarios, Citas, Roles,Usuario, Pacientes, HistorialesClinicos, Odontologos, Diagnosticos, Tratamientos, Costos, Prescripciones, Recepcionistas
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json
import re
from django.http import HttpResponse
from django.contrib.auth.hashers import make_password
from datetime import datetime, timedelta
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.dateparse import parse_date
import json
import re
from datetime import datetime, timedelta
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django.forms.models import model_to_dict
from django.core.mail import send_mail



def home(request):
    return HttpResponse("Bienvenido a la API de Odomed.")
#crud de roles
@csrf_exempt
def rol_list(request):
    if request.method == 'GET':
        roles = list(Roles.objects.filter(activo=True).values())
        return JsonResponse(roles, safe=False)
    
@csrf_exempt
def rol_list_paciente(request):
    if request.method == 'GET':
        roles = list(Roles.objects.filter(activo=True,  nombre_rol='PACIENTE').values())
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
        try:
            rol = Roles.objects.get(id_rol=id_rol)
            rol_dict = model_to_dict(rol)
            return JsonResponse(rol_dict, safe=False)
        except Roles.DoesNotExist:
            return JsonResponse({"error": "Rol no encontrado"}, status=404)

    elif request.method == 'DELETE':
        linked_users = Usuario.objects.filter(rol=rol, activo=True)  # Replace `is_active` with your field for active users

        if linked_users.exists():
            # Return an error message if there are active users linked to this role
            return JsonResponse({
                'error': 'No se puede eliminar este rol porque hay usuarios vinculados a él.'
            }, status=400)

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
#create_list es listado de pacientes
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
    usuario = get_object_or_404(Usuario, id_usuario=id_usuario, activo=True)
    
    if request.method == 'GET':
        paciente = Pacientes.objects.filter(id_paciente=usuario).first()  # Obtener el paciente asociado si existe

        usuario_info = {
            'id_usuario': usuario.id_usuario,
            'nombres': usuario.nombres,
            'apellidos': usuario.apellidos,
            'nombre_completo': f"{usuario.nombres} {usuario.apellidos}",
            'ci': usuario.ci,
            'fecha_nacimiento': usuario.fecha_nacimiento,
            'email': usuario.email,
            'direccion': usuario.direccion,
            'telefono': usuario.telefono,
            'seguro_medico': paciente.seguro_medico if paciente else None,
            'alergias': paciente.alergias if paciente else None,
            'antecedentes_medicos': paciente.antecedentes_medicos if paciente else None,
            'historiales': []
        }
        
        # Agrega la información de los historiales clínicos
        if paciente:
            for historial in paciente.historialesclinicos_set.all():
                usuario_info['historiales'].append({
                    'id_historial': historial.id_historial,
                    'id_odontologo': historial.id_odontologo_id,  # Solo el ID del odontólogo
                    'fecha_hora_creacion': historial.fecha_hora_creacion,
                    'notas_generales': historial.notas_generales,
                })

        return JsonResponse(usuario_info, safe=False)

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

       
        if errors:
            return JsonResponse({'errors': errors}, status=400)
        # Actualizar atributos
        usuario.nombres = data.get('nombres', usuario.nombres).upper()
        usuario.apellidos = data.get('apellidos', usuario.apellidos).upper()
        usuario.ci = data.get('ci', usuario.ci)
        usuario.email = data.get('email', usuario.email).upper()
        usuario.telefono = data.get('telefono', usuario.telefono)
        usuario.fecha_nacimiento = data.get('fecha_nacimiento', usuario.fecha_nacimiento)
        usuario.direccion = data.get('direccion', usuario.direccion).upper()
        
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
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            errors['email'] = 'El correo electrónico debe tener este fomato ejemplo@as.com'
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

        if not Roles.objects.filter(activo=True, nombre_rol='PACIENTE').exists():
            return JsonResponse({'error': 'No existe un rol para este tipo de usuario, cree el rol PACIENTE'}, status=400)


        # Validación de contraseña
        contrasenia = data.get('contrasenia', '')
        password_regex = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,250}$')
        if not password_regex.match(contrasenia):
            errors['contrasenia'] = 'Contraseña insegura: debe tener minimamente 8 caracteres, letra, numeros y simbolos(@$!%*?&).'

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
        rol = Roles.objects.filter(activo=True, nombre_rol='PACIENTE').values().first()

        # Si no hay errores, crear el usuario y paciente
        usuario = Usuario.objects.create(
            nombres=nombres,
            apellidos=apellidos,
            ci=ci,
            email=email,
            telefono=telefono,
            fecha_nacimiento=fecha_nacimiento,
            rol_id=rol['id_rol'],
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
            usuario = Usuario.objects.get(email=email)
            # Verifica la contraseña
            if check_password(contrasenia, usuario.contrasenia):
                return JsonResponse({'message': 'Login exitoso', 'usuario_id': usuario.id_usuario}, status=200)
            else:
                return JsonResponse({'message': 'Email o contraseña incorrectos'}, status=400)
        except Usuario.DoesNotExist:
            return JsonResponse({'message': 'Email o contraseña incorrectos'}, status=400)
    
    return JsonResponse({'message': 'Método no permitido'}, status=405)

@csrf_exempt
def odontologo_list(request):
    if request.method == 'GET':
        # Filtrar los odontólogos activos y obtener los datos necesarios desde la tabla Usuarios
        odontologos = Odontologos.objects.filter(activo=True).select_related('id_odontologo').values(
            'id_odontologo', 'id_odontologo__nombres','id_odontologo__ci','id_odontologo__fecha_nacimiento','id_odontologo__apellidos', 'numero_licencia', 'especializacion', 'activo', 'id_odontologo__email'
        )

        # Crear una nueva lista con el nombre completo del odontólogo
        odontologos_con_nombre_completo = [
            {
                'email': odontologo['id_odontologo__email'],
                'id_odontologo': odontologo['id_odontologo'],
                'ci': odontologo['id_odontologo__ci'],
                'fecha_nacimiento': odontologo['id_odontologo__fecha_nacimiento'],
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
def odontologo_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        errors = {}

        # Validación y procesamiento de datos de usuario
        nombres = data.get('nombres', '').strip().upper()
        
        nombres_regex = re.compile(r'^[A-Z\s]+$')
        if not nombres or len(nombres) < 3 or len(nombres) > 100 or not nombres_regex.match(nombres):
            errors['nombres'] = 'El campo Nombres debe ser entre 3 a 100 caracteres.'
        
        apellidos = data.get('apellidos', '').strip().upper()
        
        if not apellidos or len(apellidos) < 3 or len(apellidos) > 100 or not nombres_regex.match(apellidos):
            errors['apellidos'] = 'El campo Apellidos debe ser entre 3 a 100 caracteres.'

        
        ci = data.get('ci', '').strip()
        
        if not re.match(r'^\d{6,12}$', ci) or Usuario.objects.filter(ci=ci).exists():
            errors['ci'] = 'Cédula de identidad debe ser entre 6 a 12 caracteres.'
        
        email = data.get('email', '').strip().upper()
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            errors['email'] = 'El correo electrónico debe tener este fomato ejemplo@as.com'
        
        if Usuario.objects.filter(email=email).exists():
            errors['email'] = 'El email ya está en uso.'
        
        telefono = data.get('telefono', '').strip()
        if not re.match(r'^\d{8}$', telefono):
            errors['telefono'] = 'El teléfono debe contener exactamente 8 dígitos.'
        
        fecha_nacimiento = data.get('fecha_nacimiento')
        if fecha_nacimiento:
            try:
                fecha_nacimiento = datetime.strptime(fecha_nacimiento, '%Y-%m-%d')
                if fecha_nacimiento < datetime.now() - timedelta(days=365 * 80) or fecha_nacimiento > datetime.now() - timedelta(days=365 * 25):
                    errors['fecha_nacimiento'] = 'La Fecha de nacimiento debe ser entre 80 a 25 años atras a la fecha actual.'
            except ValueError:
                errors['fecha_nacimiento'] = 'Formato incorrecto para la fecha de nacimiento.'
        contrasenia = data.get('contrasenia', '')
        password_regex = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,250}$')
        if not password_regex.match(contrasenia):
            errors['contrasenia'] = 'Contraseña insegura: debe tener minimamente 8 caracteres, letra, numeros y simbolos(@$!%*?&).'
        direccion = data.get('direccion', '').strip().upper()  # Convertir a mayúsculas
        direccion_regex = re.compile(r'^[A-Z0-9\s.]+$')  # Regex modificado para letras mayúsculas
        if not 5 <= len(direccion) <= 255 or not direccion_regex.match(direccion):
            errors['direccion'] = 'La dirección debe tener entre 5 y 255 caracteres y solo contener letras, números, espacios y puntos.'


        # Validaciones para datos específicos de Odontologo
        numero_licencia = data.get('numero_licencia', '').strip().upper()
        if not numero_licencia or len(numero_licencia) < 5 or len(numero_licencia) > 50:
            errors['numero_licencia'] = 'Número de licencia inválido de 5 a 50 caracteres.'

        especializacion = data.get('especializacion', '').strip().upper()
        if not re.match(r'^[A-Z\s]+$', especializacion):  # Only uppercase letters and spaces
            errors['especializacion'] = 'La especialización solo puede contener letras y espacios.'
        if not Roles.objects.filter(activo=True, nombre_rol='ODONTOLOGO').exists():
            return JsonResponse({'error': 'No existe un rol para este tipo de usuario, cree el rol ODONTOLOGO'}, status=400)

        if errors:
            return JsonResponse({'errors': errors}, status=400)
        rol = Roles.objects.filter(activo=True, nombre_rol='ODONTOLOGO').values().first()

        # Crear usuario y odontólogo si no hay errores
        usuario = Usuario(
            nombres=nombres,
            apellidos=apellidos,
            ci=ci,
            contrasenia=contrasenia,
            email=email,
            telefono=telefono,
            fecha_nacimiento=fecha_nacimiento,
            rol_id=rol['id_rol'],
            direccion=direccion
        )
    
        usuario.save()

        odontologo = Odontologos.objects.create(
            id_odontologo=usuario,
            numero_licencia=numero_licencia,
            especializacion=especializacion
        )

        return JsonResponse({'message': 'Odontólogo creado correctamente'}, status=201)

# Vista para obtener los detalles de un odontólogo específico
@csrf_exempt
def odontologo_detail(request, id_usuario):
    if request.method == 'GET':
        # Fetch the Usuario instance with the given id and that is active
        usuario = get_object_or_404(Usuario, id_usuario=id_usuario, activo=True)

        # Now, retrieve the related Odontologos instance using id_odontologo
        odontologo = get_object_or_404(Odontologos, id_odontologo=usuario)

        odontologo_info = {
            'id_usuario': usuario.id_usuario,
            'nombres': usuario.nombres,
            'apellidos': usuario.apellidos,
            'ci': usuario.ci,
            'email': usuario.email,
            'telefono': usuario.telefono,
            'numero_licencia': odontologo.numero_licencia,
            'especializacion': odontologo.especializacion
        }
        return JsonResponse(odontologo_info, status=200)

    elif request.method == 'DELETE':
        # Fetch the Usuario instance
        usuario = get_object_or_404(Usuario, id_usuario=id_usuario)

        # Fetch the related Odontologos instance
        odontologo = get_object_or_404(Odontologos, id_odontologo=usuario)

        historial_exists = HistorialesClinicos.objects.filter(id_odontologo=odontologo).exists()
    
        if historial_exists:
            return JsonResponse({'error': 'NO SE PUEDE ELIMINAR. EXISTE UN HISTORIAL ASOCIADO AL ODONTÓLOGO'}, status=400)


        # Perform logical deletion
        usuario.activo = False
        usuario.save()

        # Also mark the related Odontologos as inactive
        odontologo.activo = False
        odontologo.save()

        return JsonResponse({'success': 'ODONTÓLOGO ELIMINADOS LÓGICAMENTE'}, status=200)
        
    if request.method == 'PUT':
        # Retrieve the Odontologos instance based on id_odontologo
        odontologo = get_object_or_404(Odontologos, id_odontologo=id_usuario)
        data = json.loads(request.body.decode('utf-8'))
        errors = {}

        # Validation for numero_licencia
        numero_licencia = data.get('numero_licencia', '').strip().upper()
        if not 5 <= len(numero_licencia) <= 15 or not re.match(r'^[A-Z0-9]+$', numero_licencia):
            errors['numero_licencia'] = 'El número de licencia debe tener entre 5 y 15 caracteres y contener solo letras y números.'

        # Validation for especializacion
        especializacion = data.get('especializacion', '').strip().upper()
        if not re.match(r'^[A-Z\s]+$', especializacion):  # Only uppercase letters and spaces
            errors['especializacion'] = 'La especialización solo puede contener letras y espacios.'

        # Ensure at least numero_licencia is provided
        if not numero_licencia:
            return JsonResponse({'error': 'EL NÚMERO DE LICENCIA ES REQUERIDO'}, status=400)

        # Return errors if any validations fail
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Update the fields if validations pass
        odontologo.numero_licencia = numero_licencia
        odontologo.especializacion = especializacion
        odontologo.save()

        return JsonResponse({'message': 'Odontólogo actualizado correctamente'}, status=200)
@csrf_exempt
def historial_detail(request, id_historial):
    historial = get_object_or_404(HistorialesClinicos, id_historial=id_historial)
    
    if request.method == 'GET':
        return JsonResponse(historial)
    elif request.method == 'PUT':
        try:
            historial = get_object_or_404(HistorialesClinicos, id_historial=id_historial)
            data = json.loads(request.body.decode('utf-8'))
            errors = {}
            # Validaciones y guardado en mayúsculas
            notas_generales = data.get('notas_generales', '').upper()
            # Validación de id_paciente e id_odontologo
            id_odontologo = data.get('id_odontologo')
            if not Odontologos.objects.filter(id_odontologo=id_odontologo).exists():
                errors['id_odontologo'] = 'El odontólogo seleccionado no existe.'
            notas_generales = data.get('notas_generales', '').strip().upper()  # Convertir a mayúsculas
            if not re.match(r'^[A-Z0-9\s]*$', notas_generales):  # Regex modificado para letras mayúsculas
                errors['notas_generales'] = 'Las notas generales solo pueden contener letras, números y espacios.'
            if not 5 <= len(notas_generales) <= 200:
                errors['notas_generales'] = 'Las notas generales deben tener entre 5 y 200 caracteres.'
            
            if errors:
                return JsonResponse({'errors': errors}, status=400)

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
        
        paciente = get_object_or_404(Pacientes, id_paciente=id_paciente)
        data = json.loads(request.body.decode('utf-8'))
        errors = {}

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
        if not seguro_medico:
            return JsonResponse({'error': 'EL SEGURO MÉDICO ES REQUERIDO'}, status=400)

        if errors:
            return JsonResponse({'errors': errors}, status=400)
           
        paciente.seguro_medico = seguro_medico
        paciente.alergias = alergias
        paciente.antecedentes_medicos = antecedentes_medicos
        paciente.save()

        return JsonResponse({'message': 'Paciente actualizado correctamente'})

     
    return JsonResponse({'error': 'MÉTODO NO PERMITIDO'}, status=405)

@csrf_exempt
def diagnostico_list(request, id_historial):
    if request.method == 'GET':
        diagnosticos = list(Diagnosticos.objects.filter(id_historial=id_historial, activo=True).order_by('-fecha_diagnostico').values())

        if not diagnosticos:
            return JsonResponse({'error': 'NO SE ENCONTRARON DIAGNOSTICOS PARA ESE ID_HISTORIAL'}, status=404)

        return JsonResponse(diagnosticos, safe=False)

nombre_pattern = re.compile(r'^[A-Za-z0-9 ]+$')
descripcion_pattern = re.compile(r'^[A-Za-z0-9 ]+$')

@csrf_exempt
def diagnostico_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        # Convertir los datos a mayúsculas
        nombre_diagnostico = data.get('nombre_diagnostico', '').upper()
        descripcion = data.get('descripcion', '').upper()

        # Validaciones
        errors = {}

        # Validar nombre_diagnostico
        if not (5 <= len(nombre_diagnostico) <= 50):
            errors['nombre_diagnostico'] = "EL NOMBRE DEL DIAGNOSTICO DEBE TENER ENTRE 5 Y 50 CARACTERES."
        elif not nombre_pattern.match(nombre_diagnostico):
            errors['nombre_diagnostico'] = "EL NOMBRE SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS."

        # Validar descripcion
        if not (5 <= len(descripcion) <= 200):
            errors['descripcion'] = "LA DESCRIPCIÓN DEBE TENER ENTRE 5 Y 200 CARACTERES."
        elif not descripcion_pattern.match(descripcion):
            errors['descripcion'] = "LA DESCRIPCIÓN SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS."

        # Validar id_historial
        id_historial = data.get('id_historial')
        if not id_historial:
            errors['id_historial'] = "EL ID DEL HISTORIAL ES OBLIGATORIO."
        else:
            # Obtener la instancia de HistorialesClinicos
            historial = get_object_or_404(HistorialesClinicos, id_historial=id_historial)

        # Si hay errores, devolverlos con un estado 400
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Crear el nuevo diagnóstico si no hay errores
        nuevo_diagnostico = Diagnosticos.objects.create(
            id_historial=historial,  # Asigna la instancia del historial
            nombre_diagnostico=nombre_diagnostico,
            descripcion=descripcion,
        )

        return JsonResponse({"message": "DIAGNOSTICO CREADO CORRECTAMENTE"}, status=201)

@csrf_exempt
def diagnostico_detail(request, id_diagnostico):
    diagnostico = get_object_or_404(Diagnosticos, id_diagnostico=id_diagnostico)
    
    if request.method == 'GET':
        return JsonResponse({
            "id_diagnostico": diagnostico.id_diagnostico,
            "id_historial": diagnostico.id_historial.id_historial,
            "nombre_diagnostico": diagnostico.nombre_diagnostico,
            "descripcion": diagnostico.descripcion,
            "fecha_diagnostico": diagnostico.fecha_diagnostico,
        })

    elif request.method == 'PUT':
        data = json.loads(request.body)
        diagnostico.nombre_diagnostico = data.get('nombre_diagnostico', diagnostico.nombre_diagnostico).upper()
        diagnostico.descripcion = data.get('descripcion', diagnostico.descripcion).upper()
        # Validaciones
        errors = {}

        # Validar nombre_diagnostico
        if not (5 <= len(diagnostico.nombre_diagnostico) <= 50):
            errors['nombre_diagnostico'] = "EL NOMBRE DEL DIAGNOSTICO DEBE TENER ENTRE 5 Y 50 CARACTERES."
        elif not nombre_pattern.match(diagnostico.nombre_diagnostico):
            errors['nombre_diagnostico'] = "EL NOMBRE SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS."

        # Validar descripcion
        if not (5 <= len(diagnostico.descripcion) <= 200):
            errors['descripcion'] = "LA DESCRIPCIÓN DEBE TENER ENTRE 5 Y 200 CARACTERES."
        elif not descripcion_pattern.match(diagnostico.descripcion):
            errors['descripcion'] = "LA DESCRIPCIÓN SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS."
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        diagnostico.save()
        return JsonResponse({"message": "Diagnóstico actualizado exitosamente."})

    elif request.method == 'DELETE':
        diagnostico.activo = False  # Eliminación lógica
        diagnostico.save()
        return JsonResponse({"message": "Diagnóstico eliminado exitosamente."})
    
@csrf_exempt
def tratamiento_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        errors = {}

        nombre_tratamiento = data.get('nombre_tratamiento', '').upper()
        descripcion = data.get('descripcion', '').upper()
        fecha_tratamiento = data.get('fecha_tratamiento')
        id_historial = data.get('id_historial')
        monto_costo = data.get('monto')

        
        if not (5 <= len(nombre_tratamiento) <= 50):
            errors['nombre_tratamiento'] = "EL NOMBRE DEL TRATAMIENTO DEBE TENER ENTRE 5 Y 50 CARACTERES."
        elif not nombre_pattern.match(nombre_tratamiento):
            errors['nombre_tratamiento'] = "EL NOMBRE SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS."
        if not (5 <= len(descripcion) <= 200):
            errors['descripcion'] = "LA DESCRIPCIÓN DEBE TENER ENTRE 5 Y 200 CARACTERES."
        elif not descripcion_pattern.match(descripcion):
            errors['descripcion'] = "LA DESCRIPCIÓN SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS."
        
        # Validar campos y crear costo si es válido
        if not id_historial or not HistorialesClinicos.objects.filter(id_historial=id_historial).exists():
            errors['id_historial'] = "ID HISTORIAL NO VÁLIDO."
        if fecha_tratamiento:
            try:
                fecha_tratamiento = datetime.strptime(fecha_tratamiento, '%Y-%m-%d')
                if fecha_tratamiento < datetime.now() or fecha_tratamiento > datetime.now() + timedelta(days=30 * 1):
                    errors['fecha_tratamiento'] = 'La fecha deL tratamiento debe iniciar entre hoy y un mes en adelante.'
            except ValueError:
                errors['fecha_tratamiento'] = 'La fecha de nacimiento debe tener el formato correcto (YYYY-MM-DD).'
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        historial = HistorialesClinicos.objects.get(id_historial=id_historial)
        costo = Costos.objects.create(monto=monto_costo)
        
        nuevo_tratamiento = Tratamientos.objects.create(
            id_historial=historial,
            nombre_tratamiento=nombre_tratamiento,
            descripcion=descripcion,
            fecha_tratamiento=fecha_tratamiento,
            id_costo=costo
        )
        return JsonResponse({"message": "TRATAMIENTO CREADO CORRECTAMENTE"}, status=201)

@csrf_exempt
def tratamiento_list(request, id_historial):
    if request.method == 'GET':
        tratamientos = list(Tratamientos.objects.filter(id_historial=id_historial, activo=True).order_by('-fecha_tratamiento').values())

        if not tratamientos:
            return JsonResponse({'error': 'NO SE ENCONTRARON TRATAMIENTOS PARA ESE ID_HISTORIAL'}, status=404)

        return JsonResponse(tratamientos, safe=False)
    
@csrf_exempt
def tratamiento_costo(request, id_costo):
    if request.method == 'GET':
        try:
            costo = get_object_or_404(Costos, id_costo=id_costo)
            # Serializamos el objeto en un diccionario
            costo_data = {
                'id_costo': costo.id_costo,
                'monto': str(costo.monto),  # Convertimos a string para evitar problemas con Decimal
                'activo': costo.activo
            }
            return JsonResponse(costo_data)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)

    
@csrf_exempt
def tratamiento_detail(request, id_tratamiento):
    tratamiento = get_object_or_404(Tratamientos, id_tratamiento=id_tratamiento)
    
    if request.method == 'GET':
        return JsonResponse({
            "id_tratamiento": tratamiento.id_tratamiento,
            "id_historial": tratamiento.id_historial.id_historial,
            "nombre_tratamiento": tratamiento.nombre_tratamiento,
            "descripcion": tratamiento.descripcion,
            "fecha_tratamiento": tratamiento.fecha_tratamiento,
            "monto":tratamiento.id_costo.monto,
            "estado_tratamiento": tratamiento.estado_tratamiento,
        })

    elif request.method == 'PUT':
        # Cargar el tratamiento específico
        tratamiento = get_object_or_404(Tratamientos, id_tratamiento=id_tratamiento)
        if tratamiento.estado_tratamiento == 'finalizado':
            return JsonResponse({'error': 'NO SE PUEDE EDITAR UN TRATAMIENTO FINALIZADO'}, status=400)
        # Parsear los datos del cuerpo de la solicitud
        data = json.loads(request.body.decode('utf-8'))
        errors = {}
        
        # Actualizar los campos del tratamiento con los datos recibidos
        nombre_tratamiento = data.get('nombre_tratamiento', tratamiento.nombre_tratamiento).upper()
        descripcion = data.get('descripcion', tratamiento.descripcion).upper()
        fecha_tratamiento = data.get('fecha_tratamiento', tratamiento.fecha_tratamiento).upper()
        estado_tratamiento = data.get('estado_tratamiento', tratamiento.estado_tratamiento)

        if not (5 <= len(nombre_tratamiento) <= 50):
            errors['nombre_tratamiento'] = 'EL NOMBRE DEL TRATAMIENTO DEBE TENER ENTRE 5 Y 50 CARACTERES.'
        elif not nombre_pattern.match(nombre_tratamiento):
            errors['nombre_tratamiento'] = 'EL NOMBRE SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS.'
        if not (5 <= len(descripcion) <= 200):
            errors['descripcion'] = 'LA DESCRIPCIÓN DEBE TENER ENTRE 5 Y 200 CARACTERES.'
        elif not descripcion_pattern.match(descripcion):
            errors['descripcion'] = 'LA DESCRIPCIÓN SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS.'   
        if fecha_tratamiento:
            try:
                fecha_tratamiento = datetime.strptime(fecha_tratamiento, '%Y-%m-%d')
                if fecha_tratamiento < datetime.now() or fecha_tratamiento > datetime.now() + timedelta(days=30 * 1):
                    errors['fecha_tratamiento'] = 'La fecha deL tratamiento debe iniciar entre la establecida previamente y un mes en adelante.'
            except ValueError:
                errors['fecha_tratamiento'] = 'La fecha de nacimiento debe tener el formato correcto (YYYY-MM-DD).'
        if errors:
            return JsonResponse({'errors': errors}, status=400)
        tratamiento.nombre_tratamiento = nombre_tratamiento
        tratamiento.descripcion = descripcion
        tratamiento.fecha_tratamiento = fecha_tratamiento
        tratamiento.estado_tratamiento = estado_tratamiento
        # Verificar si el monto también necesita actualización
        if 'monto' in data:
            tratamiento.id_costo.monto = data['monto']
            tratamiento.id_costo.save()

        # Guardar el tratamiento
        tratamiento.save()
        
        return JsonResponse({
            'message': 'TRATAMIENTO ACTUALIZADO EXITOSAMENTE'
        }, status=200)
    
    elif request.method == 'DELETE':
        if tratamiento.estado_tratamiento == 'finalizado':
            return JsonResponse({'error': 'NO SE PUEDE ELIMINAR UN TRATAMIENTO FINALIZADO'}, status=400)
        tratamiento.activo = False  # Eliminación lógica
        tratamiento.save()
        return JsonResponse({"message": "Tratamiento eliminado exitosamente."})
    
@csrf_exempt
def prescripcion_list(request, id_historial):
    if request.method == 'GET':
        tratamientos = list(Prescripciones.objects.filter(id_historial=id_historial, activo=True).order_by('-fecha_inicio').values())

        if not tratamientos:
            return JsonResponse({'error': 'NO SE ENCONTRARON PRESCRIPCIONES PARA ESE ID_HISTORIAL'}, status=404)

        return JsonResponse(tratamientos, safe=False)

@csrf_exempt
def prescripcion_create(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            id_historial = data.get('id_historial')
            prescripciones = data.get('prescripciones')

            if not id_historial or not prescripciones:
                return JsonResponse({'error': 'Faltan datos requeridos.'}, status=400)

            # Procesar las prescripciones
            for prescripcion in prescripciones:
                # Asegúrate de que cada prescripción tenga los campos requeridos
                nombre_medicamento = prescripcion.get('nombre_medicamento')
                dosis = prescripcion.get('dosis')
                fecha_fin = prescripcion.get('fecha_fin')

                if not nombre_medicamento or not dosis or not fecha_fin:
                    return JsonResponse({'error': 'Faltan datos en la prescripción.'}, status=400)

                nueva_prescripcion = Prescripciones(
                    id_historial_id=id_historial,  # Usa el campo foráneo id_historial
                    nombre_medicamento=nombre_medicamento.upper(),
                    dosis=dosis.upper(),
                    fecha_fin=fecha_fin,
                    activo=True  # Asumimos que todas las prescripciones son activas al crearlas
                )
                nueva_prescripcion.save()

            return JsonResponse({'message': 'Prescripciones creadas con éxito.'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Formato de JSON no válido.'}, status=400)

    return JsonResponse({'error': 'Método no permitido.'}, status=405)

dosis_pattern = re.compile(r'^[A-Za-z0-9 ]+$')   # Ajusta según sea necesario

@csrf_exempt
def prescripcion_detail(request, id_medicamento):
    prescripcion = get_object_or_404(Prescripciones, id_medicamento=id_medicamento)

    if request.method == 'GET':
        return JsonResponse({
            "id_medicamento": prescripcion.id_medicamento,
            "id_historial": prescripcion.id_historial.id_historial,
            "nombre_medicamento": prescripcion.nombre_medicamento,
            "dosis": prescripcion.dosis,
            "fecha_inicio": prescripcion.fecha_inicio.strftime('%Y-%m-%d'),
            "fecha_fin": prescripcion.fecha_fin.strftime('%Y-%m-%d'),
            "activo": prescripcion.activo,
        })
    if request.method == 'PUT':
        data = json.loads(request.body.decode('utf-8'))
        errors = {}
        # Actualizar los campos de la prescripción con los datos recibidos
        nombre_medicamento = data.get('nombre_medicamento', prescripcion.nombre_medicamento).upper()
        dosis = data.get('dosis', prescripcion.dosis).upper()
        fecha_fin = data.get('fecha_fin', prescripcion.fecha_fin.strftime('%Y-%m-%d'))

        if not (5 <= len(nombre_medicamento) <= 50):
            errors['nombre_medicamento'] = 'EL NOMBRE DEL MEDICAMENTO DEBE TENER ENTRE 5 Y 50 CARACTERES.'
        elif not nombre_pattern.match(nombre_medicamento):
            errors['nombre_medicamento'] = 'EL NOMBRE SOLO PUEDE CONTENER LETRAS, NÚMEROS Y ESPACIOS.'
        if not (3 <= len(dosis) <= 200):
            errors['dosis'] = 'LA DOSIS DEBE TENER ENTRE 5 Y 200 CARACTERES.'
    
        if fecha_fin:
            try:
                fecha_fin = datetime.strptime(fecha_fin, '%Y-%m-%d')
                if fecha_fin < datetime.now() or fecha_fin > datetime.now() + timedelta(days=30 * 1):
                    errors['fecha_fin'] = 'La fecha de fin debe estar entre hoy y los próximos 30 días.'
            except ValueError:
                errors['fecha_fin'] = 'La fecha fin debe tener el formato correcto (YYYY-MM-DD).'

        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Actualizar los campos de la prescripción
        prescripcion.nombre_medicamento = nombre_medicamento.upper()
        prescripcion.dosis = dosis.upper()
        prescripcion.fecha_fin = fecha_fin

        # Guardar la prescripción
        prescripcion.save()

        return JsonResponse({
            'message': 'PRESCRIPCIÓN ACTUALIZADA EXITOSAMENTE'
        }, status=200)

    elif request.method == 'DELETE':
        prescripcion.activo = False  # Eliminación lógica
        prescripcion.save()
        return JsonResponse({"message": "Prescripción eliminada exitosamente."})
    

@csrf_exempt
def recepcionista_list(request):
    if request.method == 'GET':
        # Filtrar los recepcionistas activos y obtener los datos necesarios desde la tabla Usuarios
        recepcionistas = Recepcionistas.objects.filter(activo=True).select_related('id_recepcionista').values(
            'id_recepcionista','id_recepcionista__direccion', 'id_recepcionista__nombres','id_recepcionista__ci','id_recepcionista__fecha_nacimiento','id_recepcionista__apellidos','id_recepcionista__telefono','id_recepcionista__email', 'activo'
        )
        # Crear una nueva lista con el nombre completo del odontólogo
        recepcionistas_data = [
            {
                'id_usuario': recepcionista['id_recepcionista'],
                'id_recepcionista': recepcionista['id_recepcionista'],
                'ci': recepcionista['id_recepcionista__ci'],
                'fecha_nacimiento': recepcionista['id_recepcionista__fecha_nacimiento'],
                'nombre_completo': f"{recepcionista['id_recepcionista__nombres']} {recepcionista['id_recepcionista__apellidos']}",
                'telefono': recepcionista['id_recepcionista__telefono'],
                'email': recepcionista['id_recepcionista__email'],
                'activo': recepcionista['activo'],
                'nombres': recepcionista['id_recepcionista__nombres'],
                'apellidos': recepcionista['id_recepcionista__apellidos'],
                'direccion': recepcionista['id_recepcionista__direccion']
            }
            for recepcionista in recepcionistas
        ]
        # Enviar la lista como respuesta JSON
        return JsonResponse(recepcionistas_data, safe=False)
    
@csrf_exempt
def recepcionista_create(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        errors = {}
        # Validación y procesamiento de datos de usuario
        nombres = data.get('nombres', '').strip().upper()
        nombres_regex = re.compile(r'^[A-Z\s]+$')
        if not nombres or len(nombres) < 3 or len(nombres) > 100 or not nombres_regex.match(nombres):
            errors['nombres'] = 'El campo Nombres debe ser entre 3 a 100 caracteres.'
        apellidos = data.get('apellidos', '').strip().upper()
        if not apellidos or len(apellidos) < 3 or len(apellidos) > 100 or not nombres_regex.match(apellidos):
            errors['apellidos'] = 'El campo Apellidos debe ser entre 3 a 100 caracteres.'        
        ci = data.get('ci', '').strip()
        if not re.match(r'^\d{6,12}$', ci) or Usuario.objects.filter(ci=ci).exists():
            errors['ci'] = 'Cédula de identidad debe ser entre 6 a 12 caracteres.'
        email = data.get('email', '').strip().upper()
        if not re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email):
            errors['email'] = 'El correo electrónico debe tener este fomato ejemplo@as.com'
        if Usuario.objects.filter(email=email).exists():
            errors['email'] = 'El email ya está en uso.'
        telefono = data.get('telefono', '').strip()
        if not re.match(r'^\d{8}$', telefono):
            errors['telefono'] = 'El teléfono debe contener exactamente 8 dígitos.'
        fecha_nacimiento = data.get('fecha_nacimiento')
        if fecha_nacimiento:
            try:
                fecha_nacimiento = datetime.strptime(fecha_nacimiento, '%Y-%m-%d')
                if fecha_nacimiento < datetime.now() - timedelta(days=365 * 80) or fecha_nacimiento > datetime.now() - timedelta(days=365 * 20):
                    errors['fecha_nacimiento'] = 'La Fecha de nacimiento debe ser entre 80 a 20 años atras a la fecha actual.'
            except ValueError:
                errors['fecha_nacimiento'] = 'Formato incorrecto para la fecha de nacimiento.'
        contrasenia = data.get('contrasenia', '')
        password_regex = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,250}$')
        if not password_regex.match(contrasenia):
            errors['contrasenia'] = 'Contraseña insegura: debe tener minimamente 8 caracteres, letra, numeros y simbolos(@$!%*?&).'
        direccion = data.get('direccion', '').strip().upper()  # Convertir a mayúsculas
        direccion_regex = re.compile(r'^[A-Z0-9\s.]+$')  # Regex modificado para letras mayúsculas
        if not 5 <= len(direccion) <= 255 or not direccion_regex.match(direccion):
            errors['direccion'] = 'La dirección debe tener entre 5 y 255 caracteres y solo contener letras, números, espacios y puntos.'
        
        if not Roles.objects.filter(activo=True, nombre_rol='RECEPCIONISTA').exists():
            return JsonResponse({'error': 'No existe un rol para este tipo de usuario, cree el rol RECEPCIONESTA'}, status=400)

        if errors:
            return JsonResponse({'errors': errors}, status=400)
        rol = Roles.objects.filter(activo=True, nombre_rol='RECEPCIONISTA').values().first()
        # Crear usuario y recepcionista si no hay errores
        usuario = Usuario(
            nombres=nombres,
            apellidos=apellidos,
            ci=ci,
            contrasenia=contrasenia,
            email=email,
            telefono=telefono,
            fecha_nacimiento=fecha_nacimiento,
            rol_id=rol['id_rol'],
            direccion=direccion
        )
        usuario.save()
        recepcionista = Recepcionistas.objects.create(
            id_recepcionista = usuario
        )
        return JsonResponse({'message': 'Recepcionista creado correctamente'}, status=201)

# Vista para obtener los detalles de un odontólogo específico
@csrf_exempt
def recepcionista_detail(request, id_usuario):
    if request.method == 'GET':
        # Fetch the Usuario instance with the given id and that is active
        usuario = get_object_or_404(Usuario, id_usuario=id_usuario, activo=True)
        # Now, retrieve the related Odontologos instance using id_odontologo
        recepcionista = get_object_or_404(Recepcionistas, id_recepcionista=usuario)

        recepcionista_info = {
            'id_usuario': usuario.id_usuario,
            'nombres': usuario.nombres,
            'apellidos': usuario.apellidos,
            'ci': usuario.ci,
            'email': usuario.email,
            'telefono': usuario.telefono
        }
        return JsonResponse(recepcionista_info, status=200)

    if request.method == 'DELETE':
        # Fetch the Usuario instance
        usuario = get_object_or_404(Usuario, id_usuario=id_usuario)

        # Fetch the related Odontologos instance
        recepcionista = get_object_or_404(Recepcionistas, id_recepcionista=usuario)
        #historial_exists = HistorialesClinicos.objects.filter(id_odontologo=odontologo).exists()
        #if historial_exists:
        #    return JsonResponse({'error': 'NO SE PUEDE ELIMINAR. EXISTE UN HISTORIAL ASOCIADO AL ODONTÓLOGO'}, status=400)
        # Perform logical deletion
        usuario.activo = False
        usuario.save()
        # Also mark the related Odontologos as inactive
        recepcionista.activo = False
        recepcionista.save()

        return JsonResponse({'success': 'ODONTÓLOGO ELIMINADOS LÓGICAMENTE'}, status=200)

@csrf_exempt
def cita_list(request):
    if request.method == 'GET':
        # Filtrar las citas activas y obtener los datos necesarios desde las tablas relacionadas
        citas = Citas.objects.filter(activo=True).select_related(
            'id_paciente__id_paciente',  # Acceso indirecto a Usuario desde Paciente
            'id_odontologo__id_odontologo',  # Acceso indirecto a Usuario desde Odontologo
            'id_recepcionista__id_recepcionista',  # Acceso indirecto a Usuario desde Recepcionista
            'id_costo', 'id_horario'
        ).values(
            'id_cita', 'fecha', 'estado_cita', 'id_odontologo', 'id_recepcionista', 'id_paciente', 'id_costo', 'id_horario',
            'id_paciente__id_paciente__nombres', 'id_paciente__id_paciente__apellidos',  # Datos de Usuario desde Paciente
            'id_odontologo__id_odontologo__nombres', 'id_odontologo__id_odontologo__apellidos',  # Datos de Usuario desde Odontologo
            'id_recepcionista__id_recepcionista__nombres', 'id_recepcionista__id_recepcionista__apellidos',  # Datos de Usuario desde Recepcionista
            'id_costo__monto',
            'id_horario__horario',
            'activo'
        )

        # Formatear los datos para enviarlos como respuesta JSON
        citas_data = [
            {
                'id_costo': cita['id_costo'],
                'id_horario': cita['id_horario'],
                'id_odontologo': cita['id_odontologo'],
                'id_recepcionista': cita['id_recepcionista'],
                'id_paciente': cita['id_paciente'],
                'id_cita': cita['id_cita'],
                'fecha': cita['fecha'],
                'estado_cita': cita['estado_cita'],
                'paciente': f"{cita['id_paciente__id_paciente__nombres']} {cita['id_paciente__id_paciente__nombres']}",
                'odontologo': f"{cita['id_odontologo__id_odontologo__nombres']} {cita['id_odontologo__id_odontologo__apellidos']}",
                'recepcionista': f"{cita['id_recepcionista__id_recepcionista__nombres']} {cita['id_recepcionista__id_recepcionista__apellidos']}",
                'monto': cita['id_costo__monto'],
                'horario': cita['id_horario__horario'],
                'activo': cita['activo']
            }
            for cita in citas
        ]

        # Enviar la lista como respuesta JSON
        return JsonResponse(citas_data, safe=False)

@csrf_exempt
def crear_citas_automaticas(request):
    # Fecha actual
    fecha_actual = timezone.now().date()

    # Obtener los odontólogos y horarios activos
    odontologos_activos = Odontologos.objects.filter(activo=True)
    horarios_activos = Horarios.objects.filter(activo=True)

    # Contador de citas creadas y citas omitidas
    citas_creadas = 0
    citas_omitidas = 0

    # Generar citas para los próximos 5 días
    for dias in range(8):
        fecha = fecha_actual + timedelta(days=dias)

        for odontologo in odontologos_activos:
            for horario in horarios_activos:
                # Comprobar si ya existe una cita para el mismo odontólogo, horario y fecha
                existe_cita = Citas.objects.filter(
                    fecha=fecha,
                    id_odontologo=odontologo,
                    id_horario=horario
                ).exists()

                if not existe_cita:
                    costo = Costos.objects.create(
                        monto = 0
                    )
                    # Crear la cita si no existe
                    Citas.objects.create(
                        fecha=fecha,
                        id_odontologo=odontologo,
                        id_horario=horario,
                        id_costo = costo,
                        activo=True
                    )
                    citas_creadas += 1
                else:
                    # Incrementar el contador de citas omitidas
                    citas_omitidas += 1

    # Retornar una respuesta con los resultados
    return JsonResponse({
        "message": "Proceso de creación de citas completado.",
        "citas_creadas": citas_creadas,
        "citas_omitidas": citas_omitidas
    })

@csrf_exempt
def cita_detail(request, id_cita):
    if request.method == 'PUT':
        try:
            cita = get_object_or_404(Citas, id_cita=id_cita)
            data = json.loads(request.body)

            estado_cita = data.get('estado_cita')
            id_paciente = data.get('id_paciente')
            monto = data.get('monto')
            id_costo = data.get('id_costo')
            id_horario = data.get('id_horario')

            # Actualizar los campos específicos
            if estado_cita:
                cita.estado_cita = estado_cita
            if id_paciente:
                paciente = get_object_or_404(Pacientes, id_paciente=id_paciente)
                cita.id_paciente = paciente
            if monto is not None:
                costo = get_object_or_404(Costos, id_costo = id_costo)
                costo.monto = monto
                costo.save()

            cita.save()

            if estado_cita == "programada":
                usuario = Usuario.objects.filter(id_usuario=id_paciente).first() 
                email_paciente = usuario.email
                hora = Horarios.objects.filter(id_horario=id_horario).first()
            
            # Enviar el correo
                send_mail(
                    subject="Confirmación de Cita Programada",
                    message=f"Su cita ha sido programada correctamente para el dia {cita.fecha} a las {hora.horario}",
                    from_email="odomed",
                    recipient_list=[email_paciente],
                    fail_silently=False,
                )
            if estado_cita == "cancelada":
                usuario = Usuario.objects.filter(id_usuario=id_paciente).first() 
                email_paciente = usuario.email
                hora = Horarios.objects.filter(id_horario=id_horario).first()
            
            # Enviar el correo
                send_mail(
                    subject="Avisa de Cita Cancelada",
                    message=f"Su cita del dia {cita.fecha} a las {hora.horario} ha sido cancela",
                    from_email="odomed",
                    recipient_list=[email_paciente],
                    fail_silently=False,
                )
            return JsonResponse({
                "message": "Cita actualizada correctamente"
            }, status=200)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)
    if request.method == 'DELETE':
        # Fetch the Usuario instance
        cita = get_object_or_404(Citas, id_cita=id_cita)
        if cita.estado_cita != 'cancelada':
            return JsonResponse({
                'error': 'Solo se pueden eliminar citas que esten canceladas.'
            }, status=400)
    
        cita.activo = False
        cita.save()
        
        return JsonResponse({'success': 'CITA ELIMINADOS LÓGICAMENTE'}, status=200)
    else:
        return JsonResponse({"error": "Método no permitido"}, status=405)
@csrf_exempt
def get_usuario_por_email(request):
    email = request.GET.get('email', None)
    if email:
        try:
            usuario = Usuario.objects.get(email=email)
            return JsonResponse({
                'id_usuario': usuario.id_usuario,
                'email': usuario.email,
                'nombres': usuario.nombres,
                'rol': usuario.rol.id_rol,  # Incluye el nombre del rol si lo necesitas
            })
        except Usuario.DoesNotExist:
            return JsonResponse({'error': 'Usuario no encontrado'}, status=404)
    return JsonResponse({'error': 'Email no proporcionado'}, status=400)