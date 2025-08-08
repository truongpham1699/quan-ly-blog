import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function EditPost() {
    let { id } = useParams();
    let navigate = useNavigate();
    let [post, setPost] = useState(null);
    let [title, setTitle] = useState("");
    let [content, setContent] = useState("");
    let [visibility, setVisibility] = useState("public");

    useEffect(() => {
        let user = JSON.parse(localStorage.getItem("user"));
        if (!user) {
            alert("Đăng nhập để sửa");
            return navigate("/login");
        }

        axios.get(`http://localhost:3000/posts/${id}`)
            .then(res => {
                const data = res.data;
                if (data.authorId !== user.id) {
                    alert("Bạn không có quyền sửa bài viết này.");
                    return navigate("/");
                }

                setPost(data);
                setTitle(data.title);
                setContent(data.content);
                setVisibility(data.visibility);
            })
            .catch(() => {
                alert("Không tìm thấy bài viết.");
                navigate("/");
            });
    }, [id, navigate]);

    function handleSubmit(e) {
        e.preventDefault();

        axios.put(`http://localhost:3000/posts/${id}`, {
            ...post,
            title,
            content,
            visibility
        }).then(() => {
            alert("Cập nhật bài viết thành công.");
            navigate("/");
        }).catch(() => alert("Lỗi khi cập nhật bài viết."));
    }

    if (!post) return <p>Đang tải dữ liệu...</p>;

    return (
        <div>
            <h2>Sửa bài viết</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Tiêu đề</label>
                    <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Nội dung</label>
                    <textarea
                        className="form-control"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows="5"
                        required
                    />
                </div>
                <div className="mb-3">
                    <label>Chế độ hiển thị</label>
                    <select
                        className="form-select"
                        value={visibility}
                        onChange={e => setVisibility(e.target.value)}
                    >
                        <option value="public">Công khai</option>
                        <option value="private">Riêng tư</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-success">Cập nhật</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
            </form>
        </div>
    );
}
