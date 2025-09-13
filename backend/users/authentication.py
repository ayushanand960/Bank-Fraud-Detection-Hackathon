from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import TokenError

class CookieJWTAuthentication(JWTAuthentication):
    """
    Read access token from cookie named 'access_token'.
    # """
    # def authenticate(self, request):
    #     raw_token = request.COOKIES.get("access_token")
    #     if raw_token is None:
    #         return None
    #     try:
    #         validated_token = self.get_validated_token(raw_token)
    #         user = self.get_user(validated_token)
    #         return (user, validated_token)
    #     except TokenError:
    #         return None

    def authenticate(self, request):
        raw_token = request.COOKIES.get("access_token")
        print("Raw Token:", raw_token)
        if raw_token is None:
            print("No access_token cookie found")
            return None
        try:
            validated_token = self.get_validated_token(raw_token)
            print("Validated token:", validated_token)
            user = self.get_user(validated_token)
            print("Authenticated user:", user)
            return (user, validated_token)
        except Exception as e:
            print("JWT auth error:", e)
            return None

