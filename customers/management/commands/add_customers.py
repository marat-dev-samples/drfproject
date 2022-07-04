from django.core.management.base import BaseCommand
from customers.models import Customer
from collections import namedtuple

      
class Command(BaseCommand):
    
    def handle(self, *args, **options):
        """Service script to create superuser and system users as well"""

        UserCredentials = namedtuple('UserCredentials', ['username', 'first_name', 'last_name', 'email', 'password', 'is_superuser'])
        customers = [                      
            UserCredentials('admin', 'John', 'Doe', 'admin@gmail.com', 'admin', True),
            UserCredentials('luke', 'Luke', 'Skywalker', 'lukeskywalker@gmail.com', 'luke', False), 
            UserCredentials('R2D2', 'R2', 'D2', 'droid@gmail.com', 'R2D2', False), 
        ]
        for credentials in customers:
            try:
                self.add_customer(credentials)
            except Exception as e:
                print(f'[-] Failed to create customer: {credentials._asdict()} \n {e}')
        
        print(f'\nFollowing customers been created for test purposes:')
        for customer in Customer.objects.all():
            print(f'{customer.id} {customer.username} {customer.email} (admin: {customer.is_superuser})')

    def add_customer(self, credentials):
        """Creates `Customer` based system user, with provided credentials"""

        customer = Customer(**credentials._asdict())
        customer.set_password(credentials.password)
        
        if credentials.is_superuser:
            customer.is_staff = True
            customer.is_superuser = True 
     
        customer.save()
        


