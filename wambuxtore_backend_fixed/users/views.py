from django.conf import settings
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

db = settings.MONGO_DB


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    def post(self, request):
        username = (request.data.get("username") or "").strip()
        email = (request.data.get("email") or "").strip().lower()
        password = request.data.get("password")

        if not username or not email or not password:
            return Response(
                {"error": "username, email and password are all required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if len(password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check Django auth (used for login)
        if User.objects.filter(username__iexact=username).exists():
            return Response(
                {"error": "This username is already taken."},
                status=status.HTTP_400_BAD_REQUEST
            )
        if User.objects.filter(email__iexact=email).exists():
            return Response(
                {"error": "An account with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create Django auth user (for JWT login)
        User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # Also save to MongoDB (for wishlist, orders etc.)
        db.users.insert_one({
            "username": username,
            "email": email,
            "is_admin": False,
            "wishlist": [],
        })

        send_mail(
            subject='Welcome to WambuXtore!',
            message=f'Moshi Moshi {username},\n\nYour account has been created successfully😎✔. Welcome to WambuXtore!🤞😍\n\n- The WambuXtore Team',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=True,
        )

        return Response({"message": "User created successfully!"}, status=status.HTTP_201_CREATED)


@method_decorator(csrf_exempt, name='dispatch')
class LoginView(APIView):
    def post(self, request):
        identifier = (request.data.get("username") or request.data.get("email") or "").strip()
        password = request.data.get("password")

        if not identifier or not password:
            return Response(
                {"detail": "Username/email and password are required."},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.filter(username__iexact=identifier).first()
        if not user:
            user = User.objects.filter(email__iexact=identifier).first()

        if not user:
            return Response(
                {"detail": "No account found with those credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        authenticated_user = authenticate(
            request=request,
            username=user.username,
            password=password,
        )
        if authenticated_user is None:
            return Response(
                {"detail": "No account found with those credentials."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(authenticated_user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": {
                "username": authenticated_user.username,
                "email": authenticated_user.email,
            },
        })


@method_decorator(csrf_exempt, name='dispatch')
class WishlistView(APIView):
    def get(self, request, username):
        user = db.users.find_one({"username": username})
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"wishlist": user.get("wishlist", [])})

    def post(self, request, username):
        product_id = request.data.get("product_id")
        action = request.data.get("action", "add")

        if not product_id:
            return Response({"error": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        user = db.users.find_one({"username": username})
        if not user:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

        wishlist = user.get("wishlist", [])

        if action == "add" and product_id not in wishlist:
            wishlist.append(product_id)
        elif action == "remove" and product_id in wishlist:
            wishlist.remove(product_id)

        db.users.update_one({"username": username}, {"$set": {"wishlist": wishlist}})
        return Response({"wishlist": wishlist})
