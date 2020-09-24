from django.db import models
from django.contrib.auth.models import PermissionsMixin
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import BaseUserManager
from django.utils.translation import ugettext_lazy as _

class CustomUserManager(BaseUserManager):
    """
    Custom user model where the email address is the unique identifier
    and has an is_admin field to allow access to the admin app
    """
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError(_("The username must be set"))
        if not password:
            raise ValueError(_("The password must be set"))
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, password, **extra_fields):
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('name', 'Admin')
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('roles', 'activeanno_admin,activeanno_manager,activeanno_user,activeanno_producer,activeanno_consumer,activeanno_global_search')
        return self.create_user("admin", password, **extra_fields)


# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = {
        'JWT_ROLE_ADMIN': 'activeanno_admin',
        'JWT_ROLE_MANAGER': 'activeanno_manager',
        'JWT_ROLE_USER': 'activeanno_user',
        'JWT_ROLE_PRODUCER': 'activeanno_producer',
        'JWT_ROLE_CONSUMER': 'activeanno_consumer',
        'JWT_ROLE_GLOBAL_SEARCH': 'activeanno_global_search'
    }

    class Meta:
        verbose_name = 'user'
        verbose_name_plural = 'users'

    username = models.CharField(max_length=255, unique=True)  # sub
    name = models.CharField(max_length=255, blank=True)  # name
    roles = models.CharField(max_length=3000, blank=True, default='',
                             verbose_name="Roles",
                             help_text='The following roles are possible and should be separated by "," without whitespace: ' + ", ".join(ROLE_CHOICES.values()))  # comma separated string
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = []

    objects = CustomUserManager()
