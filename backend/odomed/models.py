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
class Paciente(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True)
    seguro_medico = models.CharField(max_length=100, blank=True, null=True)
    alergias = models.TextField(blank=True, null=True)
    antecedentes_medicos = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    class Meta:
        managed = False
        db_table= 'pacientes'
    def __str__(self):
        return f"Paciente: {self.usuario.nombres} {self.usuario.apellidos}"

class Odontologo(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True)
    numero_licencia = models.CharField(max_length=50)
    especializacion = models.CharField(max_length=100, blank=True, null=True)
    activo = models.BooleanField(default=True)
    class Meta:
        managed = False
        db_table= 'odontologo'
    def __str__(self):
        return f"Odontólogo: {self.usuario.nombres} {self.usuario.apellidos}"

class Recepcionista(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True)
    activo = models.BooleanField(default=True)
    class Meta:
        managed = False
        db_table= 'recepcionista'
    def __str__(self):
        return f"Recepcionista: {self.usuario.nombres} {self.usuario.apellidos}"

class Practicante(models.Model):
    usuario = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True)
    universidad = models.CharField(max_length=100, blank=True, null=True)
    fecha_inicio_practicas = models.DateField(blank=True, null=True)
    fecha_fin_practicas = models.DateField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    class Meta:
        managed = False
        db_table= 'practicante'
    def __str__(self):
        return f"Practicante: {self.usuario.nombres} {self.usuario.apellidos}"