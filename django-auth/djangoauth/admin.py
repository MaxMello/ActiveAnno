from django import forms
from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.auth.hashers import make_password
from .models import User


class UserCreationForm(forms.ModelForm):
    password = forms.CharField(label='Password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'password', 'name', 'is_active', 'is_admin', 'roles')

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        print("Saving user " + str(user))
        user.set_password(self.cleaned_data["password"])
        print("Saved user " + str(user))
        if commit:
            user.save()
        return user


class UserChangeForm(forms.ModelForm):

    password = forms.CharField(label='Password', widget=forms.PasswordInput)

    class Meta:
        model = User
        fields = ('username', 'password', 'name', 'is_active', 'is_admin', 'roles')

    def save(self, commit=True):
        # Save the provided password in hashed format
        user = super().save(commit=False)
        print("Updating user " + str(user))
        user.set_password(self.cleaned_data["password"])
        print("Saved user " + str(user))
        if commit:
            user.save()
        return user




class UserAdmin(admin.ModelAdmin):
    # The forms to add and change user instances
    form = UserChangeForm
    add_form = UserCreationForm

    # The fields to be used in displaying the User model.
    # These override the definitions on the base UserAdmin
    # that reference specific fields on auth.User.
    list_display = ('username', 'name', 'is_active', 'roles')
    list_filter = ('is_admin',)
    # fieldsets = (
    #     (None, {'fields': ('username', 'password')}),
    #     ('Personal info', {'fields': ('date_of_birth',)}),
    #     ('Permissions', {'fields': ('is_admin',)}),
    # )
    # add_fieldsets is not a standard ModelAdmin attribute. UserAdmin
    # overrides get_fieldsets to use this attribute when creating a user.
    # add_fieldsets = (
    #     (None, {
    #         'classes': ('wide',),
    #         'fields': ('username', 'date_of_birth', 'password1', 'password2'),
    #     }),
    # )
    search_fields = ('username',)
    ordering = ('username',)
    filter_horizontal = ()


# Now register the new UserAdmin...
admin.site.register(User, UserAdmin)
# ... and, since we're not using Django's built-in permissions,
# unregister the Group model from admin.
admin.site.unregister(Group)
