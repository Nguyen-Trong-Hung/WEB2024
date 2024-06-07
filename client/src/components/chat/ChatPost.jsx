import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext"; // Import SocketContext để sử dụng socket
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import "./chat.scss";
import { useNotificationStore } from "../../lib/notificationStore";

function ChatPost({handleClose, post, chats }) {
  console.log(chats);
  console.log(post.userId);
  chats.forEach(chat => {
    console.log(chat.receiver.id);
  });
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext); // Lấy thông tin người dùng hiện tại từ AuthContext
  const { socket } = useContext(SocketContext); // Lấy socket từ SocketContext
  const decrease = useNotificationStore((state) => state.decrease); // Lấy hàm decrease từ notificationStore
  console.log(currentUser);

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
  
  

  useEffect(() => {
    if (post && post.userId && chats) {
      const chat = chats.find(chat => chat.receiver.id === post.userId);
      if (chat) {
        handleOpenChat(chat.id, chat.receiver); // Gọi hàm với ID và thông tin người nhận
      }
    }
  }, [post.userId, chats]); // Chỉ chạy lại khi `post.userId` hoặc `chats` thay đổi
  

  useEffect(() => {
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
      <div className="chatBox">
        <div className="top">
          <div className="user">
            {/* Hiển thị avatar và tên của người đăng bài viết */}
            <img
              src={post.user.avatar || "/noavatar.jpg"}
              alt={post.user.username}
            />
            <span>{post.user.username}</span>
          </div>
          <span className="close" onClick={handleClose}>
            X
          </span>
        </div>
        <div className="center">
          {chat?.messages?.map((message) => (
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
          )) || <p>No messages available</p>}
        </div>

        <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Gửi</button>
          </form>
      </div>
    </div>
  );
}

export default ChatPost;
