from apps.users.models import User
admin = User.objects.get(email='admin@hocvienphatgiaonamtong.vn')
admin.set_password('admin123')
admin.save()
print('✅ Password set to: admin123')
