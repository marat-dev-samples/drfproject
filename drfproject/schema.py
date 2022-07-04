import graphene
from graphene import ObjectType, Field, Int
from graphene_django import DjangoObjectType

#import sys
#sys.path.append(".") # Adds higher directory to python modules path.
from todo.models import Project, Note


class NoteType(DjangoObjectType):

    class Meta:
        model = Note
        fields = '__all__'


class ProjectType(DjangoObjectType):
    notes = graphene.List(NoteType)
    
    class Meta:
        model = Project
        fields = '__all__'

    def resolve_project_id(self, info): 
        return self.id
    
    def resolve_notes(self, info):
        return Note.objects.filter(project=self).exclude(status='Closed')


class Query(graphene.ObjectType):

    project = graphene.List(ProjectType, id=graphene.Int())
    projects = graphene.List(ProjectType)

    def resolve_project(self, info, id=None):
       	return Project.objects.filter(id=id)
 
    def resolve_projects(self, info):
        return Project.objects.all()

schema = graphene.Schema(query=Query)


