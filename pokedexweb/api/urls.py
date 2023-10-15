from django.urls import path
from . import views

urlpatterns = [
    path('pokemons', views.resourceList),
    path('pokemons/<int:id>', views.pokemonDetail),
]