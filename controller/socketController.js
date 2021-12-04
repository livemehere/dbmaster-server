let onlineUser = [];

function socketController(io, socket) {
  // 클라이언트 접속

  //현재 접속되어있는 room 목록(개인들도,자신만의 room이 생성됨)
  // console.log(io.sockets.adapter.rooms);

  // username을 세팅
  socket.on("initUser", (userID) => {
    // 온라인된 유저 목록을 관리
    onlineUser.push({
      userID: userID,
      socketID: socket.id,
    });

    console.log("---온라인유저현황---");
    console.log(onlineUser);
    console.log("-----------------");
  });

  // 채팅메세지는 모두 여기로 통한다
  socket.on("chat", (data) => {
    console.log(data);
    console.log(typeof data);
    // 윈폼에서 받는경우 스트링으로 오기때문에, JSON으로 전환
    if (typeof data == "string") {
      console.log("json으로 커버팅");
      data = JSON.parse(data);
    }
    console.log(data.targetUserID);
    const targetSocketID = findSocketIdByuserID(data.targetUserID);
    // console.log(`user가 있는가? : ${targetSocketID}`);

    if (targetSocketID != undefined) {
      socket.to(targetSocketID).emit("chat", data);
      console.log("전송완료");
    } else {
      socket.emit("chat", "해당유저는 온라인이 아닙니다");
    }
  });

  //   클라이언트 종료
  socket.on("disconnect", () => {
    onlineUser = onlineUser.filter((user) => socket.id != user.socketID);
    console.log(onlineUser);
  });
}

// 유저네임을 주면, 온라인 상태인지 확인해주는 함수 (온라인 : 유저의 소켓아이디 , 오프라인 : null)
function findSocketIdByuserID(userID) {
  let targetSocketID = undefined;
  onlineUser.forEach((user) => {
    if (user.userID == userID) {
      targetSocketID = user.socketID;
    }
  });
  return targetSocketID;
}

module.exports = socketController;
