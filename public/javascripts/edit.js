let idChecked = true; //중복확인여부
const userID = $("#userID").val();

// 파일 미리보기
document.getElementById("files").onchange = function () {
  var reader = new FileReader();

  reader.onload = function (e) {
    // get loaded data and render thumbnail.
    document.getElementById("image").src = e.target.result;
  };

  // read the image file as a data URL.
  reader.readAsDataURL(this.files[0]);
};

$("#change-img-btn").click(() => {
  //유저 프로필 사진 URL
  const file = document.getElementById("files");
  const file2 = file.files[0].name;
  const idx = file2.indexOf(".");
  const fileFormatWithDot = file2.substring(idx); // 사진의 포맷임 이걸 DB에 저장해야한다

  uploadImageURL(file, $("#userid").val());
});

// TODO: 적용하기버튼
$("#submit-btn").click(() => {
  //유저 기본정보
  const userid = $("#userid").val();

  const username = $("#username").val();
  const usernickname = $("#usernickname").val();
  //유저 주소
  const postcode = $("#sample6_postcode").val();
  const address = $("#sample6_address").val();
  const detailAddress = $("#sample6_detailAddress").val();
  const extraAddress = $("#sample6_extraAddress").val();
  const statusMsg = $("#statusMsg").val();
  if (
    !userid ||
    !username ||
    !usernickname ||
    !postcode ||
    !address ||
    !detailAddress ||
    !extraAddress ||
    !statusMsg
  ) {
    alert("요구사항을 모두입력해주세요");
    return;
  }

  if (!idChecked) {
    alert("아이디 중복확인을 해주세요");
    return;
  }

  let userInfo = {
    userid: userid,
    username: username,
    usernickname: usernickname,
    postcode: postcode,
    address: address,
    detailAddress: detailAddress,
    extraAddress: extraAddress,
    statusMsg: statusMsg,
  };

  fetch("/editProfile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((data) => data.json())
    .then((res) => {
      console.log(res);
      alert("변경이 완료되었습니다!");
      window.location.href = `/mypage/${userID}`;
    });
});

// 사진 업로드 함수
function uploadImageURL(file, userid) {
  let formData = new FormData();

  formData.append("image", file.files[0]);

  fetch(`/uploadImg/${userid}`, {
    body: formData,
    method: "POST",
  })
    .then((res) => {
      console.log(res);
      console.log("사용자 id.확장자로 사진업로드완료");
      alert("변경완료");
    })
    .catch((err) => {
      console.log(err);
    });
}

// 자신의 정보 셋팅
fetch(`/userInfo/${userID}`)
  .then((data) => data.json())
  .then((res) => res.data)
  .then((userInfo) => {
    console.log(userInfo);
    $("#image").attr("src", "/" + userInfo.profileURL);

    //유저 기본정보
    $("#userid").val(userInfo.id);
    $("#statusMsg").val(userInfo.statusMsg);
    $("#username").val(userInfo.name);
    $("#usernickname").val(userInfo.nickname);
    //유저 주소
    $("#sample6_postcode").val(userInfo.postcode);
    $("#sample6_address").val(userInfo.address);
    $("#sample6_detailAddress").val(userInfo.detailAddress);
    $("#sample6_extraAddress").val(userInfo.extraAddress);
  });

$("#reset-pw").click(function () {
  const userpw = $("#userpw").val();
  let userInfo = {
    userid: userID,
    userpw: userpw,
  };
  if (userpw == "") {
    alert("비밀번호를 입력해주세요");
  } else {
    fetch("/resetPw", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
    })
      .then((data) => data.json())
      .then((res) => {
        console.log(res);
        alert("비밀번호가 변경되었습니다");
      });
  }
});
