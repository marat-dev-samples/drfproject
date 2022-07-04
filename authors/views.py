from django.shortcuts import render
from rest_framework.viewsets import ModelViewSet
from .serializers import AuthorModelSerializer
from .models import Author

# Create your views here.
class AuthorModelView(ModelViewSet):
	queryset = Author.objects.all()
	serializer_class = AuthorModelSerializer
