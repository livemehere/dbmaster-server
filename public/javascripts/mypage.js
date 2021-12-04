// user ID 가져오기
const userID = $("#userid").val();
console.log(`로그인한유저ID : ${userID}`);
let currentFriendList = [];

getFriendList();
loadAllMsgData(); //채팅창만들고 버블만들고

// socket 접속
const socket = io();

fetch(`/userInfo/${userID}`)
  .then((data) => data.json())
  .then((user) => {
    $(".my-photo").css("background-image", `url('/${user.data.profileURL}')`);
    console.log();
  });

// 연결되면 수행할 동작
socket.on("connect", () => {
  console.log(`할당받은소켓ID : ${socket.id}`);
  socket.emit("initUser", userID); // 나의 아이디를 전송
});

// 채팅 수신대기
socket.on("chat", async (data) => {
  // console.log(data);
  if (data.sendUserID == $("#selected-room").val()) {
    displayMsgBox({
      payload: data.payload,
      timestamp: moment(data.timestamp).format("LT"),
    });

    fetch(
      `/markAsRead?sendUserID=${userID}&targetUserID=${$(
        "#selected-room"
      ).val()}`
    )
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
      });
  } else {
    if (data != "해당유저는 온라인이 아닙니다") {
      let chatRoomWillMade = true;
      for (let i = 0; i < $(".chat-name").length; i++) {
        if ($(".chat-name")[i].dataset.userid == data.sendUserID) {
          chatRoomWillMade = false;
        }
      }
      if (chatRoomWillMade) {
        let userName;
        await fetch(`/getUserNameByID?userID=${data.sendUserID}`)
          .then((data) => data.json())
          .then((data) => {
            userName = data.name;
          })
          .catch((err) => console.log(err));
        const template = `
        <div class="chat-card" >
          <div class="chat-photo flex-grow-2" style="background-image: url('/${data.sendUserID}.jpg')"></div>
            <div class="chat-description flex-grow-1">
                <div class="chat-name" data-userid="${data.sendUserID}" data-roomname="${userName}">${userName}</div>
                <div class="chat-status-msg" id="${data.sendUserID}-last-msg"></div>
            </div>
            <div class="last-msg-time" id="${data.sendUserID}-last-time"></div>
            <div class="mt-2 me-2 bubble" id="${data.sendUserID}-bubble">0</div>
        </div>
        `;
        $(".chat-list").append(template);
      }
    }

    // TODO: 여기에는 selected 는 아니지만 채팅방 목록에 존재한다면 받은 메세지 갯수를 카운팅해주세요
    $(`#${data.sendUserID}-bubble`).show();
    let mesCount = parseInt($(`#${data.sendUserID}-bubble`).html());
    $(`#${data.sendUserID}-bubble`).html(++mesCount);
    $(`#${data.sendUserID}-last-msg`).html(data.payload);
    $(`#${data.sendUserID}-last-time`).html(
      moment(data.timestamp).format("LT")
    );
  }
});

// 보내기 버튼 누르거나
$("#send").click(() => {
  const payload = $("#chat-input").val();
  if (payload == "") return;
  displayMyMsgBox(payload, moment().format("LT"));
  sendMessage();
  // TODO: 여기에는 selected 는 아니지만 채팅방 목록에 존재한다면 받은 메세지 갯수를 카운팅해주세요

  $(`#${$("#selected-room").val()}-last-msg`).html(payload);
  $(`#${$("#selected-room").val()}-last-time`).html(moment().format("LT"));
});

// 엔터키 누르면 채팅내용 전송
$("#chat-input").on("keyup", function (key) {
  if (key.keyCode == 13) {
    const payload = $("#chat-input").val();
    if (payload == "") return;
    displayMyMsgBox(payload, moment().format("LT"));
    sendMessage();

    $(`#${$("#selected-room").val()}-last-msg`).html(payload);
    $(`#${$("#selected-room").val()}-last-time`).html(moment().format("LT"));
  }
});

// 함수 선언부

function sendMessage() {
  const targetUserID = $("#targetUserID").val();
  const payload = $("#chat-input").val();
  // 메세지 포맷
  const data = {
    payload,
    targetUserID,
    sendUserID: userID,
    timestamp: Date.now(),
    isRead: 1,
  };

  //소켓으로 메시지전송
  socket.emit("chat", data);

  // DB에 메시지 저장
  fetch("/saveMsg", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
    })
    .catch((error) => {
      console.error(error);
    });

  $("#chat-input").val("");
  $("#chat-input").focus();
}

