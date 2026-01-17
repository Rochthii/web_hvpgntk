"""
Custom storage backend for Supabase Storage.
Integrates Django's storage system with Supabase Storage API.
"""
import os
from django.core.files.storage import Storage
from django.core.files.base import ContentFile
from django.conf import settings
from supabase import create_client, Client
from urllib.parse import urljoin
from apps.core.file_validators import validate_image_file, get_file_mime_type


class SupabaseStorage(Storage):
    """
    Custom storage backend that stores files in Supabase Storage.
    """
    
    def __init__(self):
        self.supabase_url = settings.SUPABASE_URL
        self.supabase_key = settings.SUPABASE_KEY
        self.bucket_name = settings.SUPABASE_BUCKET
        self.client: Client = create_client(self.supabase_url, self.supabase_key)
    
    def _save(self, name, content):
        """
        Save a file to Supabase Storage with AGGRESSIVE COMPRESSION for images.
        """
        # Read file content
        if hasattr(content, 'read'):
            file_content = content.read()
        else:
            file_content = content
            
        # --- IMAGE COMPRESSION LOGIC ---
        import io
        from PIL import Image
        
        # Check extensions to identify images
        ext = os.path.splitext(name)[1].lower()
        if ext in ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.tiff']:
            try:
                # Open image from bytes
                img = Image.open(io.BytesIO(file_content))
                
                # Convert to RGB (remove Alpha channel for JPEGs)
                if img.mode in ('RGBA', 'P'):
                    img = img.convert('RGB')
                
                # Resize if too large (Max 1920px width/height)
                max_size = (1920, 1920)
                img.thumbnail(max_size, Image.Resampling.LANCZOS)
                
                # Compress to JPEG with Quality=50 (EXTREME) + Progressive
                # quality=50: Very high compression
                # progressive=True: Better for web loading
                # optimize=True: Strip extra metadata
                output_buffer = io.BytesIO()
                img.save(output_buffer, format='JPEG', quality=50, optimize=True, progressive=True)
                
                # Replace content with compressed bytes
                file_content = output_buffer.getvalue()
                
                # Force extension to .jpg for the stored file if it was something else
                # (Optional: but good for consistency, though might break name references. 
                # Keeping original extension for now but content is JPEG)
                
            except Exception as e:
                print(f"Image compression failed for {name}: {e}. Uploading original.")
                # Fallback to original content if compression fails
        # -------------------------------
        
        # --- FILE VALIDATION (Magic Bytes) ---
        # Validate image files to prevent malicious uploads
        if ext in ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tiff']:
            try:
                validate_image_file(file_content, name)
            except Exception as e:
                print(f"File validation failed for {name}: {e}")
                raise  # Re-raise to prevent upload
        # -------------------------------------
        
        # Upload to Supabase Storage
        try:
            self.client.storage.from_(self.bucket_name).upload(
                path=name,
                file=file_content,
                file_options={"content-type": self._guess_content_type(name)}
            )
            return name
        except Exception as e:
            # If file exists, try updating instead
            if "already exists" in str(e).lower():
                self.client.storage.from_(self.bucket_name).update(
                    path=name,
                    file=file_content,
                    file_options={"content-type": self._guess_content_type(name)}
                )
                return name
            raise
    
    def _open(self, name, mode='rb'):
        """
        Retrieve a file from Supabase Storage.
        """
        try:
            response = self.client.storage.from_(self.bucket_name).download(name)
            return ContentFile(response)
        except Exception as e:
            raise FileNotFoundError(f"File {name} not found in Supabase Storage: {e}")
    
    def delete(self, name):
        """
        Delete a file from Supabase Storage.
        """
        try:
            self.client.storage.from_(self.bucket_name).remove([name])
        except Exception:
            pass  # File might not exist
    
    def exists(self, name):
        """
        Check if a file exists in Supabase Storage.
        """
        try:
            self.client.storage.from_(self.bucket_name).download(name)
            return True
        except Exception:
            return False
    
    def url(self, name):
        """
        Return the public URL for accessing the file.
        """
        return self.client.storage.from_(self.bucket_name).get_public_url(name)
    
    def size(self, name):
        """
        Return the size of a file.
        Note: Supabase doesn't provide size metadata directly,
        so we need to download and check size.
        """
        try:
            content = self.client.storage.from_(self.bucket_name).download(name)
            return len(content)
        except Exception:
            return 0
    
    def _guess_content_type(self, name):
        """
        Guess the MIME type of a file based on its extension.
        """
        import mimetypes
        content_type, _ = mimetypes.guess_type(name)
        return content_type or 'application/octet-stream'
