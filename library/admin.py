from django.contrib import admin
from django.urls import path
from django.shortcuts import redirect
from django.contrib import messages
from django.core.management import call_command
from .models import Game, Player, Loan
import io
from django.http import HttpResponse
from django.db.models import Count
import matplotlib.pyplot as plt
import matplotlib

matplotlib.use("Agg")


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
            path(
                "stats-chart/",
                self.admin_site.admin_view(self.stats_chart),
                name="stats-chart",
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

    def stats_chart(self, request):
        data = Game.objects.values("genre").annotate(count=Count("genre"))
        genres = [item["genre"] for item in data]
        counts = [item["count"] for item in data]

        # Style retro / synthwave pour le graph
        plt.style.use("dark_background")
        fig, ax = plt.subplots(figsize=(8, 4))

        ax.bar(
            genres,
            counts,
            color=["#ff00ff", "#00ffff", "#ffff00", "#4f46e5", "#10b981"],
        )

        ax.set_title(
            "DÉCOMPTE PAR GENRE.EXE", fontname="monospace", pad=20, color="#00ffff"
        )
        ax.set_ylabel("QUANTITÉ", fontname="monospace", color="#b4a5d8")

        # Grid neon
        ax.grid(color="#4f46e5", linestyle="--", alpha=0.3)

        plt.xticks(rotation=45, ha="right", fontname="monospace", color="#ffffff")
        plt.yticks(fontname="monospace", color="#ffffff")

        plt.tight_layout()

        buffer = io.BytesIO()
        plt.savefig(buffer, format="png", transparent=True)
        buffer.seek(0)
        plt.close(fig)

        return HttpResponse(buffer.getvalue(), content_type="image/png")


@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ("first_name", "last_name", "email")
    search_fields = ("first_name", "last_name", "email")


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ("game", "player", "loan_date", "return_date", "is_returned")
    list_filter = ("is_returned", "loan_date")
    search_fields = ("game__title", "player__last_name")
