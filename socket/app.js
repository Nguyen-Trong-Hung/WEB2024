import { Server } from "socket.io";

const io = new Server({
  cors: {
    origin: "http://localhost:5173",
  },
});

let onlineUser = [];

const addUser = (userId, socketId) => {
  const userExists = onlineUser.find((user) => user.userId === userId);
  if (!userExists) {
    onlineUser.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  onlineUser = onlineUser.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return onlineUser.find((user) => user.userId === userId);
};

io.on("connection", (socket) => {
  // Khi một người dùng mới kết nối
  socket.on("newUser", (userId) => {
    addUser(userId, socket.id);
    io.emit("getUsers", onlineUser);
  });

  // Khi nhận tin nhắn từ client
  socket.on("sendMessage", ({ receiverId, data }) => {
    const receiver = getUser(receiverId);
    if (receiver && receiver.socketId) {
      io.to(receiver.socketId).emit("getMessage", data);
    } else {
      console.error("Receiver hoặc socketId không tồn tại");
    }
  });

  // Khi người dùng ngắt kết nối
  socket.on("disconnect", () => {
    removeUser(socket.id);
    io.emit("getUsers", onlineUser);
  });
});

io.listen("4000");