async function getFriendList() {
  // TODO: 친구목록 DB에서 불러오기
  $(".friends-list").html("");
  let friendList = [];
  await fetch(`/myFriend?userID=${userID}`)
    .then((data) => data.json())
    .then((friends) => {
      // console.log(friends);
      currentFriendList = friends;
      friendList = friends;
    });

  // friendList.push({
  //   userID: "admin",
  //   userName: "공태민",
  //   statusMsg: "안녕",
  // });

  // 친구 한명 한명 Display
  friendList.forEach((friend) => {
    const template = `
    <div class="friend-card">
    <div class="friend-photo flex-grow-2" style="background-image: url('/${friend.id}.jpg')"></div>
    <div class="friend-description flex-grow-1">
        <div class="friend-name">${friend.name}</div>
        <div class="friend-status-msg">${friend.statusMsg}</div>
    </div>
    <img src="/img/Logo.svg" alt="" class="flex-grow-2 me-2" id="start-chat-btn" data-userid="${friend.id}" data-roomname="${friend.name}">
    <img src="/img/removeIcon.svg" alt="" class="flex-grow-2" data-userid="${friend.id}" id="remove-friend-btn">
    </div>
    `;

    $(".friends-list").append(template);
  });

  // 총 친구 수 Display
  $(".friends-count").html(`친구 ${friendList.length}명`);
}

function getChatRoomList(chatRoomList) {
  $(".chat-list").html("");
  // TODO: 채팅목록 DB에서 불러오기
  // const chatRoomList = [];

  // chatRoomList.push({
  //   userID: "ji",
  //   roomName: "지인혁",
  //   lastMsg: "자?",
  // });
  // chatRoomList.push({
  //   userID: "admin",
  //   roomName: "어드민",
  //   lastMsg: "왜답장안해?",
  // });
  // chatRoomList.push({
  //   userID: "lee",
  //   roomName: "이승현",
  //   lastMsg: "ㅇㅋ",
  // });
  // chatRoomList.push({
  //   userID: "jo",
  //   roomName: "조현빈",
  //   lastMsg: "잔다",
  // });

  // 생성되있는 채팅방 목록 Display
  chatRoomList.forEach((room) => {
    const template = `
    <div class="chat-card" >
      <div class="chat-photo flex-grow-2" style="background-image: url('/${
        room.userID
      }.jpg')"></div>
        <div class="chat-description flex-grow-1">
            <div class="chat-name" data-userid="${
              room.userID
            }" data-roomname="${room.roomName}">${room.roomName}</div>
            <div class="chat-status-msg" id="${room.userID}-last-msg">${
      room.lastMsg
    }</div>
        </div>
        <div class="last-msg-time" id="${room.userID}-last-time">${moment(
      room.lsatMsgTime
    ).format("LT")}</div>
        <div class="mt-2 me-2 bubble" id="${room.userID}-bubble">0</div>
    </div>
    `;
    $(".chat-list").append(template);
  });
  bubbleAgain();
}

