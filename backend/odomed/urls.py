from django.urls import path
from .views import diagnostico_list, diagnostico_create, diagnostico_detail, login, rol_list, rol_detail, rol_create,usuario_list,rol_list_paciente,usuario_detail,usuario_create, odontologo_list, paciente_detail,historial_detail
from django.http import HttpResponse




def odomed_home(request):
    return HttpResponse("Bienvenido a Odomed.")

urlpatterns = [
    path('', odomed_home, name='odomed_home'),  
    path('roles/', rol_list, name='rol_list'),  # Para obtener la lista de roles
    path('roles/paciente/', rol_list_paciente, name='rol_list_paciente'),  # Para obtener la lista de roles
    path('roles/<int:id_rol>/', rol_detail, name='rol_detail'),  # Para obtener, actualizar y eliminar un rol específico
    path('roles/create/', rol_create, name='rol_create'),  # Para crear un nuevo rol
    path('usuario/', usuario_list, name='usuario_list'),  
    path('usuario/<int:id_usuario>/', usuario_detail, name='usuario_detail'),  
    path('usuario/create/', usuario_create, name='usuario_create'),  
    path('odontologo/', odontologo_list, name='odontologo_list'),  
    path('paciente/<int:id_paciente>/', paciente_detail, name='paciente_detail'),  
    path('historial/<int:id_historial>/', historial_detail, name='historial_detail'),  
    path('diagnostico/<int:id_diagnostico>/', diagnostico_detail, name='diagnostico_detail'),  
    path('diagnostico/create/', diagnostico_create, name='diagnostico_create'),  
    path('diagnostico/historial/<int:id_historial>/', diagnostico_list, name='diagnostico_list'),  
    path('paciente/', paciente_detail, name='paciente_list'),  

    path('login/', login, name='login'),  # Ruta para el login
]
