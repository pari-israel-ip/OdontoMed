from django.db import models

class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50)
    permisos = models.CharField(max_length=200)

    class Meta:
        managed = False  # No queremos que Django gestione esta tabla
        db_table = 'roles'
