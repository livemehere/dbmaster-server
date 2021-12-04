const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("fileDestination");
    cb(null, "upload/"); // 파일 업로드 경로
  },
  filename: function (req, file, cb) {
    // 파일명에서 확장자만 추출하기
    console.log("fileName");

    const userID = req.params.userID;
    const idx = file.originalname.indexOf(".");
    const format = file.originalname.substring(idx);
    //TODO: userID + format 이거를 URL로 저장하면될듯
    cb(null, userID + ".jpg"); //사용자이름 + 파일포맷으로 설정
  },
});

const upload = multer({
  storage: storage,
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
const userInfoRouter = require("./routes/userInfoRouter");
const mypageRouter = require("./routes/mypageRouter");
const uploadRouter = require("./routes/uploadRouter");
const saveMsgRouter = require("./routes/saveMsgRouter");
const msgLogRouter = require("./routes/msgLogRouter");
const loadAllMsgDataRouter = require("./routes/loadAllMsgDataRouter");
const getUserNameByIDRouter = require("./routes/getUserNameByID");
const getLastMsgRouter = require("./routes/getLastMsg");
const getAllUserRouter = require("./routes/getAllUser");
const addFriendRouter = require("./routes/addFriend");
const myFriendRouter = require("./routes/myFriend");
const markAsReadRouter = require("./routes/markAsRead");
const delFriendRouter = require("./routes/delFriend");
const checkUserIDRouter = require("./routes/checkUserID");
const signUpRouter = require("./routes/signUp");
const editProfileRouter = require("./routes/editProfile");
const resetPwRouter = require("./routes/resetPw");

const app = express();
const http = require("http");
const { SocketAddress } = require("net");
const server = http.createServer(app);
var io = require("socket.io")(server);

// 템플릿 엔진 설정
app.set("view engine", "ejs");
app.set("views", "./views");

// 각종 미들웨어 설정
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "upload")));
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
app.get("/userInfo/:id", userInfoRouter);
app.get("/mypage/:id", mypageRouter);
app.get("/signup", (req, res) => res.render("signup"));
app.get("/edit/:userID", (req, res) =>
  res.render("edit", { userID: req.params.userID })
);
app.get("/upload", uploadRouter);
app.get("/msgLog", msgLogRouter); //대화기록 로드
app.get("/loadAllMsgData", loadAllMsgDataRouter); //대화기록 로드
app.get("/getUserNameByID", getUserNameByIDRouter);
app.get("/getLastMsg", getLastMsgRouter);
app.get("/getAllUser", getAllUserRouter);
app.get("/myFriend", myFriendRouter);
app.get("/markAsRead", markAsReadRouter);
app.get("/checkUserID", checkUserIDRouter);

app.post("/login", loginRouter);
app.post("/uploadImg/:userID", upload.single("image"), uploadImgRouter);
app.post("/saveMsg", saveMsgRouter);
app.post("/addFriend", addFriendRouter);
app.post("/delFriend", delFriendRouter);
app.post("/signUp", signUpRouter);
app.post("/resetPw", resetPwRouter);
app.post("/editProfile", editProfileRouter);

io.on("connection", (socket) => {
  socketController(io, socket);
});

server.listen(5252, () => {
  console.log("server is running on port 5252");
});
