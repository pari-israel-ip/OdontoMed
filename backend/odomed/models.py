from django.db import models

#modelos de roles
class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50, unique=True)
    permisos = models.CharField(max_length=200)
    activo = models.BooleanField(default=True) 
    
    class Meta:
        managed = False
        db_table = 'roles'


#modelos de usuario
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    ci = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    contrasenia = models.CharField(max_length=255)
    activo = models.BooleanField(default=True) 

    class Meta:
        managed = False  # No queremos que Django gestione esta tabla
        db_table = 'usuarios'