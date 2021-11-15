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
socekt.on("connect", 콜백함수); // 소켓서버에 연결되면 콜백함수 실행
socket.emit("message", { msg: 원하는데이터 }); // msg에 원하는 데이터를 담아서 서버로 전송
socket.on("msgInbox", data); // 다른 클라이언트가 보낸 msg 수신대기
socket.on("notice", data); // notice 채널을 수신대기
```

## socket 현제상태

- 접속시 환영 msg와 자신의 고유 socketID 를 받는다
- 종료시 자신을 제외한 다른 유저들에게 접속종료를 알린다
- msg를 보내면, 다른 모든 클라이언트들에게 전송

# 파일업로드

- multer 라이브러리 사용해서 파일업로드구현
- 그냥 간단히 서버에 static 폴더에 저장하고, 가져다쓰는걸로하는게 좋을듯(시간나면 그냥 storage 서비스 찾아보기)
