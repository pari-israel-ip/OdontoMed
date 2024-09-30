from django.db import models


class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50)
    permisos = models.CharField(max_length=200)


    class Meta:
        managed = False  # No queremos que Django gestione esta tabla
        db_table = 'roles'
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
    class Meta:
        managed = False  # No queremos que Django gestione esta tabla
        db_table = 'usuarios'