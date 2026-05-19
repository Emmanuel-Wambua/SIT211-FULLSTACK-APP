from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from bson import ObjectId
from bson.errors import InvalidId
import cloudinary.uploader

db = settings.MONGO_DB


def serialize_product(product):
    """Convert MongoDB document to JSON-serializable dict."""
    product['_id'] = str(product['_id'])
    return product


@method_decorator(csrf_exempt, name='dispatch')
class ProductListView(APIView):
    def get(self, request):
        category = request.query_params.get("category")
        if category:
            # Case-insensitive category match
            import re
            products = list(db.products.find({
                "category": {"$regex": f"^{re.escape(category)}$", "$options": "i"}
            }))
        else:
            products = list(db.products.find())

        return Response([serialize_product(p) for p in products])

    def post(self, request):
        data = request.data

        # Validate required fields
        name = data.get("name")
        category = data.get("category")

        if not name or not category:
            return Response(
                {"error": "name and category are required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        product = {
            "name": str(name).strip(),
            "description": str(data.get("description", "")).strip(),
            "category": str(category).strip(),
            "image_url": str(data.get("image_url", "")).strip(),
            "in_stock": data.get("in_stock", True),
        }

        result = db.products.insert_one(product)
        product['_id'] = str(result.inserted_id)
        return Response(product, status=status.HTTP_201_CREATED)

    def delete(self, request):
        db.products.delete_many({})
        return Response({"message": "All products deleted."}, status=status.HTTP_200_OK)


@method_decorator(csrf_exempt, name='dispatch')
class ProductDetailView(APIView):
    def get(self, request, pk):
        try:
            product = db.products.find_one({"_id": ObjectId(pk)})
        except InvalidId:
            return Response({"error": "Invalid product ID."}, status=status.HTTP_400_BAD_REQUEST)

        if not product:
            return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serialize_product(product))

    def patch(self, request, pk):
        """Partial update — useful for updating image_url after upload."""
        try:
            object_id = ObjectId(pk)
        except InvalidId:
            return Response({"error": "Invalid product ID."}, status=status.HTTP_400_BAD_REQUEST)

        updates = {k: v for k, v in request.data.items() if k != '_id'}
        if not updates:
            return Response({"error": "No fields to update."}, status=status.HTTP_400_BAD_REQUEST)

        db.products.update_one({"_id": object_id}, {"$set": updates})
        product = db.products.find_one({"_id": object_id})
        return Response(serialize_product(product))

    def delete(self, request, pk):
        try:
            result = db.products.delete_one({"_id": ObjectId(pk)})
        except InvalidId:
            return Response({"error": "Invalid product ID."}, status=status.HTTP_400_BAD_REQUEST)

        if result.deleted_count:
            return Response({"message": "Product deleted."}, status=status.HTTP_200_OK)
        return Response({"error": "Product not found."}, status=status.HTTP_404_NOT_FOUND)


@method_decorator(csrf_exempt, name='dispatch')
class ProductImageUploadView(APIView):
    def post(self, request):
        file = request.FILES.get("image")
        if not file:
            return Response(
                {"error": "No image provided. Send a file with key 'image'."},
                status=status.HTTP_400_BAD_REQUEST
            )

        result = cloudinary.uploader.upload(
            file,
            folder="wambuxtore/products",
            allowed_formats=["jpg", "jpeg", "png", "webp", "jfif"],
            transformation=[{"width": 800, "crop": "limit", "quality": "auto"}]
        )

        return Response({"image_url": result["secure_url"]}, status=status.HTTP_201_CREATED)
