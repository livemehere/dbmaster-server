let idChecked = false; //중복확인여부

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

// 아이디 중복확인 후 더이상 수정 불가능하게 만드는 이벤트
$("#checkID").click(() => {
  if ($("#userid").val() == "") {
    alert("아이디를 입력해주세요");
    return;
  }

  fetch(`/checkUserID?userID=${$("#userid").val()}`)
    .then((data) => data.json())
    .then((data) => {
      if (data.length <= 0) {
        idChecked = true;
        console.log("사용가능한 아이디입니다.");
        alert("사용가능한 아이디입니다.");
        document.getElementById("userid").disabled = true;
        $("#userid").css("color", "#c571f8");
      } else {
        console.log("중복된 아이디입니다.");
        alert("중복된 아이디입니다.");

        idChecked = false;
      }
    });
});

// 회원가입 버튼
$("#submit-btn").click(() => {
  //유저 기본정보
  const userid = $("#userid").val();
  const userpw = $("#userpw").val();
  const username = $("#username").val();
  const usernickname = $("#usernickname").val();
  //유저 주소
  const postcode = $("#sample6_postcode").val();
  const address = $("#sample6_address").val();
  const detailAddress = $("#sample6_detailAddress").val();
  const extraAddress = $("#sample6_extraAddress").val();
  if (
    !userid ||
    !userpw ||
    !username ||
    !usernickname ||
    !postcode ||
    !address ||
    !detailAddress ||
    !extraAddress
  ) {
    alert("요구사항을 모두입력해주세요");
    return;
  }

  if (!idChecked) {
    alert("아이디 중복확인을 해주세요");
    return;
  }

  const file = document.getElementById("files");
  if (!file.value) {
    alert("프로필 사진은 필수입니다");
    return;
  }

  //유저 프로필 사진 URL

  const file2 = file.files[0].name;
  const idx = file2.indexOf(".");
  const fileFormatWithDot = file2.substring(idx); // 사진의 포맷임 이걸 DB에 저장해야한다

  //id가 중복확인이 되었을때만 업로드가능함
  if (idChecked && userid != "") {
    uploadImageURL(file, userid);
  } else {
    console.log("중복확인 또는 userID를 채워주세요");
  }

  let userInfo = {
    userid: userid,
    userpw: userpw,
    username: username,
    usernickname: usernickname,
    postcode: postcode,
    address: address,
    detailAddress: detailAddress,
    extraAddress: extraAddress,
    profileURL: fileFormatWithDot,
  };
  fetch("/signUp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userInfo),
  })
    .then((data) => data.json())
    .then((res) => {
      console.log(res);
      alert("회원가입이 완료되었습니다!");
      window.location.href = "/chat";
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
    })
    .catch((err) => {
      console.log(err);
    });
}
