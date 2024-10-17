from django.db import models

# Model for Roles table
class Roles(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50, unique=True)
    permisos = models.CharField(max_length=200)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'roles'
        managed = False  

# Model for Usuarios table
class Usuario(models.Model):
    id_usuario = models.AutoField(primary_key=True)
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    ci = models.CharField(max_length=100, unique=True)
    email = models.EmailField(unique=True)
    telefono = models.CharField(max_length=20, null=True, blank=True)
    fecha_nacimiento = models.DateField(null=True, blank=True)
    direccion = models.CharField(max_length=255, null=True, blank=True)
    rol = models.ForeignKey(Roles, on_delete=models.CASCADE, db_column='rol_id')  # ForeignKey to Roles
    contrasenia = models.CharField(max_length=255)
    activo = models.BooleanField(default=True)
    codigo = models.IntegerField(default=0)

    class Meta:
        db_table = 'usuarios'
        managed = False

# Model for Citas table
class Citas(models.Model):
    id_cita = models.AutoField(primary_key=True)
    fecha = models.DateField()
    id_paciente = models.ForeignKey('Pacientes', on_delete=models.SET_NULL, null=True, db_column='id_paciente')
    id_odontologo = models.ForeignKey('Odontologos', on_delete=models.SET_NULL, null=True, db_column='id_odontologo')
    id_recepcionista = models.ForeignKey('Recepcionistas', on_delete=models.SET_NULL, null=True, db_column='id_recepcionista')
    estado_cita = models.CharField(max_length=20, choices=[('programada', 'Programada'), ('completada', 'Completada'), ('cancelada', 'Cancelada')])
    id_costo = models.ForeignKey('Costos', on_delete=models.SET_NULL, null=True, db_column='id_costo')
    id_horario = models.ForeignKey('Horarios', on_delete=models.SET_NULL, null=True, db_column='id_horario')
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'citas'
        managed = False

# Model for Costos table
class Costos(models.Model):
    id_costo = models.AutoField(primary_key=True)
    monto = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'costos'
        managed = False

# Model for Diagnosticos table
class Diagnosticos(models.Model):
    id_diagnostico = models.AutoField(primary_key=True)
    id_historial = models.ForeignKey('HistorialesClinicos', on_delete=models.SET_NULL, null=True, db_column='id_historial')
    nombre_diagnostico = models.CharField(max_length=100)
    codigo_diagnostico = models.CharField(max_length=10, null=True, blank=True)
    descripcion = models.TextField(null=True, blank=True)
    fecha_diagnostico = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'diagnosticos'
        managed = False

# Model for HistorialesClinicos table
class HistorialesClinicos(models.Model):
    id_historial = models.AutoField(primary_key=True)
    id_paciente = models.ForeignKey('Pacientes', on_delete=models.SET_NULL, null=True, db_column='id_paciente')
    id_odontologo = models.ForeignKey('Odontologos', on_delete=models.SET_NULL, null=True, db_column='id_odontologo')
    fecha_hora_creacion = models.DateTimeField(auto_now_add=True)
    notas_generales = models.TextField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'historiales_clinicos'
        managed = False

# Model for Horarios table
class Horarios(models.Model):
    id_horario = models.AutoField(primary_key=True)
    horario = models.TimeField()
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'horarios'
        managed = False

# Model for Odontologos table
class Odontologos(models.Model):
    id_odontologo = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, db_column='id_odontologo')
    numero_licencia = models.CharField(max_length=50)
    especializacion = models.CharField(max_length=100, null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'odontologos'
        managed = False

# Model for Pacientes table
class Pacientes(models.Model):
    id_paciente = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, db_column='id_paciente')
    seguro_medico = models.CharField(max_length=100, null=True, blank=True)
    alergias = models.TextField(null=True, blank=True)
    antecedentes_medicos = models.TextField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'pacientes'
        managed = False

# Model for Practicantes table
class Practicantes(models.Model):
    id_practicante = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, db_column='id_practicante')
    universidad = models.CharField(max_length=100, null=True, blank=True)
    fecha_inicio_practicas = models.DateField(null=True, blank=True)
    fecha_fin_practicas = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'practicantes'
        managed = False

# Model for Prescripciones table
class Prescripciones(models.Model):
    id_medicamento = models.AutoField(primary_key=True)
    id_historial = models.ForeignKey(HistorialesClinicos, on_delete=models.SET_NULL, null=True, db_column='id_historial')
    nombre_medicamento = models.CharField(max_length=100, null=True, blank=True)
    dosis = models.CharField(max_length=50, null=True, blank=True)
    fecha_inicio = models.DateField(null=True, blank=True)
    fecha_fin = models.DateField(null=True, blank=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'prescripciones'
        managed = False

# Model for Recepcionistas table
class Recepcionistas(models.Model):
    id_recepcionista = models.OneToOneField(Usuario, on_delete=models.CASCADE, primary_key=True, db_column='id_recepcionista')
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'recepcionistas'
        managed = False

# Model for Resena table
class Resena(models.Model):
    id_resena = models.AutoField(primary_key=True)
    nombre_autor = models.CharField(max_length=100, null=True, blank=True)
    calificacion = models.IntegerField()
    comentario = models.TextField(null=True, blank=True)
    fecha_resena = models.DateTimeField(auto_now_add=True)
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'resena'
        managed = False
        constraints = [
            models.CheckConstraint(check=models.Q(calificacion__gte=1, calificacion__lte=5), name='resena_chk_1')
        ]

# Model for Tratamientos table
class Tratamientos(models.Model):
    id_tratamiento = models.AutoField(primary_key=True)
    id_historial = models.ForeignKey(HistorialesClinicos, on_delete=models.SET_NULL, null=True, db_column='id_historial')
    nombre_tratamiento = models.CharField(max_length=100)
    descripcion = models.TextField(null=True, blank=True)
    fecha_tratamiento = models.DateField(null=True, blank=True)
    id_costo = models.ForeignKey(Costos, on_delete=models.SET_NULL, null=True, db_column='id_costo')
    activo = models.BooleanField(default=True)

    class Meta:
        db_table = 'tratamientos'
        managed = False
