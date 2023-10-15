from django.db import models

#Pokemon model
class Pokemon(models.Model):
    id = models.BigAutoField(primary_key=True)
    english_name = models.CharField(max_length=50,null=False)
    types = models.JSONField()
    thumbnail = models.CharField(max_length=255)
    image = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.english_name
    

