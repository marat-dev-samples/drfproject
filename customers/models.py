from django.db import models
from django.contrib.auth.models import AbstractUser


class Customer(AbstractUser):
    email = models.EmailField(blank=False, null=False, unique=True)

    def __str__(self):
        #return f'[{self.id}] {self.first_name} {self.last_name} {self.email}'
        return f'{self.first_name} {self.last_name}'
