from rest_framework import viewsets
from rest_framework import mixins
from rest_framework.views import APIView
from rest_framework.response import Response

from .serializers import CustomerModelSerializer, CustomerLoginSerializer, CustomerLoginExtSerializer
from .models import Customer


class CustomerModelView(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = Customer.objects.all()
    serializer_class = CustomerModelSerializer

    '''
    def destroy(self, request, *args, **kwargs):
        return Response({'error': 'Operation prohibited'}, status=status.HTTP_400_BAD_REQUEST)
    '''

'''
class CustomerCurrentView1(APIView):
    """View based version""" 
    def get(self, request):
        serializer = CustomerLoginSerializer(request.user, context={'request': request})
        print(dir(request.user)) 
        return Response(serializer.data)
'''



class CustomerCurrentView(viewsets.ViewSet):

    """Viewset based version"""




    def retrieve(self, request, pk=None):
        serializer_class = CustomerLoginSerializer
        if self.request.version == '2.0':
            serializer_class = CustomerLoginExtSerializer
        
        serializer = serializer_class(request.user, context={'request': request})
        
        return Response(serializer.data)


