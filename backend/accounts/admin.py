# from django.contrib import admin
# from django.contrib.auth.admin import UserAdmin
# from .models import User

# @admin.register(User)
# class CustomUserAdmin(UserAdmin):
#     list_display = ('username', 'email', 'role', 'status', 'is_staff', 'date_joined')
#     list_filter = ('role', 'status', 'is_staff', 'is_superuser')
#     search_fields = ('username', 'email', 'first_name', 'last_name')
    
#     fieldsets = UserAdmin.fieldsets + (
#         ('Custom Fields', {'fields': ('role', 'status', 'last_login_time')}),
#     )