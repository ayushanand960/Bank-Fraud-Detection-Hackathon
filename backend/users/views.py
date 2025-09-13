# views.py
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from django.conf import settings
# from django.utils.decorators import method_decorator
# from django.views.decorators.csrf import csrf_exempt
from .authentication import CookieJWTAuthentication
from .models import User
from .serializers import UserSerializer, RegisterSerializer


# Utility: set JWT as HttpOnly cookies
def set_jwt_cookies(response, refresh_token, access_token):
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE'],  # e.g. "access"
        value=access_token,
        httponly=True,
        secure=True,  # set True in production (HTTPS)
        samesite="None",
    )
    response.set_cookie(
        key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'],
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="None",
    )
    return response


def clear_jwt_cookies(response):
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
    response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
    return response


class RegisterAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "User registered successfully"},
                status=status.HTTP_201_CREATED,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        response = Response(
            {
                "message": "Login successful",
                "user": UserSerializer(user).data,
            },
            status=status.HTTP_200_OK,
        )
        set_jwt_cookies(response, str(refresh), access)
        return response


class LogoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        response = Response({"message": "Logged out"}, status=status.HTTP_200_OK)
        clear_jwt_cookies(response)
        return response

# @method_decorator(csrf_exempt, name="dispatch")
class ProfileAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    authentication_classes = [CookieJWTAuthentication]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)
