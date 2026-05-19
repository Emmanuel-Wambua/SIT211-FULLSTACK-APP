from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=100)
    image_url = models.URLField()
    in_stock = models.BooleanField(default=True)

    class Meta:
        app_label = 'products'