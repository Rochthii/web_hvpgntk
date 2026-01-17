import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, X, CheckCircle, Loader } from 'lucide-react';
import imageCompression from 'browser-image-compression';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    currentImage?: string;
    maxSizeMB?: number;
    label?: string;
    required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
    onUpload,
    currentImage,
    maxSizeMB = 2,
    label = 'Ảnh đại diện',
    required = false,
}) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImage);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const [compressionProgress, setCompressionProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const compressImage = async (file: File): Promise<File> => {
        const options = {
            maxSizeMB: 0.5, // Target 500KB
            maxWidthOrHeight: 1920, // Max dimension
            useWebWorker: true,
            onProgress: (progress: number) => {
                setCompressionProgress(progress);
            },
        };

        try {
            const compressedFile = await imageCompression(file, options);
            console.log(`Original: ${(file.size / 1024 / 1024).toFixed(2)}MB → Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            return compressedFile;
        } catch (err) {
            console.error('Compression error:', err);
            throw new Error('Không thể nén ảnh');
        }
    };

    const uploadToSupabase = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/core/upload/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || 'Upload failed');
        }

        const data = await response.json();
        return data.url; // Supabase public URL
    };

    const handleImageSelect = async (file: File) => {
        setError('');
        setCompressionProgress(0);

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh (JPG, PNG, WebP)');
            return;
        }

        // Validate file size (before compression)
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSizeMB * 2) {
            setError(`File quá lớn! Tối đa ${maxSizeMB * 2}MB (sẽ được nén).`);
            return;
        }

        try {
            setUploading(true);

            // Step 1: Compress image
            const compressedFile = await compressImage(file);

            // Step 2: Upload to Supabase
            const uploadedUrl = await uploadToSupabase(compressedFile);

            // Step 3: Update UI
            setPreviewUrl(uploadedUrl);
            onUpload(uploadedUrl);

            console.log('✅ Image uploaded:', uploadedUrl);
        } catch (err: any) {
            setError(err.message || 'Upload thất bại! Vui lòng thử lại.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
            setCompressionProgress(0);
        }
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleImageSelect(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) handleImageSelect(file);
    };

    const handleRemove = () => {
        setPreviewUrl(undefined);
        onUpload('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {previewUrl ? (
                // Preview mode
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg overflow-hidden bg-gray-50">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition shadow"
                        title="Xóa ảnh"
                    >
                        <X size={18} />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <CheckCircle size={14} />
                        Đã tải lên
                    </div>
                </div>
            ) : (
                // Upload zone
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                        } ${uploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                    onClick={() => !uploading && fileInputRef.current?.click()}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    {uploading ? (
                        <div className="space-y-3">
                            <Loader className="mx-auto text-blue-500 animate-spin" size={48} />
                            <p className="text-sm text-gray-600">
                                {compressionProgress > 0 && compressionProgress < 100
                                    ? `Đang nén ảnh... ${compressionProgress}%`
                                    : 'Đang tải lên Supabase...'}
                            </p>
                        </div>
                    ) : (
                        <>
                            <ImageIcon className="mx-auto text-gray-400 mb-3" size={48} />
                            <p className="text-sm text-gray-600 mb-1">
                                <span className="text-blue-600 font-medium">Nhấp để chọn ảnh</span> hoặc kéo thả vào đây
                            </p>
                            <p className="text-xs text-gray-500">
                                JPG, PNG, WebP tối đa {maxSizeMB}MB (sẽ tự động nén)
                            </p>
                        </>
                    )}
                </div>
            )}

            {error && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                    <X size={14} />
                    {error}
                </p>
            )}
        </div>
    );
};
