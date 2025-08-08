import { Navigate } from "react-router-dom";
export default function PrivateRoute({ children }) {
    let isLoggedIn = localStorage.getItem("user");
    return isLoggedIn ? children : <Navigate to="/login" />;
}
