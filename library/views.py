from django.shortcuts import get_object_or_404
from django.http import HttpResponse, JsonResponse
from .models import Game, Player, Loan
import csv
from django.template.loader import render_to_string
from datetime import date
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth.models import User
from .serializers import GameSerializer, PlayerSerializer, LoanSerializer

try:
    from weasyprint import HTML

    WEASYPRINT_AVAILABLE = True
except (ImportError, OSError):
    WEASYPRINT_AVAILABLE = False


# API ViewSets
class GameViewSet(viewsets.ModelViewSet):
    queryset = Game.objects.all().order_by("title")
    serializer_class = GameSerializer


class PlayerViewSet(viewsets.ModelViewSet):
    queryset = Player.objects.all().order_by("last_name")
    serializer_class = PlayerSerializer


class LoanViewSet(viewsets.ModelViewSet):
    queryset = Loan.objects.all().order_by("-loan_date")
    serializer_class = LoanSerializer


# Functional Views
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def return_game(request, pk):
    loan = get_object_or_404(Loan, pk=pk)
    # Check if the loan belongs to the user
    if loan.user != request.user:
        return Response(
            {"error": "Accès non autorisé"}, status=status.HTTP_403_FORBIDDEN
        )

    if not loan.is_returned:
        loan.is_returned = True
        loan.return_date = date.today()
        loan.save()
        loan.game.is_available = True
        loan.game.save()
    return Response(status=status.HTTP_204_NO_CONTENT)


def game_pdf(request, pk):
    game = get_object_or_404(Game, pk=pk)
    if not WEASYPRINT_AVAILABLE:
        return HttpResponse("PDF Export requires GTK+ on Windows.", status=501)

    loans = game.loans.all().order_by("-loan_date")
    html_string = render_to_string(
        "library/game_pdf_template.html",
        {"game": game, "loans": loans, "today": date.today()},
    )
    pdf = HTML(string=html_string).write_pdf()

    response = HttpResponse(pdf, content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="game_{game.id}.pdf"'
    return response


def export_games_csv(request):
    response = HttpResponse(content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="games_export.csv"'
    writer = csv.writer(response)
    writer.writerow(
        ["Title", "Studio", "Genre", "Platform", "Release Date", "Available"]
    )
    for game in Game.objects.all():
        writer.writerow(
            [
                game.title,
                game.studio,
                game.genre,
                game.platform,
                game.release_date,
                game.is_available,
            ]
        )
    return response


def export_games_json(request):
    games = list(Game.objects.values())
    return JsonResponse(games, safe=False)


@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get("username")
    password = request.data.get("password")
    email = request.data.get("email")

    if not username or not password:
        return Response(
            {"error": "Veuillez fournir un nom d'utilisateur et un mot de passe"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Ce nom d'utilisateur est déjà pris"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    User.objects.create_user(username=username, password=password, email=email)
    return Response(
        {"message": "Utilisateur créé avec succès"}, status=status.HTTP_201_CREATED
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def rent_game(request, game_id):
    game = get_object_or_404(Game, pk=game_id)
    if not game.is_available:
        return Response(
            {"error": "Le jeu n'est pas disponible"}, status=status.HTTP_400_BAD_REQUEST
        )

    loan = Loan.objects.create(game=game, user=request.user)
    game.is_available = False
    game.save()

    return Response(LoanSerializer(loan).data, status=status.HTTP_201_CREATED)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_loans(request):
    loans = Loan.objects.filter(user=request.user).order_by("-loan_date")
    serializer = LoanSerializer(loans, many=True)
    return Response(serializer.data)
