from rest_framework import serializers
from rest_framework.serializers import ModelSerializer
from .models import Pokemon
from .utils import get_image_url
import os
import uuid

#Pokemon serializer
class PokemonSerializer(ModelSerializer):
    thumbnail_url = serializers.SerializerMethodField()
    image_url = serializers.SerializerMethodField()

    def get_thumbnail_url(self, obj):
        return get_image_url('thumbnails/' + obj.thumbnail)

    def get_image_url(self, obj):
        return get_image_url('images/' + obj.image)

    class Meta:
        model = Pokemon
        fields = '__all__'

#Pokemon update serializer
class PokemonUpdateSerializer(ModelSerializer):
    class Meta:
        model = Pokemon
        fields = ['english_name']
