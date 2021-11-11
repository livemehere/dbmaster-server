const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// 커스텀 모듈 만든거 임포트
const authorization = require("./routes/authorization");
const createJwt = require("./routes/createJwt");
const socketController = require("./controller/socketController");

// Router Import
const indexRouter = require("./routes/indexRouter");
const sampledataRouter = require("./routes/sampledataRouter");
const chatRouter = require("./routes/chatRouter");
const socketRouter = require("./routes/socketRouter");
const loginRouter = require("./routes/loginRouter");

const app = express();
const server = require("http").createServer(app); // 추가
const io = require("socket.io")(server, { cors: { origin: "*" } }); // 추가

// 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", "./views");

// 각종 미들웨어 설정
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/api", authorization); //내가 커스텀한 API 를 설정하고싶을때는, express.Router()를 사용하는 것이 아니라, 그냥 함수만 지정해야됨

// REST API 목록
app.use("/", indexRouter);
app.get("/sampledata", sampledataRouter);
app.get("/dev_jwt", createJwt);
app.get("/chat", chatRouter);
app.post("/login", loginRouter);

io.on("connection", (socket) => {
  socketController(io, socket);
});

module.exports = { app, server };
