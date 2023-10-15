from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Pokemon
from .serializers import PokemonSerializer, PokemonUpdateSerializer
from rest_framework.pagination import PageNumberPagination
import os
import uuid
from django.conf import settings

@api_view(['GET', 'POST'])
def resourceList(request):
    """
    Function that handles creating and fetching multiple pokemons
    """

    # Handle GET request
    if request.method == 'GET':
        # Retrieve query parameters
        name_query = request.query_params.get('name', None)
        type_query = request.query_params.get('type', None)

        # Define a custom pagination class
        class CustomPagination(PageNumberPagination):
            page_size = request.query_params.get('limit', 50)

        paginator = CustomPagination()

        # Construct a custom SQL query
        query = "SELECT * FROM api_Pokemon WHERE 1=1"
        params = []

        if name_query:
            query += " AND english_name LIKE %s"
            params.append('%' + name_query + '%')

        if type_query:
            query += " AND types LIKE %s"
            params.append('%' + type_query + '%')

        # Execute the custom query using objects.raw()
        pokemons = Pokemon.objects.raw(query, params)

        # Paginate the results
        paginated_pokemons = paginator.paginate_queryset(pokemons, request)

        # Serialize the paginated results
        serializer = PokemonSerializer(paginated_pokemons, many=True)

        # Return the paginated response
        return paginator.get_paginated_response(serializer.data)

    # Handle POST request
    if request.method == 'POST':
        mutable_data = request.data.copy()
        image = request.data['image']
        image_extension = os.path.splitext(image.name)[1]
        unique_image_name = f'pokemon_{uuid.uuid4().hex}{image_extension}'

        mutable_data['image'] = unique_image_name
        mutable_data['thumbnail'] = unique_image_name

        serializer = PokemonSerializer(data=mutable_data)

        # Construct the file paths for image and thumbnail
        image_path = os.path.join(settings.MEDIA_ROOT, 'images', unique_image_name)
        thumbnail_path = os.path.join(settings.MEDIA_ROOT, 'thumbnails', unique_image_name)

        try:
            # Save the uploaded image and thumbnail to their respective paths
            with open(image_path, 'wb') as image_file:
                for chunk in image.chunks():
                    image_file.write(chunk)

            with open(thumbnail_path, 'wb') as thumbnail_file:
                for chunk in image.chunks():
                    thumbnail_file.write(chunk)

            # Now, you can save the paths to 'image' and 'thumbnail' fields in your data
            mutable_data['image'] = unique_image_name
            mutable_data['thumbnail'] = unique_image_name

            serializer = PokemonSerializer(data=mutable_data)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            # Handle any exceptions here, e.g., log the error
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET', 'PUT', 'DELETE'])
def pokemonDetail(request, id):
    """
    Function that handles get, update, and delete actions for a specific pokemon
    """
    try:
        pokemon = Pokemon.objects.get(id=id)
    except Pokemon.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    # Handle GET request
    if request.method == 'GET':
        serializer = PokemonSerializer(pokemon, many=False)
        return Response(serializer.data)

    # Handle PUT request
    if request.method == 'PUT':
        serializer = PokemonUpdateSerializer(pokemon, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # Handle DELETE request
    if request.method == 'DELETE':
        # Construct the file paths for image and thumbnail
        image_path = os.path.join(settings.MEDIA_ROOT, 'images', pokemon.image)
        thumbnail_path = os.path.join(settings.MEDIA_ROOT, 'thumbnails', pokemon.thumbnail)

        # Delete the image and thumbnail files
        if os.path.exists(image_path):
            os.remove(image_path)
        if os.path.exists(thumbnail_path):
            os.remove(thumbnail_path)

        pokemon.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
