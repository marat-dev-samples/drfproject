from urllib.parse import urlparse
from django.db import models
from django.core.exceptions import ValidationError
from datetime import datetime
from customers.models import Customer


def validate_repo(value):
    hosts = ['github.com', 'bitbucket.org']
    if not value:
        return  
    obj = urlparse(value)
    print(obj.hostname)
    if obj.hostname not in hosts:
        raise ValidationError(f'Only listed services are allowed, please use: {", ".join(hosts)}')


class Project(models.Model):
    project_name = models.CharField('Project name', max_length=64)
    repo_link = models.URLField('Repository link', max_length=255, validators=[validate_repo])
    users = models.ManyToManyField(Customer)
    #notes = models.ForeignKey(Note, related_name='%(class)s_Note')    

    def get_id(self):
        return self.id

    def __str__(self):
        return self.project_name


class Note(models.Model):
    
    ACTIVE = 'Active'
    PROGRESS = 'Progress'
    DONE = 'Done'
    CLOSED = 'Closed'

    STATUS = [
        (ACTIVE, 'Active'),
        (PROGRESS, 'Progress'),
        (DONE, 'Done'),
        (CLOSED, 'Closed'),
    ]

    project = models.ForeignKey(Project, unique=False, on_delete=models.CASCADE)
    

    customer = models.ForeignKey(Customer, unique=False, on_delete=models.CASCADE)
    owner = models.ForeignKey(Customer, unique=False, on_delete=models.CASCADE, 
                              related_name='owner', null=True)
    
    text = models.CharField('Note', max_length=255)
    created = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)
    updated = models.DateTimeField(auto_now_add=False, auto_now=True, blank=True)
    status = models.CharField(choices=STATUS, default=ACTIVE, max_length=16)
    camel_case_field = models.CharField(default='From task with "*"', max_length=16, null=True)

    class Meta:
        ordering = ['-created']
    
    def disable(self):
        self.status = 'Closed'
        self.save()

    def __str__(self):
        return self.text
