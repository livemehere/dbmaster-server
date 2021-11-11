console.log("chat.js");

let socket = io();

const sendBtn = document.querySelector("#send");

socket.on("connect", () => {
  console.log(socket.id); // "G5p5..."
});

sendBtn.addEventListener("click", function () {
  const msg = document.querySelector("#msg");
  const msgText = msg.value;

  console.log(msgText);
  socket.emit("message", { msg: msgText });
});

socket.on("notice", (data) => {
  console.log(data);
});