// TODO: 채팅을 읽었을떄!
// 채팅방목록에서 선택한 것을 selected-room , targetUserID 값으로 세팅함
$(".chat-list").click((e) => {
  const targetID = e.target.dataset.userid;
  const roomName = e.target.dataset.roomname;
  if (e.target.classList[0] == "chat-name") {
    $("#selected-room").val(targetID);
    $("#targetUserID").val(targetID);
    $("#selected-room-name").val(roomName);
    chatMsgBoxInit();
    // 채팅 버블이 쌓인것을 초기화
    $(`#${targetID}-bubble`).html("0");
    $(`#${targetID}-bubble`).hide();
    // DB에서 해당유저와 대화내용을 가져와서 display 하기
    fetch(`/msgLog?targetUserID=${userID}&sendUserID=${targetID}`)
      .then((data) => data.json())
      .then((data) => {
        data.forEach((msg) => {
          //타임스탬프를 정수로바꾸고 moment로 변경후 display
          const covertedTimestamp = moment(parseInt(msg.timestamp)).format(
            "LT"
          );

          //TODO: 내메시지랑, 상대메시지랑 인자받는방식이, 객채랑 , 일반으로 달라서 다르게 적용해줘야함
          if (userID == msg.sendUserID) {
            displayMyMsgBox(msg.payload, covertedTimestamp);
          } else {
            const msgFormat = {
              payload: msg.payload,
              timestamp: covertedTimestamp,
            };
            displayMsgBox(msgFormat);
          }
        });
      })
      .catch((err) => console.log(err));
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

    chatMsgBoxInit();
    //TODO: 여기서 채팅방을 생성해주세요
    let chatRoomWillMade = true;
    for (let i = 0; i < $(".chat-name").length; i++) {
      if ($(".chat-name")[i].dataset.userid == targetID) {
        chatRoomWillMade = false;
      }
    }
    if (chatRoomWillMade) {
      const template = `
      <div class="chat-card" >
        <div class="chat-photo flex-grow-2" style="background-image: url('/${targetID}.jpg')"></div>
          <div class="chat-description flex-grow-1">
              <div class="chat-name" data-userid="${targetID}" data-roomname="${roomName}">${roomName}</div>
              <div class="chat-status-msg" id="${targetID}-last-msg"></div>
          </div>
          <div class="last-msg-time" id="${targetID}-last-time"></div>
          <div class="mt-2 me-2 bubble" id="${targetID}-bubble">0</div>
      </div>
      `;
      $(".chat-list").append(template);
    }

    // 채팅 버블이 쌓인것을 초기화
    $(`#${targetID}-bubble`).html("0");
    $(`#${targetID}-bubble`).hide();
    // DB에서 해당유저와 대화내용을 가져와서 display 하기
    fetch(`/msgLog?targetUserID=${userID}&sendUserID=${targetID}`)
      .then((data) => data.json())
      .then((data) => {
        data.forEach((msg) => {
          //타임스탬프를 정수로바꾸고 moment로 변경후 display
          const covertedTimestamp = moment(parseInt(msg.timestamp)).format(
            "LT"
          );
          //TODO: 내메시지랑, 상대메시지랑 인자받는방식이, 객채랑 , 일반으로 달라서 다르게 적용해줘야함
          if (userID == msg.sendUserID) {
            displayMyMsgBox(msg.payload, covertedTimestamp);
          } else {
            const msgFormat = {
              payload: msg.payload,
              timestamp: covertedTimestamp,
            };
            displayMsgBox(msgFormat);
          }
        });
      })
      .catch((err) => console.log(err));
  } else if (e.target.id == "remove-friend-btn") {
    // TODO: 친구 삭제 버튼을 눌렀을 때
    fetch(
      `/delFriend?sendUserID=${userID}&targetUserID=${e.target.dataset.userid}`,
      {
        method: "POST",
      }
    )
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
        getFriendList();
      });
    // console.log(e.target.dataset.userid);
  }

  //TODO: 삭제버튼 누를경우도 만들기
});

function chatMsgBoxInit() {
  $(".chat-msg-box").html("");
  $(".chat-room-title").html($("#selected-room-name").val());
}

// 말풍선
function displayMsgBox({ payload, timestamp }) {
  const template = `
  <div class="chat-msg other">${payload}</div>
  <div class="clear"></div>
  <div class="chat-time chat-time-other">${timestamp}</div>
  <div class="clear"></div>
  `;
  $(".chat-msg-box").append(template);

  $(".chat-msg-box").scrollTop($(".chat-msg-box").prop("scrollHeight")); //TODO: scroll
}
function displayMyMsgBox(payload, timestamp) {
  const template = `
  <div class="chat-msg mine">${payload}</div>
  <div class="clear"></div>
  <div class="chat-time chat-time-mine">${timestamp}</div>
  <div class="clear"></div>
  `;
  $(".chat-msg-box").append(template);

  $(".chat-msg-box").scrollTop($(".chat-msg-box").prop("scrollHeight")); //TODO: scroll
}

function loadAllMsgData() {
  fetch(`/loadAllMsgData?userID=${userID}`)
    .then((data) => data.json())
    .then((data) => {
      // console.log(data);
      initBubble(data);
    })
    .catch((err) => console.log(err));
}

