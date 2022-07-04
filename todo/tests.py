from django.test import TestCase
import json
from django.test import TestCase
from rest_framework import status
from rest_framework.test import APIRequestFactory, force_authenticate, APIClient, APISimpleTestCase, APITestCase
from mixer.backend.django import mixer
#from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from .views import ProjectViewSet
from .models import Project, Note

#from ..customers.models import Customer

class TestProject(TestCase):
	
    def setUp(self, username='luke', password='luke'):
        User = get_user_model()        
        self.user = User.objects.create_user(username, 'random@mail.com', password)
   
    def test_list_projects(self):
        return

    def test_create_prject(self, url='/api/projects/'):
        factory = APIRequestFactory()
        payload = {'users': [1], 'project_name': 'New project', 'repo_link': 'http://github.com'}
        request = factory.post(url, payload, format='json')
        force_authenticate(request, self.user)
        view = ProjectViewSet.as_view({'post': 'create'})
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return

    def test_delete_project(self):
        return

class TestResourcePermissions(TestCase):
    """ Testing resources permissions, restricted access of unauthorized users. 
        
        Utilizes `APIClient` to easy control user authentication
    
    """
    def setUp(self, username='luke', password='luke'):
        User = get_user_model()        
        self.user = User.objects.create_user(username, 'random@mail.com', password)
   
    def test_project(self, url='/api/projects/'):
        project = mixer.blend(Project)
        self.is_authenticated(f'{url}{project.id}/')

    def is_authenticated(self, url):
        """ Checks `IsAuthenticated` permissions fro corresponding resource"""

        client = APIClient()                   
        
        # Expect 401 for not authenticated request
        response = client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        client.force_authenticate(self.user) 
        
        # Expect 200 status for authenticated request 
        response = client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def is_admin(self, url):
        """Checks `IsAdminUser` permissions fro corresponding resource"""

        return

class TestNote(APITestCase):
    
    def setUp(self, url='/api/todo/', username='luke', password='luke'):
        """Setup user, login internal client, creates test instances"""
     
        self.url = url
        User = get_user_model()        
        self.user = User.objects.create_user(username, 'random@mail.com', password)
        self.client.force_login(self.user) 
        self.project = mixer.blend(Project)
        self.note = mixer.blend(Note)
  
    def test_create_note(self):
        payload = {'project': 1, 'customer': 1, 'text': 'sdfsdfsdfsdfsdf', 'status': 'Active', 'camel_case_field': 'Not null'}
        response = self.client.post(self.url, payload, format='json')
        #print(response.data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        return

    def test_retrieve_notes(self):
        
        # Retrieve list of notes 
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Retrieve single note         
        response = self.client.get(f'{self.url}{self.note.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        return

    def test_update_note(self):
        """In progress"""
        return

    def test_delete_note(self):
        """In progress"""
        return




