import { useContext, useEffect, useRef, useState } from "react";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

// Component Chat nhận vào prop "chats"
function Chat({ chats }) {
  console.log(chats);
  const [chat, setChat] = useState(null); // State để lưu trữ thông tin cuộc trò chuyện hiện tại
  const { currentUser } = useContext(AuthContext); // Lấy thông tin người dùng hiện tại từ AuthContext
  const { socket } = useContext(SocketContext); // Lấy socket từ SocketContext

  const messageEndRef = useRef(); // Tạo một ref để cuộn xuống cuối tin nhắn mới

  const decrease = useNotificationStore((state) => state.decrease); // Lấy hàm decrease từ notificationStore

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" }); // Cuộn xuống cuối tin nhắn mỗi khi "chat" thay đổi
  }, [chat]);

  // Hàm để mở một cuộc trò chuyện
  const handleOpenChat = async (id, receiver) => {
    try {
      const res = await apiRequest("/chats/" + id); // Gửi yêu cầu lấy dữ liệu cuộc trò chuyện từ server
      if (!res.data.seenBy.includes(currentUser.id)) {
        decrease(); // Giảm số lượng thông báo nếu người dùng chưa thấy tin nhắn này
      }
      setChat({ ...res.data, receiver }); // Cập nhật state "chat" với dữ liệu từ server và thông tin người nhận
    } catch (err) {
      console.log(err); // In ra lỗi nếu có
    }
  };

  // Hàm để gửi tin nhắn mới
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target); // Lấy dữ liệu từ form
    const text = formData.get("text"); // Lấy giá trị của trường "text"

    if (!text) return;
    try {
      const res = await apiRequest.post("/messages/" + chat.id, { text }); // Gửi tin nhắn mới lên server
      setChat((prev) => ({ ...prev, messages: [...prev.messages, res.data] })); // Cập nhật state "chat" với tin nhắn mới
      e.target.reset(); // Reset form
      socket.emit("sendMessage", {
        receiverId: chat.receiver.id,
        data: res.data, // Gửi tin nhắn mới qua socket
      });
    } catch (err) {
      console.log(err); // In ra lỗi nếu có
    }
  };

  // useEffect để xử lý khi nhận tin nhắn mới qua socket
  useEffect(() => {
    const read = async () => {
      try {
        await apiRequest.put("/chats/read/" + chat.id); // Đánh dấu cuộc trò chuyện là đã đọc trên server
      } catch (err) {
        console.log(err); // In ra lỗi nếu có
      }
    };

    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] })); // Cập nhật state "chat" với tin nhắn mới
          read(); // Đánh dấu cuộc trò chuyện là đã đọc
        }
      });
    }
    return () => {
      socket.off("getMessage"); // Loại bỏ listener khi component unmount hoặc khi socket/chat thay đổi
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="messages">
        <h1>Tin nhắn</h1>
        {chats?.filter(c => c.lastMessage !== null).map((c) => (
          <div
            className="message"
            key={c.id}
            style={{
              backgroundColor:
                c.seenBy.includes(currentUser.id) || chat?.id === c.id
                  ? "white"
                  : "#fecd514e", // Đổi màu nền nếu tin nhắn đã được xem
            }}
            onClick={() => handleOpenChat(c.id, c.receiver)} // Mở cuộc trò chuyện khi nhấp vào
          >
            {c.receiver ? (
              <>
                <img src={c.receiver.avatar || "/noavatar.jpg"} alt="" />
                <span>{c.receiver.username}</span>
              </>
            ) : (
              <span>Receiver not found</span>
            )}
            <p>{c.lastMessage}</p>
          </div>
        ))}
      </div>
      {chat && (
        <div className="chatBox">
          <div className="top">
            {chat.receiver ? (
              <div className="user">
                <img src={chat.receiver.avatar || "noavatar.jpg"} alt="" />
                {chat.receiver.username}
              </div>
            ) : (
              <div className="user">Receiver not found</div>
            )}
            <span className="close" onClick={() => setChat(null)}>
              X
            </span>
          </div>
          <div className="center">
            {chat.messages.map((message) => (
              <div
                className="chatMessage"
                style={{
                  alignSelf:
                    message.userId === currentUser.id
                      ? "flex-end"
                      : "flex-start", // Căn tin nhắn sang phải nếu là của người dùng hiện tại
                  textAlign:
                    message.userId === currentUser.id ? "right" : "left", // Căn văn bản theo hướng của tin nhắn
                }}
                key={message.id}
              >
                <p>{message.text}</p>
                <span>{format(message.createdAt)}</span>
              </div>
            ))}
            <div ref={messageEndRef}></div> 
          </div>
          <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Gửi</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Chat;
