// user ID 가져오기
const userID = $("#userid").val();
console.log(`로그인한유저ID : ${userID}`);

getFriendList();
getChatRoomList();

// socket 접속
const socket = io();

// 연결되면 수행할 동작
socket.on("connect", () => {
  console.log(`할당받은소켓ID : ${socket.id}`);
  socket.emit("initUser", userID); // 나의 아이디를 전송
});

// 채팅 수신대기
socket.on("chat", (data) => {
  console.log(data);
  if (data.sendUserID == $("#selected-room").val()) {
    displayMsgBox(data);
  } else {
    // TODO: 여기에는 selected 는 아니지만 채팅방 목록에 존재한다면 받은 메세지 갯수를 카운팅해주세요
  }
});

$("#check-my-id").click(() => {
  console.log(socket.id);
});

// 보내기 버튼 누르거나
$("#send").click(() => {
  const payload = $("#chat-input").val();
  displayMyMsgBox(payload, moment().format("LT"));
  sendMessage();
});

// 엔터키 누르면 채팅내용 전송
$("#chat-input").on("keyup", function (key) {
  if (key.keyCode == 13) {
    const payload = $("#chat-input").val();
    displayMyMsgBox(payload, moment().format("LT"));
    sendMessage();
  }
});

// 함수 선언부

function sendMessage() {
  const targetUserID = $("#targetUserID").val();
  const payload = $("#chat-input").val();

  socket.emit("chat", {
    payload,
    targetUserID,
    sendUserID: userID,
    timestamp: Date.now(),
  });

  $("#chat-input").val("");
  $("#chat-input").focus();
}

function getFriendList() {
  // TODO: 친구목록 DB에서 불러오기
  const friendList = [];
  friendList.push({
    userID: "rhdxoals",
    userName: "공태민",
    statusMsg: "안녕",
  });
  friendList.push({
    userID: "admin",
    userName: "어드민",
    statusMsg: "아놔 디비",
  });
  friendList.push({
    userID: "lee",
    userName: "이승현",
    statusMsg: "JSON 좋네",
  });

  // 친구 한명 한명 Display
  friendList.forEach((friend) => {
    const template = `
    <div class="friend-card">
    <div class="friend-photo flex-grow-2"></div>
    <div class="friend-description flex-grow-1">
        <div class="friend-name">${friend.userName}</div>
        <div class="friend-status-msg">${friend.statusMsg}</div>
    </div>
    <img src="/img/Logo.svg" alt="" class="flex-grow-2 me-2" id="start-chat-btn" data-userid="${friend.userID}" data-roomname="${friend.userName}">
    <img src="/img/removeIcon.svg" alt="" class="flex-grow-2" id="remove-friend-btn">
    </div>
    `;

    $(".friends-list").append(template);
  });

  // 총 친구 수 Display
  $(".friends-count").html(`친구 ${friendList.length}명`);
}

function getChatRoomList() {
  $(".chat-list").html("");
  // TODO: 채팅목록 DB에서 불러오기
  const chatRoomList = [];

  chatRoomList.push({
    roomNumber: 1,
    userID: "ji",
    roomName: "지인혁",
    lastMsg: "자?",
  });
  chatRoomList.push({
    roomNumber: 2,
    userID: "admin",
    roomName: "어드민",
    lastMsg: "왜답장안해?",
  });
  chatRoomList.push({
    roomNumber: 3,
    userID: "lee",
    roomName: "이승현",
    lastMsg: "ㅇㅋ",
  });
  chatRoomList.push({
    roomNumber: 4,
    userID: "jo",
    roomName: "조현빈",
    lastMsg: "잔다",
  });

  // 생성되있는 채팅방 목록 Display
  chatRoomList.forEach((room) => {
    const template = `
    <div class="chat-card" >
      <div class="chat-photo flex-grow-2"></div>
        <div class="chat-description flex-grow-1">
            <div class="chat-name" data-userid="${room.userID}" data-roomname="${room.roomName}">${room.roomName}</div>
            <div class="chat-status-msg">${room.lastMsg}</div>
        </div>
        <div class="last-msg-time">10:23 AM</div>
    </div>
    `;
    $(".chat-list").append(template);
  });
}

// 채팅방목록에서 선택한 것을 selected-room , targetUserID 값으로 세팅함
$(".chat-list").click((e) => {
  const targetID = e.target.dataset.userid;
  const roomName = e.target.dataset.roomname;
  if (e.target.classList[0] == "chat-name") {
    console.log(targetID);
    $("#selected-room").val(targetID);
    $("#targetUserID").val(targetID);
    $("#selected-room-name").val(roomName);
    chatMsgBoxInit();
  }
});

// 친구목록 선택한 것을 selected-room, targetUserID 값으로 세팅함
$(".friends-list").click((e) => {
  const targetID = e.target.dataset.userid;
  const roomName = e.target.dataset.roomname;
  // 채팅아이콘을 눌렀을경우
  if (e.target.id == "start-chat-btn") {
    $("#selected-room").val(targetID);
    $("#targetUserID").val(targetID);
    $("#selected-room-name").val(roomName);

    console.log(targetID);
    chatMsgBoxInit();
  }
  //TODO: 삭제버튼 누를경우도 만들기
});

function chatMsgBoxInit() {
  $(".chat-msg-box").html("");
  $(".chat-room-title").html($("#selected-room-name").val());
}

function displayMsgBox({ payload, timestamp }) {
  const template = `
  <div class="chat-msg other">${payload}</div>
  <div class="clear"></div>
  <div class="chat-time chat-time-other">${moment(timestamp).format("LT")}</div>
  <div class="clear"></div>
  `;
  $(".chat-msg-box").append(template);
}
function displayMyMsgBox(payload, timestamp) {
  const template = `
  <div class="chat-msg mine">${payload}</div>
  <div class="clear"></div>
  <div class="chat-time chat-time-mine">${timestamp}</div>
  <div class="clear"></div>
  `;
  $(".chat-msg-box").append(template);
}

console.log();
