const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// 파일 업로드 부분
const multer = require("multer");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, fileName);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/gif"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Allowed only .png, .jpg, .jpeg and .gif"));
    }
  },
});

// 커스텀 모듈 만든거 임포트
const authorization = require("./routes/authorization");
const createJwt = require("./routes/createJwt");
const socketController = require("./controller/socketController");

// Router Import
const indexRouter = require("./routes/indexRouter");
const sampledataRouter = require("./routes/sampledataRouter");
const chatRouter = require("./routes/chatRouter");
const loginRouter = require("./routes/loginRouter");
const uploadImgRouter = require("./routes/uploadImgRouter");
const testSiteRouter = require("./routes/testSiteRouter");

const app = express();
const http = require('http');
const server = http.createServer(app);
var io = require('socket.io')(server);

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

// html route
app.use("/", indexRouter);
app.get("/chat", chatRouter);
app.get("/testsite", testSiteRouter);
app.get("/daum", (req, res) => {
  res.render("daum");
});

// API service
app.get("/sampledata", sampledataRouter);
app.get("/dev_jwt", createJwt);
app.post("/login", loginRouter);
app.post("/uploadImg", upload.single("provfile_img"), uploadImgRouter);

io.on("connection", (socket) => {
  socketController(io, socket);
});

server.listen(3000,()=>{
  console.log("server is running on port 3000");
})