from django.db import models


class Author(models.Model):
    first_name = models.CharField('First name', max_length=64)
    last_name = models.CharField('Last name', max_length=64)
    birth_year = models.PositiveSmallIntegerField()

    def __str__(self):
        return f'{self.first_name} {self.last_name}'
    
   
    