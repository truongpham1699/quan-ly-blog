import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import { Button, ButtonGroup } from 'react-bootstrap'
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl, FaHeading, FaQuoteRight, FaCode, FaUndo, FaRedo, FaLink } from 'react-icons/fa'

export default function TextEditor({ content, onChange }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
        ],
        content: content || '',
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange(html)
        },
    })

    if (!editor) return null

    return (
        <div className="text-editor p-3 border rounded">
            <ButtonGroup className="mb-2 flex-wrap">
                <Button
                    title="In đậm"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    variant={editor.isActive('bold') ? 'primary' : 'outline-secondary'}>
                    <FaBold />
                </Button>
                <Button
                    title="In nghiêng"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    variant={editor.isActive('italic') ? 'primary' : 'outline-secondary'}>
                    <FaItalic />
                </Button>
                <Button
                    title="Gạch chân"
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    variant={editor.isActive('underline') ? 'primary' : 'outline-secondary'}>
                    <FaUnderline />
                </Button>
                <Button
                    title="Danh sách chấm"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    variant={editor.isActive('bulletList') ? 'primary' : 'outline-secondary'}>
                    <FaListUl />
                </Button>
                <Button
                    title="Danh sách số"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    variant={editor.isActive('orderedList') ? 'primary' : 'outline-secondary'}>
                    <FaListOl />
                </Button>
                <Button
                    title="Tiêu đề"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    variant={editor.isActive('heading', { level: 2 }) ? 'primary' : 'outline-secondary'}>
                    <FaHeading />
                </Button>
                <Button
                    title="Trích dẫn"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    variant={editor.isActive('blockquote') ? 'primary' : 'outline-secondary'}>
                    <FaQuoteRight />
                </Button>
                <Button
                    title="Mã lệnh"
                    onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                    variant={editor.isActive('codeBlock') ? 'primary' : 'outline-secondary'}>
                    <FaCode />
                </Button>
                <Button
                    title="Chèn liên kết"
                    onClick={() => {
                        const url = window.prompt('Nhập URL liên kết:')
                        if (url) editor.chain().focus().setLink({ href: url }).run()
                    }}
                    variant="outline-secondary">
                    <FaLink />
                </Button>
                <Button
                    title="Hoàn tác"
                    onClick={() => editor.chain().focus().undo().run()}
                    variant="outline-secondary">
                    <FaUndo />
                </Button>
                <Button
                    title="Làm lại"
                    onClick={() => editor.chain().focus().redo().run()}
                    variant="outline-secondary">
                    <FaRedo />
                </Button>
            </ButtonGroup>

            <EditorContent editor={editor} />
        </div>
    )
}
