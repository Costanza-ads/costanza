from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

class CustomUser(AbstractUser):
    pass

# Model para o perfil do usuário com campos adicionais, com o relacionamento OneToOne com CustomUser
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    nome = models.CharField(max_length=255)
    arroba = models.CharField(max_length=255, unique=True)
    stack = models.CharField(max_length=255)
    bio = models.TextField()
    # Os campos com editable=False não podem ser alterados diretamente via admin ou forms
    skills = models.CharField(max_length=255)
    xp = models.IntegerField(default=0, editable=False)
    exercicios_concluidos = models.IntegerField(default=0, editable=False)
    trilhas_concluidas = models.IntegerField(default=0, editable=False)
    dias_conectados = models.IntegerField(default=0, editable=False)

    def __str__(self):
        return self.nome

