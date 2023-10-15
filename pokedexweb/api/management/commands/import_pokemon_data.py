import json
from django.core.management.base import BaseCommand
from api.models import Pokemon

class Command(BaseCommand):
    help = 'Seed the database with Pokemon data from a JSON file'

    def add_arguments(self, parser):
        parser.add_argument('json_file', type=str, help='Path to the JSON file')

    def handle(self, *args, **kwargs):
        json_file = kwargs['json_file']
       
        with open(json_file, 'r', encoding='utf-8') as file:
            data = json.load(file)

        for item in data:
            pokemon_id = item['id']

            # Ensure the ID is formatted as 'XXX'
            formatted_id = f"{pokemon_id:03d}"

            thumbnail = f"{formatted_id}.png"
            image = f"{formatted_id}.png"

            pokemon = Pokemon(
                id=pokemon_id,
                english_name=item['name']['english'],
                types=item['type'],
                thumbnail=thumbnail,
                image=image,
            )
            pokemon.save()

        self.stdout.write(self.style.SUCCESS('Successfully seeded the database with Pokemon data'))
