import {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
export default function Login() {
    let navigate = useNavigate();
    let [username, setUsername] = useState("");
    let [password, setPassword] = useState("");
    let [message, setMessage] = useState("");
    function handleLogin(e) {
        e.preventDefault();
        axios.get('http://localhost:3000/users')
            .then(res => {
                let user = res.data;
                let foundUser = user.find(user => user.username === username && user.password === password);
                if (foundUser) {
                    localStorage.setItem("user", JSON.stringify(foundUser));
                    navigate("/");
                } else {
                    setMessage("Wrong username or password");
                }
            })
        .catch(err => {
            console.log(err);
            setMessage("Connect Error!");
        })

    }
    return (
        <>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-md-6 col-lg-4">
                        <div className="card shadow-lg">
                            <div className="card-body">
                                <h3 className="text-center mb-4">Login</h3>
                                <form onSubmit={handleLogin}>
                                    <div className="mb-3">
                                        <label className="form-label">User Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            placeholder="Username"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Password"
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Login</button>
                                </form>
                                {message && (
                                    <div className="alert alert-info mt-3 text-center" role="alert">
                                        {message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}