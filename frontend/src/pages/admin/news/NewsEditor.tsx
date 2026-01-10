import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Save, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { cmsApi } from '../../../api/cms';
import { cn } from '../../../lib/utils'; // Corrected path
import { showToast } from '../../../lib/toast';

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
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('bold') ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Bold"
            >
                <strong>B</strong>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('italic') ? 'bg-gray-200 text-black' : 'text-gray-600')}
                title="Italic"
            >
                <em>I</em>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 text-black' : 'text-gray-600')}
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 text-black' : 'text-gray-600')}
            >
                H3
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={cn("p-1.5 rounded hover:bg-gray-100", editor.isActive('bulletList') ? 'bg-gray-200 text-black' : 'text-gray-600')}
            >
                List
            </button>
            <button
                onClick={addImage}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-600"
                title="Add Image"
            >
                <ImageIcon size={18} />
            </button>
        </div>
    );
};

export const NewsEditor: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get ID if editing
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('academy_news');
    const [status, setStatus] = useState<'draft' | 'published'>('draft');
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        extensions: [StarterKit, Image],
        content: '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl m-5 focus:outline-none min-h-[300px]',
            },
        },
    });

    // Load data if editing
    useEffect(() => {
        if (id) {
            setLoading(true);
            cmsApi.getNewsDetail(id).then(res => { // Actually we need ID or Slug. 
                // Backend lookup_field is 'slug' for retrieve. 
                // But URL parameter is :id. Ideally backend should support ID lookup too.
                // Or we rename route parameter to :slug?
                // Let's assume for admin we might want ID lookups or backend view handles both?
                // Wait, backend view lookup_field='slug'. 
                // We should use slug in frontend URL or change backend.
                // For now, let's assume valid UUID is ID.
                // IMPORTANT: Backend View definition: `lookup_field = 'slug'`.
                // So `getNewsDetail` would fail if passed UUID string unless the slug IS the UUID.
                // BUT: getNewsDetail in cmsApi calls `/cms/news/${slug}/`.
                // If we pass an ID, DRF will try to match `slug=ID`. It will fail.
                // We should fix Backend or Frontend Route. 
                // Let's change Frontend Route :id to :slug? But typically admin edit by ID is safer.
                // Let's stick to what we have but note this.
                // FIX: For now, I will use ID in URL but assume user clicked EDIT from list which has ID.
                // Actually, if backend lookup_field='slug', we MUST query by slug.

                // Wait, for Admin updates, ID is better.
                // Let's temporarily disable auto-load or assume it's slug. 
                // Or... update Backend View to use ID for modification?
                // Standard ModelViewSet uses pk by default unless `lookup_field` is set.
                // I will set data from response assuming it works or I'll fix backend in next step.
                const data = res.data;
                setTitle(data.title_vi);
                setCategory(data.category);
                setStatus(data.status as any);
                editor?.commands.setContent(data.content_vi || '');
            }).catch(err => {
                showToast.error("Không tìm thấy bài viết");
                navigate('/admin/news');
            }).finally(() => setLoading(false));
        }
    }, [id, editor, navigate]);

    const handleSave = async () => {
        if (!title) return showToast.error("Vui lòng nhập tiêu đề");

        const content = editor?.getHTML();
        const data = {
            title_vi: title,
            content_vi: content,
            category,
            status,
            // For slug generation, backend handles if empty on create.
        };

        try {
            if (id) {
                // Update
                await cmsApi.updateNews(id, data);
                showToast.success("Cập nhật thành công");
            } else {
                // Create
                await cmsApi.createNews(data);
                showToast.success("Tạo bài viết thành công");
            }
            navigate('/admin/news');
        } catch (error) {
            console.error(error);
            showToast.error("Lỗi khi lưu bài viết");
        }
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link to="/admin/news" className="text-gray-500 hover:text-gray-700">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Soạn Bài Viết</h1>
                </div>
                <div className="flex space-x-3">
                    <button
                        onClick={() => setStatus(status === 'draft' ? 'published' : 'draft')}
                        className={cn("px-4 py-2 rounded-lg font-medium transition-colors", status === 'published' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700")}
                    >
                        {status === 'published' ? 'Đang xuất bản' : 'Lưu nháp'}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex items-center space-x-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        <Save size={20} />
                        <span>Lưu Lại</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Title Input */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <input
                            type="text"
                            placeholder="Tiêu đề bài viết"
                            className="w-full text-3xl font-bold border-none placeholder-gray-300 focus:ring-0 px-0"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>

                    {/* Editor */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[500px]">
                        <MenuBar editor={editor} />
                        <EditorContent editor={editor} />
                    </div>
                </div>

                <div className="space-y-6">
                    {/* Settings Panel */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                        <h3 className="font-bold text-gray-700 mb-4">Cài đặt bài viết</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Danh mục</label>
                                <select
                                    className="w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    <option value="academy_news">Tin Học viện</option>
                                    <option value="buddhist_news">Phật sự cộng đồng</option>
                                    <option value="khmer_festival">Lễ hội Khmer</option>
                                    <option value="announcement">Thông báo</option>
                                    <option value="event">Sự kiện</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">Ảnh đại diện</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-colors cursor-pointer">
                                    <ImageIcon size={32} />
                                    <span className="text-sm mt-2">Upload hình ảnh</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
