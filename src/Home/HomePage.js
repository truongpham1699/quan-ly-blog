import { useEffect, useState } from "react";
import { useLocation, Link, } from "react-router-dom";
import axios from "axios";

export default function HomePage() {
    let [posts, setPosts] = useState([]);
    let [currentUser, setCurrentUser] = useState(null);
    let [users, setUsers] = useState([]);
    let [visibleComments, setVisibleComments] = useState([]);
    let location = useLocation();
    let [newComments, setNewComments] = useState({});

    useEffect(() => {
        let userData = localStorage.getItem("user");
        if (userData) {
            let user = JSON.parse(userData);
            setCurrentUser(user);
        } else {
            setCurrentUser(null);
        }
        Promise.all([
            axios.get("http://localhost:3000/posts"),
            axios.get("http://localhost:3000/users")
        ])
            .then(([postRes, userRes]) => {
                let allPosts = postRes.data;
                let allUsers = userRes.data;
                setUsers(allUsers);

                let filteredPosts;
                if (userData) {
                    const user = JSON.parse(userData);
                    filteredPosts = allPosts.filter(post =>
                        post.visibility === "public" ||
                        (post.visibility === "private" && post.authorId === user.id)
                    );
                } else {
                    filteredPosts = allPosts.filter(post => post.visibility === "public");
                }
                setPosts(filteredPosts);
            });
    }, [location]);

    function handleDelete(id) {
        if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
            axios.delete(`http://localhost:3000/posts/${id}`)
                .then(() => {
                    setPosts(prev => prev.filter(post => post.id !== id));
                    alert("Đã xóa bài viết.");
                })
                .catch(() => alert("Lỗi khi xóa bài viết!"));
        }
    }

    function toggleComments(postId) {
        setVisibleComments(prev =>
            prev.includes(postId)
                ? prev.filter(id => id !== postId)
                : [...prev, postId]
        );
    }
    function handleAddComment(postId) {
        if (!currentUser || !newComments[postId]) return;

        let newComment = {
            id: Date.now(), // tạm thời
            userId: currentUser.id,
            content: newComments[postId],
            createdAt: new Date().toLocaleString()
        };

        // Tìm bài viết hiện tại
        let targetPost = posts.find(post => post.id === postId);
        if (!targetPost) return;

        let updatedComments = [...(targetPost.comments || []), newComment];

        // Cập nhật comments lên server
        axios.patch(`http://localhost:3000/posts/${postId}`, {
            comments: updatedComments
        })
            .then(() => {
                // Cập nhật lại state sau khi server đã lưu thành công
                setPosts(prev =>
                    prev.map(post =>
                        post.id === postId ? { ...post, comments: updatedComments } : post
                    )
                );
                setNewComments(prev => ({ ...prev, [postId]: "" }));
            })
            .catch(() => {
                alert("Không thể thêm bình luận. Vui lòng thử lại!");
            });
    }
    function handleDeleteComment(postId, commentId) {
        let targetPost = posts.find(post => post.id === postId);
        if (!targetPost) return;

        let updatedComments = (targetPost.comments || []).filter(comment => comment.id !== commentId);

        axios.patch(`http://localhost:3000/posts/${postId}`, {
            comments: updatedComments
        })
            .then(() => {
                setPosts(prev =>
                    prev.map(post =>
                        post.id === postId ? { ...post, comments: updatedComments } : post
                    )
                );
                alert("Đã xóa bình luận.");
            })
            .catch(() => {
                alert("Không thể xóa bình luận. Vui lòng thử lại!");
            });
    }

    function getUserName(userId) {
        let user = users.find(u => u.id === userId);
        return user ? user.name : "Ẩn danh";
    }

    return (
        <div>
            <h2>Danh sách bài viết</h2>
            {currentUser && (
                <div className="mb-3">
                    <Link to="/add-post" className="btn btn-primary">Tạo bài viết</Link>
                </div>
            )}
            {posts.length === 0 ? (
                <p>Không có bài viết nào.</p>
            ) : (
                posts.map(post => (
                    <div key={post.id} className="mb-4 border-bottom pb-3">
                        <h3>
                            {post.title}
                            {post.visibility === "private" && (
                                <span className="badge bg-warning text-dark ms-2">Riêng tư</span>
                            )}
                        </h3>
                        <p>{post.content}</p>
                        <small>Ngày tạo: {post.createdAt}</small>
                        <br />
                        {currentUser && post.authorId === currentUser.id && (
                            <div className="mt-2">
                                <Link to={`/edit-post/${post.id}`} className="btn btn-sm btn-warning me-2">Sửa</Link>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(post.id)}>Xóa</button>
                            </div>
                        )}

                        {/* Ẩn hiện bình luận */}
                        <div className="mt-2">
                            <button
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => toggleComments(post.id)}
                            >
                                {visibleComments.includes(post.id) ? "Ẩn bình luận" : "Hiện bình luận"}
                            </button>

                            {visibleComments.includes(post.id) && (
                                <div className="mt-2 ps-3 border-start">
                                    <strong>Bình luận:</strong>
                                    {post.comments?.length > 0 ? (
                                        <ul className="mt-2">
                                            {post.comments.map((comment) => (
                                                <div key={comment.id} className="comment d-flex align-items-center justify-content-between mb-2">
                                                    <p className="mb-0">
                                                        <strong>{getUserName(comment.userId)}</strong>: {comment.content}
                                                    </p>
                                                    {(currentUser?.id === comment.userId || currentUser?.id === post.authorId) && (
                                                        <button className="btn btn-sm btn-danger"
                                                                onClick={() => handleDeleteComment(post.id, comment.id)}
                                                                title="Xóa bình luận"
                                                        >Xóa</button>
                                                    )}
                                                </div>
                                            ))}
                                        </ul>
                                    ) : (<p className="text-muted">Chưa có bình luận nào.</p>
                                    )}
                                    {currentUser && (
                                        <div className="mt-2">
                                            <textarea className="form-control"
                                                      placeholder="Nhập bình luận..."
                                                      value={newComments[post.id] || ""}
                                                      onChange={(e) =>
                                                          setNewComments((prev) => ({
                                                              ...prev,
                                                              [post.id]: e.target.value,}))}/>
                                            <button className="btn btn-sm btn-primary mt-1"
                                                    onClick={() => handleAddComment(post.id)}
                                            >Gửi bình luận</button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
