import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function HomeLayout() {
    let [currentUser, setCurrentUser] = useState(null);
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        let userData = localStorage.getItem("user");
        if (userData) {
            setCurrentUser(JSON.parse(userData));
        } else {
            setCurrentUser(null);
        }
    }, [location]);
    function handleLogout() {
        localStorage.removeItem("user");
        setCurrentUser(null);
        navigate("/");
    }

    return (
        <div className="container py-4">
            <nav className="d-flex justify-content-between align-items-center mb-4">
                <h2>📚 Blog App</h2>
                <div>
                    {currentUser ? (
                        <>
                            <span className="me-3">👋 Xin chào, {currentUser.name}</span>
                            <Link
                                to={`/edit-user/${currentUser.id}`}
                                className="btn btn-warning btn-sm me-2"
                            >
                                Sửa thông tin
                            </Link>
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn btn-primary me-2">Login</Link>
                            <Link to="/register" className="btn btn-success">Register</Link>
                        </>
                    )}
                </div>
            </nav>

            <Outlet />
        </div>
    );
}
