from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r"games", views.GameViewSet)
router.register(r"players", views.PlayerViewSet)
router.register(r"loans", views.LoanViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("api/games/<int:pk>/pdf/", views.game_pdf, name="game_pdf"),
    path("api/loans/return/<int:pk>/", views.return_game, name="return_game"),
    path("api/export/games/csv/", views.export_games_csv, name="export_games_csv"),
    path("api/export/games/json/", views.export_games_json, name="export_games_json"),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/register/", views.register_user, name="register"),
]
