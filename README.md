# 완변한 채팅 웹앱

## 소개

> 회원가입 한 유저들 간에 실시간 1:1 채팅을 할 수 있고, 프로필사진, 대화기록, 친구목록 등 모든것이 영구적으로 저장된다

## Stack

- node js
- winform
- naver cloude server
- mysql

## 외부라이브러리

- socket.io
- multer
- ejs
- mysql

# API 목록

> 인자라고 함은 GET은 query, POST는 body를 뜻한다

| method               | addrees            | 인자                                                                                       | 설명                                                                                             |
| -------------------- | ------------------ | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ |
| GET                  | /mypage/:id        | -                                                                                          | params에 담긴 유저ID로 채팅패이지 라우팅                                                         |
| GET                  | /signup            | -                                                                                          | 회원가입 페이지 라우팅                                                                           |
| GET                  | **/edit/:userID**  | -                                                                                          | params에 담긴 유저ID로 프로필 수정 페이지 라우팅                                                 |
| GET                  | **/userInfo/:id**  | -                                                                                          | params에 담긴 유저ID의 정보를 모두가져온다(아이디 중복확인에서도 사용됨) (아래기능과 동일)       |
| GET                  | checkUserID        | userID                                                                                     | 해당 유저의 정보를 모두 가져온다                                                                 |
| GET                  | /msgLog            | targetUserID, sendUserID                                                                   | 두 사용자 간의 모든 채팅기록을 가져온다                                                          |
| GET                  | /loadAllMsgData    | userID                                                                                     | 한 사용자의 모든 채팅 기록을 가져온다                                                            |
| GET                  | /getUserNameByID   | userID                                                                                     | 사용자의 ID와 일치하는 이름을 가져온다                                                           |
| GET                  | /getLastMsg        | targetUserID ,sendUserID                                                                   | 두 사용자 간에 가장 마지막 채팅 기록을 1개 가져온다                                              |
| GET                  | /getAllUser        | -                                                                                          | 모든 사용자 정보를 가져온다                                                                      |
| GET                  | /myFriend          | userID                                                                                     | 해당 사용자가 친구 추가한 목록을 가져온다(친구추가는 쌍방이아닌, 단방향이다)                     |
| GET                  | /markAsRead        | targetUserID ,sendUserID                                                                   | 두 사용자 간의 모든 대화내용을 읽음으로 처리한다                                                 |
| POST                 | /login             | id,pw                                                                                      | 로그인처리                                                                                       |
| POST(form-data 형식) | /uploadImg/:userID | name이 'image'인 이미지파일                                                                | params에담긴 userID.jpg 로 받은 이미지파일을 서버에 저장한다                                     |
| POST                 | /saveMsg           | payload,targetUserID ,sendUserID, timestamp ,isRead                                        | 보낸 매세지를 DB에 저장한다                                                                      |
| POST                 | /addFriend         | targetUserID ,sendUserID                                                                   | sendUser의 친구목록에 tartgetUser를 추가                                                         |
| POST                 | /delFriend         | targetUserID ,sendUserID                                                                   | sendUser의 친구목록에서 targetUser를 제거                                                        |
| POST                 | /signUp            | userid,userpw,username,usernickname,postcode,address,detailAddress,extraAddress,profileURL | 입력된 정보로 신규 유저 추가                                                                     |
| POST                 | /resetPw           | userid,userpw                                                                              | 해당 유저의 비밀번호를 재설정함(단방향 해쉬암호화가 적용되어있어 찾기는 불가)                    |
| POST                 | /editProfile       | userid,username,usernickname,postcode,address,detailAddress,extraAddress,statusMsg         | userid에 해당하는 사용자의 정보를 덮어쓰기(업데이트, 변경사항이없다면, 기존의 정보를 입력해야됨) |

# socket.io

## server-side

### 온라인 온라인 처리

> 온라인 목록에 추가

```js
let onlineUser = [];

socket.on("initUser", (userID) => {
  onlineUser.push({
    userID: userID,
    socketID: socket.id,
  });
});
```

### 사용자 오프라인 처리

> 온라인 목록에서 제거

```js
socket.on("disconnect", () => {
  onlineUser = onlineUser.filter((user) => socket.id != user.socketID);
});
```

### 채팅 전달

> 온라인 목록에서 제거

```js
socket.on("chat", (data) => {
  // 윈폼에서 받는경우 스트링으로 오기때문에, JSON으로 전환
  if (typeof data == "string") {
    data = JSON.parse(data);
  }
  // 온라인 유저 목록에서 메세지를 전달받을 사람이 있는지 찾고, 있다면 바로전달, 없다면 전달하지않음
  const targetSocketID = findSocketIdByuserID(data.targetUserID);

  if (targetSocketID != undefined) {
    socket.to(targetSocketID).emit("chat", data);
  } else {
    socket.emit("chat", "해당유저는 온라인이 아닙니다");
  }
});
```

## client-side

```js
const socket = io(); //소켓 접속
```

### 소켓연결

```js
// 연결되면 수행할 동작
socket.on("connect", () => {
  socket.emit("initUser", userID); // 나의 아이디를 전송
});
```

### 채팅 수신 대기

```js
socket.on("chat", async (data) => {
  // 실시간으로 전달받은 메세지의 발신자의 채팅방을 내가 열어놓고 있을 경우, 바로 display
  if (data.sendUserID == $("#selected-room").val()) {
    displayMsgBox({
      payload: data.payload,
      timestamp: moment(data.timestamp).format("LT"),
    });
    // 모든 채팅을 읽음으로 처리(DB)
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
    // 만약 발신자의 채팅방을 열어놓지 않았고, 채팅방이 생성되어있지 않으면
    if (data != "해당유저는 온라인이 아닙니다") {
      let chatRoomWillMade = true;
      for (let i = 0; i < $(".chat-name").length; i++) {
        if ($(".chat-name")[i].dataset.userid == data.sendUserID) {
          chatRoomWillMade = false;
        }
      }
      // 채팅방이 없으면 생성, 있다면 생성하지 않고 다음단계로 바로넘어감
      if (chatRoomWillMade) {
        let userName;
        // DB에서 발신자userID에 해당하는 사용자 이름을 가져옴
        await fetch(`/getUserNameByID?userID=${data.sendUserID}`)
          .then((data) => data.json())
          .then((data) => {
            userName = data.name;
          })
          .catch((err) => console.log(err));
        //그리고 채팅방을 추가한다
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

    // 생성된 채팅방에서 빨간 숫자,마지막채팅,마지막채팅시간을 추가한다(이동작은 메세지가 하나올때마다 실행되며, 중첩될수록 변하는것은 빨간색의 숫자 카운팅이다)
    $(`#${data.sendUserID}-bubble`).show();
    let mesCount = parseInt($(`#${data.sendUserID}-bubble`).html());
    $(`#${data.sendUserID}-bubble`).html(++mesCount);
    $(`#${data.sendUserID}-last-msg`).html(data.payload);
    $(`#${data.sendUserID}-last-time`).html(
      moment(data.timestamp).format("LT")
    );
  }
});
```

### 채팅보내기

> 채팅은 실시간 socket으로 전송하고나서, DB로도 저장을해주는 두가지 동작을 해야한다

```js
function sendMessage() {
  const targetUserID = $("#targetUserID").val();
  const payload = $("#chat-input").val();

  // 메세지 포맷
  const data = {
    payload: payload,
    targetUserID: targetUserID,
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
```
