import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import "./chat.scss";
import { useNotificationStore } from "../../lib/notificationStore";

function ChatPost({ handleClose, post, chats }) {
  const [chat, setChat] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { socket } = useContext(SocketContext);
  const decrease = useNotificationStore((state) => state.decrease);

  const createNewChat = async (receiverId) => {
    try {
      const res = await apiRequest.post("/chats", { receiverId });
      if (res && res.data) {
        setChat(res.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const text = formData.get("text");

    if (!text) return;

    try {
      if (chat && chat.id) {
        const res = await apiRequest.post("/messages/" + chat.id, { text });
        setChat((prev) => ({
          ...prev,
          messages: [...(prev.messages || []), res.data],
        }));
        e.target.reset();
        socket.emit("sendMessage", {
          receiverId: chat.receiver.id,
          data: res.data,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleOpenChat = async (chatId, receiverId) => {
    try {
      let existingChat;
      if (chatId) {
        existingChat = chats.find((chat) => chat.id === chatId);
      } else {
        existingChat = chats.find((chat) => chat.receiver && chat.receiver.id === receiverId);
      }

      if (existingChat) {
        const res = await apiRequest("/chats/" + existingChat.id);
        if (res && res.data && !res.data.seenBy.includes(currentUser.id)) {
          decrease();
        }
        setChat({ ...res.data, receiver: existingChat.receiver });
      } else {
        await createNewChat(receiverId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (post && post.userId && chats) {
      handleOpenChat(null, post.userId);
    }
  }, [post.userId, chats]);

  useEffect(() => {
    if (chat && socket) {
      socket.on("getMessage", (data) => {
        if (chat.id === data.chatId) {
          setChat((prev) => ({ ...prev, messages: [...prev.messages, data] }));
        }
      });
    }
    return () => {
      socket.off("getMessage");
    };
  }, [socket, chat]);

  return (
    <div className="chat">
      <div className="chatBox">
        <div className="top">
          <div className="user">
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
                    : "flex-start",
                textAlign: message.userId === currentUser.id ? "right" : "left",
              }}
              key={message.id}
            >
              <p>{message.text}</p>
              <span>{format(message.createdAt)}</span>
            </div>
          )) || <p>Chưa có tin nhắn nào!</p>}
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
