from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from django.core.exceptions import ValidationError

from ..models import UserProfile
from django.conf import settings
from django.db import models

User = get_user_model()


# extends the user profile- will allow creation of a profile on registration of a user
class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""

    class Meta:
        model = UserProfile
        fields = ("first_name", "last_name", "phone_number", "business_name", "business_location", "tax_reg_number", "industry")


# user registration
class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""

    user_profile = UserProfileSerializer()

    class Meta:
        model = User
        fields = ("email", "password","confirm_password", "user_profile")

    email = serializers.EmailField(required=True)
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )
    confirm_password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    def validate(self, data):
        password1 = data["password"]
        password2 = data["confirm_password"]
        if password1 != password2:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        else:
            self.fields.pop('confirm_password')

        return data
    
    


    def create(self, validated_data):
        # create a new user with validated data
        profile_data = validated_data.pop("user_profile")

        user = User.objects.create_user(
            validated_data["email"],
        )
        # Set the hashed password for the user
        user.set_password(validated_data["password"])

        UserProfile.objects.create(user=user, **profile_data)

        # Save the profile object
        user.save()

        return user


# user login
class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""

    email = serializers.EmailField()
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
    )

    def check_user(self, validated_data):
        user = authenticate(
            email=validated_data["email"], password=validated_data["password"]
        )
        if not user:
            raise ValidationError("user not found")

        return user


# view user
class UserSerializer(serializers.ModelSerializer):
    """User details serializer"""

    class Meta:
        model = User
        fields = ["email"]
