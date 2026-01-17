import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploaderProps {
    accept?: string;
    maxSize?: number; // in MB
    onUpload: (url: string, filename: string) => void;
    currentFile?: { url: string; name: string };
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    accept = '.pdf,.doc,.docx,.xls,.xlsx',
    maxSize = 10,
    onUpload,
    currentFile,
}) => {
    const [uploading, setUploading] = useState(false);
    const [uploadedFile, setUploadedFile] = useState(currentFile);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): boolean => {
        setError('');

        // Check file size
        const fileSizeMB = file.size / (1024 * 1024);
        if (fileSizeMB > maxSize) {
            setError(`File quá lớn! Tối đa ${maxSize}MB.`);
            return false;
        }

        // Check file extension
        const ext = '.' + file.name.split('.').pop()?.toLowerCase();
        const acceptedExt = accept.split(',').map(e => e.trim());
        if (!acceptedExt.includes(ext)) {
            setError(`Định dạng file không hợp lệ! Chỉ chấp nhận: ${accept}`);
            return false;
        }

        return true;
    };

    const handleUpload = async (file: File) => {
        if (!validateFile(file)) return;

        try {
            setUploading(true);

            // In real implementation:
            // const formData = new FormData();
            // formData.append('file', file);
            // const response = await uploadApi.uploadDocument(formData);
            // const url = response.data.url;

            // Mock upload
            await new Promise(resolve => setTimeout(resolve, 1500));
            const mockUrl = `https://storage.example.com/${file.name}`;

            setUploadedFile({ url: mockUrl, name: file.name });
            onUpload(mockUrl, file.name);
        } catch (err) {
            setError('Upload thất bại! Vui lòng thử lại.');
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleUpload(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setDragActive(true);
    };

    const handleDragLeave = () => {
        setDragActive(false);
    };

    const handleRemove = () => {
        setUploadedFile(undefined);
        onUpload('', '');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getFileIcon = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        if (ext === 'pdf') return '📄';
        if (ext === 'doc' || ext === 'docx') return '📝';
        if (ext === 'xls' || ext === 'xlsx') return '📊';
        return '📎';
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-700">
                Tệp đính kèm <span className="text-gray-400 font-normal">(không bắt buộc)</span>
            </label>

            {!uploadedFile ? (
                <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${dragActive
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                >
                    {uploading ? (
                        <div className="space-y-3">
                            <div className="w-12 h-12 mx-auto border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            <p className="text-sm text-gray-600">Đang upload...</p>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                            <p className="text-gray-700 font-medium mb-1">Kéo thả file vào đây hoặc</p>
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-blue-600 hover:text-blue-700 font-medium underline"
                            >
                                Chọn file từ máy tính
                            </button>
                            <p className="text-xs text-gray-500 mt-2">
                                Hỗ trợ: PDF, Word, Excel • Tối đa {maxSize}MB
                            </p>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={accept}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                        </>
                    )}
                </div>
            ) : (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                        <div className="text-3xl">{getFileIcon(uploadedFile.name)}</div>
                        <div>
                            <p className="font-medium text-gray-900">{uploadedFile.name}</p>
                            <div className="flex items-center space-x-2 text-sm text-green-600">
                                <CheckCircle size={14} />
                                <span>Upload thành công</span>
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                        title="Xóa file"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            {error && (
                <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg text-sm flex items-center">
                    <span className="mr-2">⚠️</span>
                    {error}
                </div>
            )}
        </div>
    );
};
