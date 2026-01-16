from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.contrib import messages
from django.core.management import call_command
from .models import Game, Player, Loan


@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "studio",
        "genre",
        "platform",
        "release_date",
        "is_available",
    )
    list_filter = ("genre", "platform", "is_available")
    search_fields = ("title", "studio")
    change_list_template = "admin/library/game_change_list.html"

    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                "generate-data/",
                self.admin_site.admin_view(self.generate_data),
                name="generate-data",
            ),
            path(
                "delete-all/",
                self.admin_site.admin_view(self.delete_all),
                name="delete-all",
            ),
        ]
        return custom_urls + urls

    def generate_data(self, request):
        try:
            call_command("generate_data", games=20, players=10, loans=15)
            self.message_user(request, "Données générées avec succès !")
        except Exception as e:
            self.message_user(
                request, f"Erreur lors de la génération : {e}", messages.ERROR
            )
        return redirect("admin:library_game_changelist")

    def delete_all(self, request):
        Loan.objects.all().delete()
        Game.objects.all().delete()
        Player.objects.all().delete()
        self.message_user(request, "Toutes les données ont été supprimées !")
        return redirect("admin:library_game_changelist")


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email")
    search_fields = ("first_name", "last_name", "email")


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ("game", "player", "loan_date", "return_date", "is_returned")
    list_filter = ("is_returned", "loan_date")
    search_fields = ("game__title", "player__last_name")
