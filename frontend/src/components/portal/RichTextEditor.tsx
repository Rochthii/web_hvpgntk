import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import {
    Bold, Italic, Strikethrough, Code, Underline as UnderlineIcon,
    Heading1, Heading2, Heading3,
    List, ListOrdered, Quote,
    Undo, Redo, Link as LinkIcon, ImageIcon, Unlink,
    AlignLeft, AlignCenter, AlignRight, AlignJustify,
    Table as TableIcon, Highlighter, Palette
} from 'lucide-react';

interface RichTextEditorProps {
    value: string;
    onChange: (content: string) => void;
    language?: 'vi' | 'km';
    placeholder?: string;
    height?: number;
}

export const RichTextEditor: React.FC<RichTextEditorProps> = ({
    value,
    onChange,
    language = 'vi',
    placeholder = 'Nhập nội dung...',
    height = 400
}) => {
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showColorPicker, setShowColorPicker] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            TextStyle,
            Color,
            Underline,
            Highlight.configure({
                multicolor: true
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'max-w-full h-auto rounded',
                },
            }),
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg max-w-none focus:outline-none',
                style: `font-family: ${language === 'km' ? '"Noto Sans Khmer"' : '"Noto Serif"'}, serif; font-size: 14pt; line-height: 1.6; min-height: ${height}px; padding: 1rem;`
            },
        },
    });

    if (!editor) {
        return (
            <div className="animate-pulse bg-gray-100 rounded-lg border border-gray-300" style={{ height }}>
                <div className="h-12 bg-gray-200 border-b border-gray-300"></div>
                <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
            </div>
        );
    }

    const addLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        setLinkUrl(previousUrl || '');
        setShowLinkDialog(true);
    };

    const setLink = () => {
        if (linkUrl === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
        } else {
            editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
        }
        setShowLinkDialog(false);
        setLinkUrl('');
    };

    const addImage = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                try {
                    // Upload to Supabase
                    const formData = new FormData();
                    formData.append('file', file);

                    // Call backend upload API
                    const response = await fetch('/api/upload/image', {
                        method: 'POST',
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        },
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        editor.chain().focus().setImage({ src: data.url }).run();
                    } else {
                        // Fallback to base64 if upload fails
                        const reader = new FileReader();
                        reader.onload = (event) => {
                            const url = event.target?.result as string;
                            editor.chain().focus().setImage({ src: url }).run();
                        };
                        reader.readAsDataURL(file);
                        console.error('Upload failed, using base64 fallback');
                    }
                } catch (error) {
                    console.error('Image upload error:', error);
                    alert('Lỗi upload ảnh. Vui lòng thử lại.');
                }
            }
        };
        input.click();
    };

    const insertTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    };

    const ToolbarButton: React.FC<{
        onClick: () => void;
        active?: boolean;
        disabled?: boolean;
        title: string;
        children: React.ReactNode;
    }> = ({ onClick, active, disabled, title, children }) => (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`p-2 rounded transition-colors ${active ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                } ${disabled ? 'opacity-30 cursor-not-allowed' : ''}`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
            {/* Toolbar */}
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
                {/* History */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Hoàn tác (Ctrl+Z)"
                >
                    <Undo size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Làm lại (Ctrl+Y)"
                >
                    <Redo size={18} />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Headings */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                    title="Tiêu đề 1"
                >
                    <Heading1 size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    title="Tiêu đề 2"
                >
                    <Heading2 size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    title="Tiêu đề 3"
                >
                    <Heading3 size={18} />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Text Formatting */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Đậm (Ctrl+B)"
                >
                    <Bold size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Nghiêng (Ctrl+I)"
                >
                    <Italic size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    active={editor.isActive('underline')}
                    title="Gạch chân (Ctrl+U)"
                >
                    <UnderlineIcon size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    active={editor.isActive('strike')}
                    title="Gạch ngang"
                >
                    <Strikethrough size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                    active={editor.isActive('highlight')}
                    title="Đánh dấu"
                >
                    <Highlighter size={18} />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Color Picker */}
                <div className="relative">
                    <ToolbarButton
                        onClick={() => setShowColorPicker(!showColorPicker)}
                        title="Màu chữ"
                    >
                        <Palette size={18} />
                    </ToolbarButton>
                    {showColorPicker && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg p-2 z-10">
                            <div className="grid grid-cols-5 gap-1">
                                {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
                                    '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#008000'].map(color => (
                                        <button
                                            key={color}
                                            className="w-6 h-6 rounded border border-gray-400 hover:scale-110 transition"
                                            style={{ backgroundColor: color }}
                                            onClick={() => {
                                                editor.chain().focus().setColor(color).run();
                                                setShowColorPicker(false);
                                            }}
                                        />
                                    ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Lists */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Danh sách"
                >
                    <List size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Danh sách số"
                >
                    <ListOrdered size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                    title="Trích dẫn"
                >
                    <Quote size={18} />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Alignment */}
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('left').run()}
                    active={editor.isActive({ textAlign: 'left' })}
                    title="Căn trái"
                >
                    <AlignLeft size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('center').run()}
                    active={editor.isActive({ textAlign: 'center' })}
                    title="Căn giữa"
                >
                    <AlignCenter size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('right').run()}
                    active={editor.isActive({ textAlign: 'right' })}
                    title="Căn phải"
                >
                    <AlignRight size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                    active={editor.isActive({ textAlign: 'justify' })}
                    title="Căn đều"
                >
                    <AlignJustify size={18} />
                </ToolbarButton>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Insert */}
                <ToolbarButton
                    onClick={addLink}
                    active={editor.isActive('link')}
                    title="Chèn link (Ctrl+K)"
                >
                    <LinkIcon size={18} />
                </ToolbarButton>
                {editor.isActive('link') && (
                    <ToolbarButton
                        onClick={() => editor.chain().focus().unsetLink().run()}
                        title="Xóa link"
                    >
                        <Unlink size={18} />
                    </ToolbarButton>
                )}
                <ToolbarButton
                    onClick={addImage}
                    title="Chèn ảnh"
                >
                    <ImageIcon size={18} />
                </ToolbarButton>
                <ToolbarButton
                    onClick={insertTable}
                    active={editor.isActive('table')}
                    title="Chèn bảng"
                >
                    <TableIcon size={18} />
                </ToolbarButton>
            </div>

            {/* Link Dialog */}
            {showLinkDialog && (
                <div className="bg-blue-50 border-b border-blue-200 p-3 flex items-center gap-2">
                    <LinkIcon size={18} className="text-blue-600" />
                    <input
                        type="url"
                        value={linkUrl}
                        onChange={(e) => setLinkUrl(e.target.value)}
                        placeholder="https://example.com"
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') setLink();
                            if (e.key === 'Escape') setShowLinkDialog(false);
                        }}
                    />
                    <button
                        onClick={setLink}
                        className="px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        OK
                    </button>
                    <button
                        onClick={() => setShowLinkDialog(false)}
                        className="px-4 py-1.5 border border-gray-300 rounded hover:bg-gray-100"
                    >
                        Hủy
                    </button>
                </div>
            )}

            {/* Editor */}
            <EditorContent
                editor={editor}
                className="bg-white prose-headings:font-bold prose-a:text-blue-600"
                style={{ minHeight: height }}
            />

            {/* Quick formatting tooltip when selecting text */}
            {editor.state.selection.empty === false && (
                <div className="fixed z-50 bg-gray-800 text-white rounded shadow-lg p-1 flex gap-1"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('bold') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                        title="Bold"
                    >
                        <Bold size={16} />
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={`px-2 py-1 rounded ${editor.isActive('italic') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                        title="Italic"
                    >
                        <Italic size={16} />
                    </button>
                    <button
                        onClick={addLink}
                        className={`px-2 py-1 rounded ${editor.isActive('link') ? 'bg-blue-600' : 'hover:bg-gray-700'}`}
                        title="Link"
                    >
                        <LinkIcon size={16} />
                    </button>
                </div>
            )}
        </div>
    );
};
