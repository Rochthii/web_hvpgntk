import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Save, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { showToast } from '../../../lib/toast';
import { cn } from '../../../lib/utils';
import { cmsApi } from '../../../api/cms';

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const addImage = () => {
        const url = window.prompt('URL hình ảnh:');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="border-b border-gray-200 p-2 flex flex-wrap gap-2 buttons-bar">
            {/* Standard buttons similar to NewsEditor */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'is-active' : ''}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'is-active' : ''}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
                Bullet List
            </button>
            <button onClick={addImage} className="flex items-center gap-1">
                <ImageIcon size={16} /> Image
            </button>
        </div>
    );
};

export const PageEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[500px]',
            },
        },
    });

    useEffect(() => {
        if (id) {
            setLoading(true);
            // Assuming we fetch by ID for editing
            // Note: If backend requires Slug for lookup, we might need adjustments
            // But PageViewSet typically standard ModelViewSet
            cmsApi.getPageDetail(id).then(res => {
                const data = res.data;
                setTitle(data.title_vi);
                setSlug(data.slug);
                setStatus(data.status);
                editor?.commands.setContent(data.content_vi || '');
            }).catch(err => {
                // Try fetching by ID failed, maybe it expects slug? 
                // But usually standard ViewSet RETRIEVE is by PK.
                // Let's assume ID is correct.
                showToast.error("Không tìm thấy trang");
                navigate('/admin/pages');
            }).finally(() => setLoading(false));
        }
    }, [id, editor, navigate]);

    const handleSave = async () => {
        if (!title) return showToast.error("Vui lòng nhập tiêu đề");

        const content = editor?.getHTML();
        const data = {
            title_vi: title,
            slug: slug || undefined, // Let backend generate if empty
            content_vi: content,
            status,
        };

        try {
            if (id) {
                await cmsApi.updatePage(id, data);
            } else {
                await cmsApi.createPage(data);
            }
            showToast.success("Lưu trang thành công");
            navigate('/admin/pages');
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi khi lưu trang");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/pages')}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {id ? 'Chỉnh sửa Trang' : 'Tạo Trang Mới'}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors shadow-sm disabled:opacity-50"
                >
                    <Save size={20} />
                    <span>{id ? 'Cập nhật' : 'Tạo trang'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Title Input */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề trang</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none transition-all font-medium text-lg"
                            placeholder="Nhập tiêu đề trang..."
                        />
                    </div>

                    {/* Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[600px] flex flex-col">
                        <MenuBar editor={editor} />
                        <div className="flex-1 bg-gray-50/50">
                            <EditorContent editor={editor} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Settings Panel */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value as any)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                            >
                                <option value="draft">Bản nháp</option>
                                <option value="published">Đã xuất bản</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn (Slug)</label>
                            <input
                                type="text"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none text-sm font-mono text-gray-600"
                                placeholder="tu-dong-tao-neu-trong"
                            />
                            <p className="mt-1 text-xs text-gray-500">Để trống để tự tạo từ tiêu đề.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
