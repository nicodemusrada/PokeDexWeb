from django.conf import settings
from django.contrib.staticfiles.storage import staticfiles_storage
from django.conf import settings

#create media url endpoint
def get_image_url(saved_path):
    return settings.MEDIA_URL + saved_path