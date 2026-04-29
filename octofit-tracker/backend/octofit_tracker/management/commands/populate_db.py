from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from djongo import models

# Define models if not already defined in models.py
from octofit_tracker import models as app_models

class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):

        User = get_user_model()
        # Safely clear existing data
        try:
            app_models.Activity.objects.filter().delete()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Could not clear Activity: {e}"))
        try:
            app_models.Leaderboard.objects.filter().delete()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Could not clear Leaderboard: {e}"))
        try:
            app_models.Workout.objects.filter().delete()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Could not clear Workout: {e}"))
        try:
            app_models.Team.objects.filter().delete()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Could not clear Team: {e}"))
        try:
            User.objects.filter().delete()
        except Exception as e:
            self.stdout.write(self.style.WARNING(f"Could not clear User: {e}"))


        # Create Teams
        marvel = app_models.Team.objects.create(name='Marvel')
        dc = app_models.Team.objects.create(name='DC')

        # Create Users (assign team as team name string)
        users = [
            User.objects.create_user(username='ironman', email='ironman@marvel.com', team='Marvel'),
            User.objects.create_user(username='captainamerica', email='cap@marvel.com', team='Marvel'),
            User.objects.create_user(username='batman', email='batman@dc.com', team='DC'),
            User.objects.create_user(username='superman', email='superman@dc.com', team='DC'),
        ]

        # Create Activities (use username string)
        activities = [
            app_models.Activity.objects.create(user='ironman', type='run', duration=30),
            app_models.Activity.objects.create(user='captainamerica', type='cycle', duration=45),
            app_models.Activity.objects.create(user='batman', type='swim', duration=60),
            app_models.Activity.objects.create(user='superman', type='yoga', duration=20),
        ]

        # Create Workouts
        workouts = [
            app_models.Workout.objects.create(name='Morning Cardio', description='Cardio for all'),
            app_models.Workout.objects.create(name='Strength Training', description='Strength for all'),
        ]


        # Create Leaderboard (use team name string)
        app_models.Leaderboard.objects.create(team='Marvel', points=100)
        app_models.Leaderboard.objects.create(team='DC', points=90)

        self.stdout.write(self.style.SUCCESS('octofit_db database populated with test data'))
