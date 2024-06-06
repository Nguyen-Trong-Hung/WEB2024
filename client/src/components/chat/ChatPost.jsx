import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLoaderData } from "react-router-dom";
import "./chat.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { format } from "timeago.js";
import { SocketContext } from "../../context/SocketContext";
import { useNotificationStore } from "../../lib/notificationStore";

function ChatPost({ chats, handleClose }) {
  const post = useLoaderData();
  const [chat, setChat] = useState(true);

  return (
    <div className="chat">
      {chat && (
        <div className="chatBox">
          <div className="top">
            <div className="user">
              <img
                src="https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt=""
              />
              John Doe
            </div>
            <span className="close" onClick={handleClose}>
              X
            </span>
          </div>
          <div className="center">
            <div className="chatMessage">
              <p>Lorem ipsum dolor sit amet</p>
              <span>1 hour ago</span>
            </div>
          </div>
          <div className="bottom">
            <textarea></textarea>
            <button>Gửi</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatPost;
