import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./Home/HomeLayout";
import HomePage from "./Home/HomePage";
import Login from "./User/Login";
import Register from "./User/Register";
import PrivateRoute from "./Home/PrivateRoute";
import AddPost from "./Blog/AddPost";
import EditPost from "./Blog/EditPost";
import EditUser from "./User/EditUser";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomeLayout />}>
                    <Route index element={<HomePage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>

                <Route
                    path="/add-post"
                    element={
                        <PrivateRoute>
                            <AddPost />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-post/:id"
                    element={
                        <PrivateRoute>
                            <EditPost />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/edit-user/:id"
                    element={
                        <PrivateRoute>
                            <EditUser />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
