function socketController(socket) {
  //   클라이언트 종료
  socket.on("disconnect", () => {
    console.log("user disconnect!");
  });
}

module.exports = socketController;
