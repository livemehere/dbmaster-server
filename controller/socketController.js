function socketController(io, socket) {
  // 클라이언트 접속
  console.log(`a user connected! id:(${socket.id})`);
  socket.emit("notice", { msg: "환영해" });

  //   클라이언트 종료
  socket.on("disconnect", () => {
    console.log("user disconnect!");
    // 한 클라이언트가 접속을 종료하면, 다른 클라이언트들에게 msg전송
    socket.broadcast.emit("msgInbox", { msg: `${socket.id}이 접속종료` });
  });

  // server side
  //   사용자가 채팅을 전송하면
  socket.on("message", (data) => {
    console.log(data);
    socket.broadcast.emit("msgInbox", { msg: data });
  });
}

module.exports = socketController;
