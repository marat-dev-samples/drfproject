import datetime
from rest_framework.serializers import HyperlinkedModelSerializer, ReadOnlyField
from .models import Customer


class CustomerModelSerializer(HyperlinkedModelSerializer):
    
    #id = serializers.ReadOnlyField()
    last_login = ReadOnlyField() 
    
    class Meta:
        model = Customer
        #fields = '__all__' 
        fields = ['id','url', 'username', 'first_name', 'last_name', 'email', 'last_login']

    def get_last_login(self):
      return datetime.datetime.now()


class CustomerLoginSerializer(HyperlinkedModelSerializer):
    
    last_login = ReadOnlyField() 
    is_authenticated = ReadOnlyField() 
    is_active = ReadOnlyField() 
    
    class Meta:
        model = Customer
        fields = ['username', 'url', 'last_login', 'is_authenticated', 'is_active']
 
 




class CustomerLoginExtSerializer(HyperlinkedModelSerializer):
    
    last_login = ReadOnlyField() 
    is_authenticated = ReadOnlyField() 
    is_active = ReadOnlyField() 
    
    is_superuser = ReadOnlyField() 
    is_staff = ReadOnlyField() 
    
    class Meta:
        model = Customer
        fields = ['username', 'url', 'last_login', 'is_authenticated', 
                  'is_active', 'is_superuser', 'is_staff']
 
