from django.urls import path
from .views import rol_list, rol_detail, rol_create,usuario_list,usuario_detail,usuario_create
from django.http import HttpResponse


def odomed_home(request):
    return HttpResponse("Bienvenido a Odomed.")

urlpatterns = [
    path('', odomed_home, name='odomed_home'),  
    path('roles/', rol_list, name='rol_list'),  # Para obtener la lista de roles
    path('roles/<int:id_rol>/', rol_detail, name='rol_detail'),  # Para obtener, actualizar y eliminar un rol específico
    path('roles/create/', rol_create, name='rol_create'),  # Para crear un nuevo rol
    path('usuario/', usuario_list, name='usuario_list'),  
    path('usuario/<int:id_usuario>/', usuario_detail, name='usuario_detail'),  
    path('usuario/create/', usuario_create, name='usuario_create'),  


]
