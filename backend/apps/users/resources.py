from import_export import resources, fields
from import_export.widgets import DateWidget
from .models import User, MonkProfile
from django.contrib.auth.hashers import make_password
import logging

logger = logging.getLogger(__name__)

class MonkProfileResource(resources.ModelResource):
    """
    Resource for bulk importing Monk Profiles via Excel.
    Automatically creates linked User accounts.
    """
    # Define fields to match Excel columns
    student_code = fields.Field(attribute='student_code', column_name='Mã Sinh Viên')
    dharma_name_khmer = fields.Field(attribute='dharma_name_khmer', column_name='Pháp Danh (Khmer)')
    dharma_name_vietnamese = fields.Field(attribute='dharma_name_vietnamese', column_name='Pháp Danh (Việt)')
    date_of_birth = fields.Field(attribute='date_of_birth', column_name='Ngày Sinh', widget=DateWidget(format='%d/%m/%Y'))
    secular_name = fields.Field(attribute='secular_name', column_name='Thế Danh')
    phone = fields.Field(attribute='user__phone', column_name='Số Điện Thoại')
    email = fields.Field(attribute='user__email', column_name='Email')
    ordination_temple = fields.Field(attribute='ordination_temple', column_name='Chùa Xuất Gia')

    class Meta:
        model = MonkProfile
        import_id_fields = ('student_code',)
        fields = ('student_code', 'dharma_name_khmer', 'dharma_name_vietnamese', 'date_of_birth', 'secular_name', 'ordination_temple')
        export_order = ('student_code', 'dharma_name_khmer', 'dharma_name_vietnamese', 'secular_name', 'date_of_birth', 'ordination_temple', 'phone', 'email')
        skip_unchanged = True
        report_skipped = True

    def before_import_row(self, row, **kwargs):
        """
        Logic to create or get User before importing Profile.
        """
        student_code = row.get('Mã Sinh Viên')
        phone = row.get('Số Điện Thoại')
        email = row.get('Email') or None
        dob = row.get('Ngày Sinh') # Format dd/mm/yyyy string

        if not student_code:
            return # Skip if no student code

        username = str(student_code).strip().upper()
        
        # Determine password (default to DOB ddmmyyyy or student code)
        password_raw = str(dob).replace('/', '').replace('-', '') if dob else f"{username}@"

        # Try to find existing User by username (Student Code)
        user = User.objects.filter(username=username).first()

        if not user:
            # Create new User
            user = User.objects.create_user(
                username=username,
                phone=phone,
                email=email,
                password=password_raw, # Set initial password
                user_type=User.UserType.MONK,
                role=User.Role.STUDENT,
                is_active=True,
                is_verified=True # Auto verify for imported students
            )
            logger.info(f"Created new User for import: {username}")
        else:
            # Update existing user info if needed
            if phone and user.phone != phone:
                user.phone = phone
            if email and user.email != email:
                user.email = email
            user.save()

        # We don't return anything, user is linked via foreign key lookup in save_instance ideally, 
        # but import_export is tricky with OneToOne.
        # Strategy: We will handle the linking in `after_import_row` or set it here.
        
        # Actually, `import_export` handles relations if defined properly.
        # But OneToOne reverse creation is clearer if we set the ID.
        pass

    def init_instance(self, row=None):
        """
        Initialize the model instance.
        """
        instance = super().init_instance(row)
        if row:
            student_code = row.get('Mã Sinh Viên')
            if student_code:
                username = str(student_code).strip().upper()
                user = User.objects.filter(username=username).first()
                if user:
                    instance.user = user
        return instance
