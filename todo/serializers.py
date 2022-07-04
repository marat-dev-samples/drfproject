from rest_framework import serializers
from rest_framework.serializers import HyperlinkedModelSerializer, ModelSerializer
from .models import Project, Note
from authors.models import Author
from customers.models import Customer


class ProjectModelSerializer(HyperlinkedModelSerializer):
    
    users = serializers.PrimaryKeyRelatedField(
        many=True, 
        read_only=False,
        queryset = Customer.objects.all()
    )
    
    #id = serializers.ReadOnlyField()
    project_id = serializers.ReadOnlyField(source='get_id') 
    
    class Meta:
        model = Project
        fields = '__all__' 
        #fields = ['id', 'username', 'first_name', 'last_name', 'email']
 

class NoteModelSerializer(HyperlinkedModelSerializer):
    
    project = serializers.PrimaryKeyRelatedField(
        many=False, 
        read_only=False,
        queryset = Project.objects.all()
    )
    
    #project = serializers.StringRelatedField(many=False)
    
    customer = serializers.PrimaryKeyRelatedField(
        many=False, 
        read_only=False,
        queryset = Customer.objects.all()
    )
  
    """Owner changing is prohibited after creation of the note"""
    #owner = serializers.PrimaryKeyRelatedField(many=False, read_only=True)
    #owner = serializers.SlugRelatedField(many=False, read_only=True, slug_field='username')
    owner = serializers.StringRelatedField(many=False)
    contact = serializers.SerializerMethodField('owner_contact')
    project_str = serializers.SerializerMethodField('project_name')
    #resource = serializers.SerializerMethodField('api_resource')


    class Meta:
        model = Note
        fields = '__all__' 
        #ordering = ['-created']

    def validate_project(self, project):
        """Project name changing is prohibited"""
        try:
            current_project = self.instance.project 
        except Exception as e:
            return project

        if current_project.id != project.id:
            raise serializers.ValidationError("You can't change project name of existed Note")  
        
        return project
 
    def owner_contact(self, obj):
        if obj.owner:
            return obj.owner.email
 
    def project_name(self, obj):
        
        if obj.project:
            return str(obj.project)
 
    #def api_resource(self, obj):
    #    print(dir(obj))
    #    #if obj.owner:
    #    #    return obj.owner.email
    #    return 'resource'

    '''
    # Deprecated
    def validate_customer(self, customer):
        """User changing is prohibited after creation of the note"""
        try:
            current_customer = self.instance.customer 
        except Exception as e:
            return customer
        
        if current_customer.id != customer.id:
            raise serializers.ValidationError("You can't change user which was created existed note")  
        
        return customer
    '''