from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Roles,Usuario
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate
import json

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

        # Validar nombre_rol
        nombre_rol = data.get('nombre_rol', '').strip()
        if not nombre_rol:
            errors['nombre_rol'] = 'El nombre del rol es obligatorio.'
        elif Roles.objects.filter(nombre_rol=nombre_rol).exists():
            errors['nombre_rol'] = 'El nombre del rol ya está en uso.'

        # Validar permisos
        permisos = data.get('permisos', '').strip()
        if not permisos:
            errors['permisos'] = 'Debe seleccionar al menos un permiso.'

        # Si hay errores, devolvemos el diccionario de errores
        if errors:
            return JsonResponse({'errors': errors}, status=400)

        # Si no hay errores, creamos el rol
        rol = Roles.objects.create(
            nombre_rol=nombre_rol,
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