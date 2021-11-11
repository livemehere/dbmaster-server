let socket = io(); //server 주소를 넣어주세요

const sendBtn = document.querySelector("#send");

// 연결되면 수행할 동작
socket.on("connect", () => {
  console.log(socket.id); // "G5p5..."
});

// message 보내기
sendBtn.addEventListener("click", function () {
  const msg = document.querySelector("#msg");
  const msgText = msg.value;
  socket.emit("message", { msg: msgText });
});

// 다른 클라이언트 message 받기
socket.on("msgInbox", (data) => {
  console.log(data);
});

// 공지 받기
socket.on("notice", (data) => {
  console.log(data);
});
