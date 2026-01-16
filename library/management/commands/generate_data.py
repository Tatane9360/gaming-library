import random
from django.core.management.base import BaseCommand
from faker import Faker
from library.models import Game, Player, Loan
from datetime import timedelta


class Command(BaseCommand):
    help = "Generates random data for the game library"

    def add_arguments(self, parser):
        parser.add_argument("--games", type=int, default=20)
        parser.add_argument("--players", type=int, default=15)
        parser.add_argument("--loans", type=int, default=30)

    def handle(self, *args, **options):
        fake = Faker()

        # Clear existing data optional? Let's keep it for now or just add
        # self.stdout.write('Clearing existing data...')
        # Loan.objects.all().delete()
        # Game.objects.all().delete()
        # Player.objects.all().delete()

        self.stdout.write("Generating games...")
        genres = ["Action", "RPG", "Adventure", "Sports", "Strategy", "FPS", "Racing"]
        platforms = ["PC", "PS5", "Xbox Series X", "Nintendo Switch"]
        studios = [
            "Nintendo",
            "Ubisoft",
            "Sony",
            "EA",
            "Rockstar Games",
            "CD Projekt Red",
        ]

        games = []
        for _ in range(options["games"]):
            game = Game.objects.create(
                title=fake.catch_phrase(),
                studio=random.choice(studios),
                genre=random.choice(genres),
                platform=random.choice(platforms),
                release_date=fake.date_between(start_date="-5y", end_date="today"),
                is_available=True,
            )
            games.append(game)

        self.stdout.write("Generating players...")
        players = []
        for _ in range(options["players"]):
            player = Player.objects.create(
                first_name=fake.first_name(),
                last_name=fake.last_name(),
                email=fake.unique.email(),
            )
            players.append(player)

        self.stdout.write("Generating loans...")
        for _ in range(options["loans"]):
            game = random.choice(games)
            player = random.choice(players)

            # Decide if it's a past loan or current
            is_returned = random.choice([True, False])
            loan_date = fake.date_between(start_date="-1y", end_date="-10d")

            if is_returned:
                return_date = loan_date + timedelta(days=random.randint(1, 14))
                Loan.objects.create(
                    game=game,
                    player=player,
                    loan_date=loan_date,
                    return_date=return_date,
                    is_returned=True,
                )
            else:
                # If not returned, make sure the game is marked as unavailable
                # if there is an active loan
                if game.is_available:
                    Loan.objects.create(
                        game=game, player=player, loan_date=loan_date, is_returned=False
                    )
                    game.is_available = False
                    game.save()

        self.stdout.write(
            self.style.SUCCESS(
                f"Successfully generated {options['games']} games, {options['players']} players and loans."
            )
        )
