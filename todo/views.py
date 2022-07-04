from rest_framework.viewsets import ModelViewSet, ViewSet, GenericViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from rest_framework import viewsets, generics, mixins
from rest_framework.response import Response
from rest_framework.renderers import JSONRenderer, BrowsableAPIRenderer
from djangorestframework_camel_case.render import CamelCaseJSONRenderer
from django_filters import rest_framework as filters

from rest_framework.permissions import IsAuthenticated

from .serializers import ProjectModelSerializer, NoteModelSerializer
from .models import Project, Note


class ProjectCustomPagination(PageNumberPagination):
    page_size = 10

    
class NoteCustomPagination(PageNumberPagination):
    page_size = 20

    '''
    def get_paginated_response(self, data):
        return Response({
            'links': {
                'next': self.get_next_link(),
                'previous': self.get_previous_link()
            },
            'count': self.page.paginator.count,
            'results': data
        })
    '''


class NoteFilter(filters.FilterSet):
    created = filters.DateTimeFromToRangeFilter(field_name="created")
    
    status = filters.CharFilter(field_name='status')
    
    status__not = filters.CharFilter(field_name='status', exclude=True)

    #created = filters.DateTimeFilter(field_name='created')
   
    class Meta:
        model = Note
        fields = ['status', 'created']


class ProjectViewSet(ModelViewSet):
    permission_classes = [IsAuthenticated]
    queryset = Project.objects.all()
    serializer_class = ProjectModelSerializer
    renderer_classes = [CamelCaseJSONRenderer, JSONRenderer, BrowsableAPIRenderer]
    pagination_class = ProjectCustomPagination
    search_fields = ['$project_name',]
    #filterset_fields = ['project_name']

    
class NoteViewSet(ModelViewSet):
    """ This endpoint interacts with ToDo notes. 
    
    It supports creation, retrieving list, retrieving single note, update info, delete note. 

    Concider than fiels `project` and `owner` can't be updated after creation because
    ToDo note is binded to specific project. 
    Also `delete` action performs status changing to 'closed' instead of direct ToDo note deletion. 

    """
  
    permission_classes = [IsAuthenticated]
    queryset = Note.objects.all()
    serializer_class = NoteModelSerializer
    
    renderer_classes = [CamelCaseJSONRenderer, JSONRenderer, BrowsableAPIRenderer]
    
    pagination_class = NoteCustomPagination
    filterset_class = NoteFilter
    #filterset_fields = ['status', 'created']
    
    def list(self, request):
        """
        Direct filtering for list view to return only active Notes by default.
        You may utilize search param `status` to query notes with another statuses.
        """
         
        #print(request) 



        # Set default `Active` status if it's not being passed or empty
        query_params = self.request.query_params.copy()
        status = self.request.query_params.get('status', 'Active')
        
        if status != 'Closed':
            query_params['status__not'] = 'Closed'    
        #query_params['status'] = status if status else 'Active' 

        # Apply filtering and return result
        notes = NoteFilter(query_params)
        serializer = NoteModelSerializer(notes.qs, many=True, partial=True, context={'request': request})
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        note = Note.objects.get(id=kwargs.get('pk')) 
        note.disable()  
        text = ("Your Todo note has not being destroyed, " 
                "you may return it by changing `Status` field")
        return Response({'content': text})

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)






"""
'AllValuesFilter', 'AllValuesMultipleFilter', 'BaseCSVFilter', 'BaseInFilter', 
'BaseRangeFilter', 'BooleanFilter', 'CharFilter', 'ChoiceFilter', 'DateFilter', 
'DateFromToRangeFilter', 'DateRangeFilter', 'DateTimeFilter', 
'DateTimeFromToRangeFilter', 'DjangoFilterBackend', 'DurationFilter', 
'Filter', 'FilterSet', 'IsoDateTimeFilter', 'IsoDateTimeFromToRangeFilter', 
'LookupChoiceFilter', 'ModelChoiceFilter', 'ModelMultipleChoiceFilter', 
'MultipleChoiceFilter', 'NumberFilter', 'NumericRangeFilter', 'OrderingFilter', 
'RangeFilter', 'TimeFilter', 'TimeRangeFilter', 'TypedChoiceFilter', 
'TypedMultipleChoiceFilter', 'UUIDFilter', 
"""
