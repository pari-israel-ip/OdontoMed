from django.shortcuts import render

# Create your views here.
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Roles
from django.views.decorators.csrf import csrf_exempt
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
        rol = Roles.objects.create(
            nombre_rol=data.get('nombre_rol'),
            permisos=data.get('permisos')
        )
        return JsonResponse({'id_rol': rol.id_rol, 'nombre_rol': rol.nombre_rol, 'permisos': rol.permisos}, status=201)