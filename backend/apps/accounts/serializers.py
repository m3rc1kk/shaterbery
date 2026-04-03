from django.contrib.auth import authenticate, get_user_model
from rest_framework import serializers

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        if username and password:
            user = authenticate(
                request=self.context.get('request'),
                username=username,
                password=password,
            )

            if not user:
                raise serializers.ValidationError(
                    'Неверный логин или пароль'
                )
            if not user.is_active:
                raise serializers.ValidationError(
                    'Учётная запись отключена'
                )

            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                'Укажите логин и пароль'
            )
