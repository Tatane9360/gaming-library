from django.db import models


class Game(models.Model):
    title = models.CharField(max_length=200)
    studio = models.CharField(max_length=200)
    genre = models.CharField(max_length=100)
    platform = models.CharField(max_length=100)
    release_date = models.DateField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.title


class Player(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    @property
    def active_loans_count(self):
        return self.loans.filter(is_returned=False).count()


class Loan(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE, related_name="loans")
    player = models.ForeignKey(Player, on_delete=models.CASCADE, related_name="loans")
    loan_date = models.DateField(auto_now_add=True)
    return_date = models.DateField(null=True, blank=True)
    is_returned = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.game.title} - {self.player} ({'Returned' if self.is_returned else 'Active'})"
