import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:3000/users/${id}`)
            .then(res => setUser(res.data))
            .catch(err => {
                console.error("Không tìm thấy người dùng:", err);
                alert("Không tìm thấy người dùng.");
                navigate("/");
            });
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.put(`http://localhost:3000/users/${id}`, user)
            .then(() => {
                alert("Cập nhật thông tin thành công!");
                // Cập nhật lại localStorage nếu đang sửa chính mình
                const current = JSON.parse(localStorage.getItem("user"));
                if (current && current.id === user.id) {
                    localStorage.setItem("user", JSON.stringify(user));
                }
                navigate(-1);
            })
            .catch(err => {
                console.error("Lỗi khi cập nhật:", err);
                alert("Cập nhật thất bại.");
            });
    };

    if (!user) return <div className="container mt-5">Đang tải dữ liệu người dùng...</div>;

    return (
        <div className="container mt-5">
            <h2 className="mb-4">📝 Sửa thông tin cá nhân</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Họ và tên</label>
                    <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={user.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Tên đăng nhập</label>
                    <input
                        type="text"
                        className="form-control"
                        name="username"
                        value={user.username}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Mật khẩu</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? "text" : "password"}
                            className="form-control"
                            name="password"
                            value={user.password}
                            onChange={handleChange}
                            required
                        />
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "Ẩn" : "Hiện"}
                        </button>
                    </div>
                </div>
                <button type="submit" className="btn btn-success me-2">Lưu</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Quay lại</button>
            </form>
        </div>
    );
}
