import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ChatPost from "../../components/chat/ChatPost";
import apiRequest from "../../lib/apiRequest";

function SinglePage() {
  const { postData: post, chatData: chats } = useLoaderData();
  // console.log(post);
  // console.log(chats);
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  // console.log(currentUser);
  // console.log(post.userId)
  const navigate = useNavigate();

  const [chatBox, setChatBox] = useState({
    isOpen: false,
    data: null,
  });

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  const handleOpenChatBox = async () => {
    setChatBox((prev) => ({
      ...prev,
      isOpen: true,
      data: chats
    }));
  };

  const handleCloseChatBox = () => {
    setChatBox({
      isOpen: false,
      data: null,
    });
  };

  const handleDeletePost = async(postId) => {
    try{
      if (!currentUser) {
        navigate("/login");
      }
      if (window.confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
        const response = await apiRequest.delete(`/posts/delete/${postId}`);
        // Ví dụ: gọi hàm API để xóa bài viết từ cơ sở dữ liệu
        if (response.status === 200) {
          // Xóa bài viết thành công, chuyển hướng về trang chủ hoặc thực hiện các hành động khác
          navigate("/");
        }
      }
    } catch(err) {
      console.log(err);
    }
  };
  

  return (
    <div className="singlePage">
      <div className="details">
        <div className="wrapper">
          <Slider images={post.images} />
          <div className="info">
            <div className="top">
              <div className="post">
                <h1>{post.title}</h1>
                <div className="address">
                  <img src="/pin.png" alt="" />
                  <span>{post.address}</span>
                </div>
                <div className="price">{post.price} VNĐ</div>
              </div>
              <div className="user">
                <img src={post.user?.avatar || "/noavatar.jpg"} alt="" />
                <span>{post.user?.username}</span>
              </div>
            </div>
            <div
              className="bottom"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(post.postDetail.desc),
              }}
            ></div>
          </div>
        </div>
      </div>
      <div className="features">
        <div className="wrapper">
          <p className="title">Tổng quan</p>
          <div className="listVertical">
            <div className="feature">
              <img src="/utility.png" alt="" />
              <div className="featureText">
                <span>Tiện ích</span>
                {post.postDetail.utilities === "owner" ? (
                  <p>Chủ sở hữu chịu trách nhiệm</p>
                ) : (
                  <p>Người thuê nhà có trách nhiệm</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/pet.png" alt="" />
              <div className="featureText">
                <span>Chính sách nuôi thú cưng</span>
                {post.postDetail.pet === "allowed" ? (
                  <p>Cho phép</p>
                ) : (
                  <p>Không cho phép</p>
                )}
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Tài chính</span>
                <p>{post.postDetail.income}</p>
              </div>
            </div>
          </div>
          <p className="title">Kích thước</p>
          <div className="sizes">
            <div className="size">
              <img src="/size.png" alt="" />
              <span>{post.postDetail.size} m2</span>
            </div>
            <div className="size">
              <img src="/bed.png" alt="" />
              <span>{post.bedroom} phòng ngủ</span>
            </div>
            <div className="size">
              <img src="/bath.png" alt="" />
              <span>{post.bathroom} phòng tắm</span>
            </div>
          </div>
          <p className="title">Nổi bật</p>
          <div className="listHorizontal">
            <div className="feature">
              <img src="/school.png" alt="" />
              <div className="featureText">
                <span>Trường học</span>
                <p>
                  {post.postDetail.school > 999
                    ? post.postDetail.school / 1000 + "km"
                    : post.postDetail.school + "m"}{" "}
                </p>
              </div>
            </div>
            <div className="feature">
              <img src="/bus.png" alt="" />
              <div className="featureText">
                <span>Trạm xe bus</span>
                <p>{post.postDetail.bus}m</p>
              </div>
            </div>
            <div className="feature">
              <img src="/fee.png" alt="" />
              <div className="featureText">
                <span>Nhà hàng</span>
                <p>{post.postDetail.restaurant}m</p>
              </div>
            </div>
          </div>
          <p className="title">Địa chỉ</p>
          <div className="mapContainer">
            <Map items={[post]} />
          </div>
          <div className="buttons">
          <button onClick={currentUser.id !== post.userId ? handleOpenChatBox : () => handleDeletePost(post.id)}>
            <img src={currentUser.id !== post.userId ? "/chat.png" : "/delete.jpg"} alt="" />
            {currentUser.id !== post.userId ? "Nhắn tin" : "Xóa bài viết"}
          </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: saved ? "#fece51" : "white",
              }}
            >
              <img src="/save.png" alt="" />
              {saved ? "Địa điểm đã lưu" : "Lưu địa điểm"}
            </button>
          </div>
          {/* Hiển thị ChatBox nếu isOpen là true */}
          {chatBox.isOpen && (
            <ChatPost 
            handleClose={handleCloseChatBox} 
            post={post}
            chats={chatBox.data}
          />
          )}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
