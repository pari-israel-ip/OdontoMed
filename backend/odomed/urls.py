from django.urls import path
from .views import login, rol_list, rol_detail, rol_create,usuario_list, usuario_detail, usuario_create, paciente_list, paciente_detail, paciente_create,odontologo_list, odontologo_detail, odontologo_create,recepcionista_list, recepcionista_detail, recepcionista_create,practicante_list, practicante_detail, practicante_create
from django.http import HttpResponse




def odomed_home(request):
    return HttpResponse("Bienvenido a Odomed.")

urlpatterns = [
    path('', odomed_home, name='odomed_home'),  
    path('roles/', rol_list, name='rol_list'),  # Para obtener la lista de roles
    path('roles/<int:id_rol>/', rol_detail, name='rol_detail'),  # Para obtener, actualizar y eliminar un rol específico
    path('roles/create/', rol_create, name='rol_create'),  # Para crear un nuevo rol
    #Rutas Usuario
    path('usuario/', usuario_list, name='usuario_list'),  
    path('usuario/<int:id_usuario>/', usuario_detail, name='usuario_detail'),  
    path('usuario/create/', usuario_create, name='usuario_create'),  
    path('odontologo/', odontologo_list, name='odontologo_list'),  
    path('paciente/<int:id_paciente>/', paciente_detail, name='paciente_detail'),  
    path('historial/<int:id_historial>/', historial_detail, name='historial_detail'),  
    path('login/', login, name='login'),  # Ruta para el login
    # Rutas para Pacientes
    path('pacientes/', paciente_list, name='paciente_list'),  # Para obtener la lista de pacientes
    path('pacientes/<int:id_paciente>/', paciente_detail, name='paciente_detail'),  # Para obtener, actualizar y eliminar un paciente específico
    path('pacientes/create/', paciente_create, name='paciente_create'),  # Para crear un nuevo paciente

    # Rutas para Odontólogos
    path('odontologos/', odontologo_list, name='odontologo_list'),  # Para obtener la lista de odontólogos
    path('odontologos/<int:id_odontologo>/', odontologo_detail, name='odontologo_detail'),  # Para obtener, actualizar y eliminar un odontólogo específico
    path('odontologos/create/', odontologo_create, name='odontologo_create'),  # Para crear un nuevo odontólogo

    # Rutas para Recepcionistas
    path('recepcionistas/', recepcionista_list, name='recepcionista_list'),  # Para obtener la lista de recepcionistas
    path('recepcionistas/<int:id_recepcionista>/', recepcionista_detail, name='recepcionista_detail'),  # Para obtener, actualizar y eliminar un recepcionista específico
    path('recepcionistas/create/', recepcionista_create, name='recepcionista_create'),  # Para crear un nuevo recepcionista

    # Rutas para Practicantes
    path('practicantes/', practicante_list, name='practicante_list'),  # Para obtener la lista de practicantes
    path('practicantes/<int:id_practicante>/', practicante_detail, name='practicante_detail'),  # Para obtener, actualizar y eliminar un practicante específico
    path('practicantes/create/', practicante_create, name='practicante_create'),  # Para crear un nuevo practicante
]