function initBubble(allMsg) {
  let roomList = [];
  allMsg.forEach((msg) => {
    roomList.push(msg.sendUserID);
    roomList.push(msg.targetUserID);
    // TODO: 여기서멈춰

    if (msg.sendUserID != userID && msg.isRead >= 1) {
      let mesCount = parseInt($(`#${msg.sendUserID}-bubble`).html());
      $(`#${msg.sendUserID}-bubble`).show();
      $(`#${msg.sendUserID}-bubble`).html(++mesCount);
    }
  });
  // 중복을 제거하고 메세지가 하나라도 있다면, 방을 만들기
  roomList = new Set(roomList);
  roomList = [...roomList];
  roomList = roomList.filter((id) => id != userID);

  let formatedRoomList = [];
  let roomListLength = 0;
  for (const roomUserID of roomList) {
    let chatRoomFormat = {};
    // userID 를 하나하나 DB로 전송해서 유저네임을 받아온다
    fetch(`/getUserNameByID?userID=${roomUserID}`)
      .then((data) => data.json())
      .then((data) => {
        chatRoomFormat["userID"] = roomUserID;
        chatRoomFormat["roomName"] = data.name;
        // 내 ID 랑 대상 ID랑 대화중 가장 최근의 대화 하나 만가져온다
        fetch(`/getLastMsg?targetUserID=${userID}&sendUserID=${roomUserID}`)
          .then((data) => data.json())
          .then((data) => {
            chatRoomFormat["lastMsg"] = data.payload;
            chatRoomFormat["lastMsgTime"] = data.timestamp;
            formatedRoomList.push(chatRoomFormat);
            roomListLength += 1;
            if (roomListLength == roomList.length) {
              getChatRoomList(formatedRoomList);
            }
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }

  // getChatRoomList(roomListFormat);
}

// {
//   userID: "jo",
//   roomName: "조현빈",
//   lastMsg: "잔다",
// }

function bubbleAgain() {
  fetch(`/loadAllMsgData?userID=${userID}`)
    .then((data) => data.json())
    .then((allMsg) => {
      // console.log(data);
      let roomList = [];
      allMsg.forEach((msg) => {
        roomList.push(msg.sendUserID);
        roomList.push(msg.targetUserID);
        // TODO: 여기서멈춰
        if (msg.sendUserID != userID && msg.isRead >= 1) {
          let mesCount = parseInt($(`#${msg.sendUserID}-bubble`).html());
          $(`#${msg.sendUserID}-bubble`).show();
          $(`#${msg.sendUserID}-bubble`).html(++mesCount);
        }
        $(`#${msg.sendUserID}-last-time`).html(
          moment(parseInt(msg.timestamp)).format("LT")
        );
      });
    })
    .catch((err) => console.log(err));
}

// 친구 찾기 모달 열기
$("#find-btn").click(() => {
  $(".list-group").html("");
  loadUserListAndDisplay();
  $(".search-modal").show();
});

// 유저 검색 버튼
$("#friend-search-btn").click((e) => {
  e.preventDefault();
  // 유저목록 전체가져오기 GET요청

  // 검색창으로 필터링
});

$(".list-group").click((e) => {
  // 친구추가 버튼을 누른다면
  if (e.target.dataset.userid != undefined) {
    //버튼누르먼 POST 요청(친구맺기)
    fetch(
      `/addFriend?sendUserID=${userID}&targetUserID=${e.target.dataset.userid}`,
      {
        method: "POST",
      }
    )
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
        getFriendList();
        currentFriendList.push({ id: e.target.dataset.userid });
      });
  }
});

//친구 추가 버튼
$("#add-btn").click((e) => {
  console.log("e");

  //누르면 친구요청버튼 사라지기
  //이미 친구입니다 텍스트 띄워주기
  // GET 나의 친구리스트 다가져와서 화면에 보여주는 함수 만들기
});

//모달창 닫기 버튼
$("#modal-close-btn").click((e) => {
  $(".search-modal").hide();
});

function createUserLi(user) {
  let userNameStatus = user.name;
  for (let friend of currentFriendList) {
    if (friend.id == user.id) {
      userNameStatus = `${userNameStatus}(이미친구입니다)`;
    }
  }
  let li = `
  <li class="list-group-item">${userNameStatus} <span class="gray newFriendID">(${user.id})</span> <img src="/img/addBtn.svg" alt="" id="add-btn" data-userID="${user.id}"></li>
  `;

  $(".list-group").append(li);
}
let userList = [];
function loadUserListAndDisplay() {
  fetch("/getAllUser")
    .then((data) => data.json())
    .then((users) => {
      userList = users;
      for (let user of users) {
        // li로 다 보여주기
        if (user.id != userID) {
          createUserLi(user);
        }
      }
    });
}
// 친구 검색 필터링 함수
let filterdUserList = [];
$("#search-input").on("input", (e) => {
  // console.log($("#search-input").val());
  filterdUserList = userList.filter((user) =>
    user.name.includes($("#search-input").val())
  );
  $(".list-group").html("");
  for (let user of filterdUserList) {
    createUserLi(user);
  }
});

$(".my-photo").click(function () {
  window.location.href = `/edit/${userID}`;
});
