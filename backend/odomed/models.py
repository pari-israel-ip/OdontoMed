from django.db import models

class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50)
    permisos = models.CharField(max_length=200)
    activo = models.BooleanField(default=True) 

    class Meta:
        managed = False
        db_table = 'roles'
