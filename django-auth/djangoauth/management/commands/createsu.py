#!/usr/bin/env python
import os
from django.core.management.base import BaseCommand
from djangoauth.models import User


class Command(BaseCommand):

    def handle(self, *args, **options):
        if User.objects.count() == 0:
            password = os.environ['ADMIN_PASSWORD']
            admin = User.objects.create_superuser(password=password)
            admin.save()
            print("Created admin")
        else:
            print('Admin user can only be initialized if no user exist')