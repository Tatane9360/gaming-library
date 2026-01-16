from rest_framework import serializers
from .models import Game, Player, Loan


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Game
        fields = "__all__"


class PlayerSerializer(serializers.ModelSerializer):
    active_loans_count = serializers.ReadOnlyField()

    class Meta:
        model = Player
        fields = ["id", "first_name", "last_name", "email", "active_loans_count"]


class LoanSerializer(serializers.ModelSerializer):
    game_title = serializers.CharField(source="game.title", read_only=True)
    player_name = serializers.CharField(source="player.__str__", read_only=True)

    class Meta:
        model = Loan
        fields = [
            "id",
            "game",
            "game_title",
            "player",
            "player_name",
            "loan_date",
            "return_date",
            "is_returned",
        ]
