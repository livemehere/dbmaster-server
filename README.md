# 기본구조

## /api

- url 서두에 `/api`를 붙이면 jwt token 을 검사한다
- 해독 에러가 발생하면, 에러만 반환하고, 그렇지않다면, 다음미들우웨어로 넘어가도록 되어있다

## 개발자 테스트

- `/api/sampledata?token=<발급반은토큰>` 로 테스터 해볼 수 있다
- `/dev_jwt`로 1년짜리 유효한토큰을 무한대로 발급 가능하다

## Database

- DB는 박세진교수님 네이버 클라우드 서버에 현빈이 계정으로 연결되어있음
- ORM 없이 순수 sql문으로 작성하면됨

# Socket 구조

```js
// 연결되는 소켓 이벤트에 반드시, socket.emit("initUser", 자신의로그인ID); 를 해야함(그래야 온라인 상태로 등록이됨)
socket.on("connect", () => {
  socket.emit("initUser", userID); // 나의 아이디를 전송
});

// 채팅 수신대기
socket.on("chat", (data) => {
  // 받은 메세지가 내가 활성화해놓은 채팅창에서 온것이라면 바로 화면에 표시
  if (data.sendUserID == $("#selected-room").val()) {
    displayMsgBox(data);
  } else {
    // TODO: 여기에는 selected 는 아니지만 채팅방 목록에 존재한다면 받은 메세지 갯수를 카운팅해주세요
  }
});

// 보내기 버튼 눌렀을때 or 엔터키
$("#send").click(() => {
  const payload = $("#chat-input").val();
  if (payload == "") return; // 빈칸이면 안됨, 빈칸이면 함수종료
  displayMyMsgBox(payload, moment().format("LT")); //내화면에 내가보낸 메세지를 표시
  sendMessage(); // 서버로 메세지 전송
});
```

## socket 현제상태

- 접속시 환영 msg와 자신의 고유 socketID 를 받는다
- 종료시 자신을 제외한 다른 유저들에게 접속종료를 알린다
- msg를 보내면, 다른 모든 클라이언트들에게 전송

# 파일업로드

- multer 라이브러리 사용해서 파일업로드구현
- 그냥 간단히 서버에 static 폴더에 저장하고, 가져다쓰는걸로하는게 좋을듯(시간나면 그냥 storage 서비스 찾아보기)
