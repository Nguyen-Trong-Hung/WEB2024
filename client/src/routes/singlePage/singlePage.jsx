import "./singlePage.scss";
import Slider from "../../components/slider/Slider";
import Map from "../../components/map/Map";
import { useNavigate, useLoaderData } from "react-router-dom";
import DOMPurify from "dompurify";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import ChatPost from "../../components/chat/ChatPost";

function SinglePage() {
  const post = useLoaderData();
  const [saved, setSaved] = useState(post.isSaved);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  // State để kiểm soát việc hiển thị của ChatBox
  const [chatBox, setChatBox] = useState({
    isOpen: false,
    data: null,
  });
  const [chatResponse, setChatResponse] = useState(null);

  const handleSave = async () => {
    if (!currentUser) {
      navigate("/login");
    }
    // AFTER REACT 19 UPDATE TO USEOPTIMISTIK HOOK
    setSaved((prev) => !prev);
    try {
      await apiRequest.post("/users/save", { postId: post.id });
    } catch (err) {
      console.log(err);
      setSaved((prev) => !prev);
    }
  };

  // Function để mở ChatBox khi nhấn vào nút "Nhắn tin"
  const handleOpenChatBox = async () => {
    setChatBox((prev) => ({
      ...prev,
      isOpen: true,
    }));
    try {
      const response = await apiRequest.get("/chats"); // Giả sử đây là API để lấy dữ liệu chat
      setChatBox((prev) => ({
        ...prev,
        data: response,
      }));
    } catch (err) {
      console.log(err);
    }
  };

    // Function để đóng ChatBox khi nhấn vào nút "X"
    const handleCloseChatBox = () => {
      setChatBox({
        isOpen: false,
        data: null,
      });
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
                <div className="price">{post.price} tỉ VNĐ</div>
              </div>
              <div className="user">
                <img src={post.user.avatar} alt="" />
                <span>{post.user.username}</span>
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
              <img src="/pet.png" alt="" />
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
            <button onClick={handleOpenChatBox}>
              <img src="/chat.png" alt="" />
              Nhắn tin
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
                chats={chatBox.data}
              />
            )}
        </div>
      </div>
    </div>
  );
}

export default SinglePage;
