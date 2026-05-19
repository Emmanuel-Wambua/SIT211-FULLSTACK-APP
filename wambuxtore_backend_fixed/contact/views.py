from django.conf import settings
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime

db = settings.MONGO_DB


def build_order_confirmation_message(order):
    items = order.get("items", [])
    item_lines = []

    for index, item in enumerate(items, start=1):
        if isinstance(item, dict):
            name = item.get("name", "Item")
        else:
            name = str(item)
        item_lines.append(f"{index}. {name}")

    items_text = "\n".join(item_lines) if item_lines else "No items listed"

    return (
        f"Hi {order['full_name']},\n\n"
        "Thank you for placing your order with WambuXtore. To be completely honest we don't have the real things lol😂🤣💔 "
        "this is just a project for school but thanks for testing our store😁.\n\n"
        "Order summary:\n"
        f"{items_text}\n\n"
        f"Delivery address: {order['address']}\n"
        f"Phone: {order['phone']}\n\n"
        "If any detail above is incorrect, please reply to this email or contact us as soon as possible.\n\n"
        "- The WambuXtore Team"
    )


@method_decorator(csrf_exempt, name='dispatch')
class ContactView(APIView):
    def post(self, request):
        email = request.data.get("email")
        message = request.data.get("message")

        if not email or not message:
            return Response(
                {"error": "email and message are required fields."},
                status=status.HTTP_400_BAD_REQUEST
            )

        contact_message = {
            "name": str(request.data.get("name", "")).strip(),
            "email": str(email).strip(),
            "message": str(message).strip(),
            "submitted_at": datetime.utcnow().isoformat(),
        }
        db.contact.insert_one(contact_message)
        return Response({"message": "Message received!"}, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class OrderView(APIView):
    def post(self, request):
        required = ["full_name", "email", "phone", "address", "items"]
        for field in required:
            if not request.data.get(field):
                return Response(
                    {"error": f"{field} is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        order = {
            "full_name": str(request.data.get("full_name")).strip(),
            "email": str(request.data.get("email")).strip().lower(),
            "phone": str(request.data.get("phone")).strip(),
            "address": str(request.data.get("address")).strip(),
            "notes": str(request.data.get("notes", "")).strip(),
            "items": request.data.get("items"),
            "status": "pending",
            "placed_at": datetime.utcnow().isoformat(),
        }
        db.orders.insert_one(order)

        send_mail(
            subject='Your WambuXtore order has been received',
            message=build_order_confirmation_message(order),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[order["email"]],
            fail_silently=True,
        )

        return Response({"message": "Order placed successfully!"}, status=status.HTTP_201_CREATED)
