import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
    let [formData, setFormData] = useState({
        name: "",
        username: "",
        password: ""
    });
    let [error, setError] = useState("");
    let navigate = useNavigate();
    function handleChange(e) {
        let { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }
    function handleSubmit(e) {
        e.preventDefault();
        axios.get("http://localhost:3000/users?username=" + formData.username)
            .then(res => {
                if (res.data.length > 0) {
                    setError("Tên đăng nhập đã tồn tại.");
                } else {
                    axios.post("http://localhost:3000/users", formData)
                        .then(res => {
                            localStorage.setItem("user", JSON.stringify(res.data));
                            navigate("/dashboard");
                        })
                        .catch(() => setError("Lỗi khi tạo tài khoản."));
                }
            })
            .catch(() => setError("Lỗi kiểm tra tên đăng nhập."));
    }
    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="text-center mb-4">Đăng ký</h3>
                            {error && (
                                <div className="alert alert-danger text-center">
                                    {error}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Họ và tên</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập họ và tên"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tên đăng nhập</label>
                                    <input
                                        type="text"
                                        name="username"
                                        className="form-control"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập username"
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        placeholder="Nhập mật khẩu"
                                    />
                                </div>
                                <button type="submit" className="btn btn-success w-100">
                                    Đăng ký
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
