from djongo import models
from django.contrib.auth.models import AbstractUser

class Team(models.Model):
    name = models.CharField(max_length=100, unique=True)
    def __str__(self):
        return self.name

class User(AbstractUser):
    email = models.EmailField(unique=True)
    team = models.CharField(max_length=100, null=True, blank=True)  # Store team name

class Activity(models.Model):
    user = models.CharField(max_length=150)  # Store username
    type = models.CharField(max_length=50)
    duration = models.IntegerField()  # Duration in minutes
    def __str__(self):
        return f"{self.user} - {self.type}"

class Workout(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    def __str__(self):
        return self.name

class Leaderboard(models.Model):
    team = models.CharField(max_length=100)  # Store team name
    points = models.IntegerField()
    def __str__(self):
        return f"{self.team}: {self.points}"
