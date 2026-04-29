"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from octofit_tracker import views as api_views


# DRF router for all models
router = routers.DefaultRouter()
router.register(r'users', api_views.UserViewSet)
router.register(r'teams', api_views.TeamViewSet)
router.register(r'activities', api_views.ActivityViewSet)
router.register(r'workouts', api_views.WorkoutViewSet)
router.register(r'leaderboard', api_views.LeaderboardViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.urls import reverse

import os
@api_view(['GET'])
def api_root(request, format=None):
    codespace_name = os.environ.get('CODESPACE_NAME')
    if codespace_name:
        base_url = f"https://{codespace_name}-8000.app.github.dev/api/"
    else:
        base_url = request.build_absolute_uri('/api/')
    return Response({
        'users': base_url + 'users/',
        'teams': base_url + 'teams/',
        'activities': base_url + 'activities/',
        'workouts': base_url + 'workouts/',
        'leaderboard': base_url + 'leaderboard/',
    })

urlpatterns += [
    path('', api_root, name='api-root'),
]
