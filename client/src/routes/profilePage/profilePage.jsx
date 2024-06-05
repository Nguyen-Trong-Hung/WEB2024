import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import { Await, Link, useLoaderData, useNavigate } from "react-router-dom";
import { Suspense, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfilePage() {
  const data = useLoaderData();

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="profilePage">
      <div className="details">
        <div className="wrapper">
          <div className="title">
            <h1>Thông tin người dùng</h1>
            <Link to="/profile/update">
              <button>Chỉnh sửa hồ sơ</button>
            </Link>
          </div>
          <div className="info">
            <span>
              Avatar:
              <img src={currentUser.avatar || "noavatar.jpg"} alt="" />
            </span>
            <span>
              Tên đăng nhập: <b>{currentUser.username}</b>
            </span>
            <span>
              E-mail: <b>{currentUser.email}</b>
            </span>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
          <div className="title">
            <h1>Bài viết của tôi</h1>
            <Link to="/add">
              <button>Tạo bài mới</button>
            </Link>
          </div>
          <Suspense fallback={<p>Đang tải...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Lỗi tải!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
          <div className="title">
            <h1>Bài viết đã lưu</h1>
          </div>
          <Suspense fallback={<p>Đang tải...</p>}>
            <Await
              resolve={data.postResponse}
              errorElement={<p>Lỗi tải!</p>}
            >
              {(postResponse) => <List posts={postResponse.data.savedPosts} />}
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="chatContainer">
        <div className="wrapper">
          <Suspense fallback={<p>Đang tải...</p>}>
            <Await
              resolve={data.chatResponse}
              errorElement={<p>Lỗi tải!</p>}
            >
              {(chatResponse) => <Chat chats={chatResponse.data}/>}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
