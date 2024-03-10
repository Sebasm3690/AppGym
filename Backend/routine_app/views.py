from rest_framework import viewsets
from .serializer import AdminSerializer
from .models import Administrador

class TaskView(viewsets.ModelViewSet):
	serializer_class = AdminSerializer
	queryset = Administrador.objects.all()
	