import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TextEditor from "../Blog/TextEditor";

export default function AddPost() {
    let [title, setTitle] = useState("");
    let [content, setContent] = useState("");
    let [visibility, setVisibility] = useState("public");
    let navigate = useNavigate();
    let user = JSON.parse(localStorage.getItem("user"));

    let handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            alert("Chưa đăng nhập.");
            return;
        }

        const newPost = {
            title,
            content,
            visibility,
            authorId: user.id,
            createdAt: new Date().toISOString(),
            comments: []
        };

        axios.post("http://localhost:3000/posts", newPost)
            .then(() => {
                alert("Đăng bài thành công!");
                navigate("/");
            })
            .catch(err => {
                console.error("Lỗi tạo bài viết:", err);
                alert("Tạo bài viết thất bại!");
            });
    };

    return (
        <div className="container mt-5">
            <h2 className="mb-4">Tạo bài viết mới</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Tiêu đề</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>

                <TextEditor content={content} onChange={setContent} />
                <div className="mb-3 mt-3">
                    <label className="form-label">Chế độ hiển thị</label>
                    <select
                        className="form-select"
                        value={visibility}
                        onChange={(e) => setVisibility(e.target.value)}
                    >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                    </select>
                </div>

                <button type="submit" className="btn btn-primary me-2">Đăng bài</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
            </form>
        </div>
    );
}
