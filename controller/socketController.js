function socketController(io, socket) {
  // 클라이언트 접속
  console.log("a user connected!");
  io.emit("notice", { msg: "환영해" });

  //   클라이언트 종료
  socket.on("disconnect", () => {
    console.log("user disconnect!");
  });

  // server side
  socket.on("message", (data) => {
    console.log(data);
  });
}

module.exports = socketController;
