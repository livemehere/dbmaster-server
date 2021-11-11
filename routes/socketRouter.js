module.export = (socket) => {
  // 클라이언트 접속
  console.log("a user connected!");

  //   클라이언트 종료
  socket.on("disconnect", () => {
    console.log("user disconnect!");
  });
};
