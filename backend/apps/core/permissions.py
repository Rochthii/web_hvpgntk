from rest_framework import permissions
from apps.users.models import User

# --- Base Role Permissions ---

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.ADMIN

class IsAbbot(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.ABBOT

class IsTeacher(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.TEACHER

class IsStudent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.STUDENT

class IsAdmission(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.ADMISSION

class IsContent(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.CONTENT

class IsSecretary(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == User.Role.SECRETARY

# --- Granular Resource Permissions ---

class CanViewCMS(permissions.BasePermission):
    """
    CMS View: Admin, Abbot, Teacher, Admission (No), Content, Secretary
    Based on User Req: Admin, Abbot, Teacher, Content, Secretary
    """
    def has_permission(self, request, view):
        allowed = [
            User.Role.ADMIN, User.Role.ABBOT, User.Role.TEACHER, 
            User.Role.CONTENT, User.Role.SECRETARY
        ]
        return request.user.is_authenticated and request.user.role in allowed

class CanEditCMS(permissions.BasePermission):
    """
    CMS Edit: Admin, Content
    """
    def has_permission(self, request, view):
        allowed = [User.Role.ADMIN, User.Role.CONTENT]
        if request.user.is_authenticated and request.user.role in allowed:
            return True
        # Read-only access for others who can View CMS? 
        # No, this perm is for Edit actions (POST, PUT, PATCH, DELETE).
        return False

class CanViewStudents(permissions.BasePermission):
    """
    Students View: Admin, Abbot, Teacher, Admission, Secretary
    """
    def has_permission(self, request, view):
        allowed = [
            User.Role.ADMIN, User.Role.ABBOT, User.Role.TEACHER, 
            User.Role.ADMISSION, User.Role.SECRETARY
        ]
        return request.user.is_authenticated and request.user.role in allowed

class CanEditStudents(permissions.BasePermission):
    """
    Students Edit: Admin, Admission
    """
    def has_permission(self, request, view):
        allowed = [User.Role.ADMIN, User.Role.ADMISSION]
        return request.user.is_authenticated and request.user.role in allowed

class CanViewGrades(permissions.BasePermission):
    """
    Grades View: Admin, Abbot, Teacher, Student (Own)
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated
    
    def has_object_permission(self, request, view, obj):
        # obj is Grade
        user = request.user
        if user.role in [User.Role.ADMIN, User.Role.ABBOT, User.Role.TEACHER]:
            return True
        if user.role == User.Role.STUDENT:
            # Check ownership: Grade -> Enrollment -> Student (User)
            return obj.enrollment.student == user
        return False

class CanEditGrades(permissions.BasePermission):
    """
    Grades Edit: Admin, Teacher (Own courses)
    """
    def has_permission(self, request, view):
        allowed = [User.Role.ADMIN, User.Role.TEACHER]
        return request.user.is_authenticated and request.user.role in allowed
    
    def has_object_permission(self, request, view, obj):
        user = request.user
        if user.role == User.Role.ADMIN:
            return True
        if user.role == User.Role.TEACHER:
            # Check if teacher teaches this class
            # Grade -> Enrollment -> Class -> Instructor
            return obj.enrollment.class_instance.instructor == user
        return False

class CanApprovePetitions(permissions.BasePermission):
    """
    Petitions: Admin, Abbot, Admission (Type specific)
    """
    def has_permission(self, request, view):
        allowed = [User.Role.ADMIN, User.Role.ABBOT, User.Role.ADMISSION]
        return request.user.is_authenticated and request.user.role in allowed
