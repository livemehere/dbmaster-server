autoLogin();

$(".sign-in").click(function (e) {
  const id = $("#id").val();
  const pw = $("#pw").val();
  e.preventDefault();
  axios
    .post("/login", {
      id,
      pw,
    })
    .then(function (response) {
      console.log(response.data);
      console.log($("#auto-check-box").is(":checked"));

      if (response.data.res == true) {
        if ($("#auto-check-box").is(":checked")) {
          axios
            .get(`/setCookie?userID=${id}&userPW=${pw}`)
            .then(function (response) {
              console.log(response);
            });
        } else {
          fetch("/removeCookie")
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
            });
        }

        alert("login success!");
        window.location.href = `/mypage/${id}`;
      }

      if (response.data.res == false) alert("fail!");
    })
    .catch(function (error) {
      console.log(error);
    });
});

$(".sign-up").click(function (e) {
  e.preventDefault();
  window.location.href = "/signup";
});

function autoLogin() {
  console.log($("#autoID").val());
  if ($("#autoID").val() != "") {
    $("#id").val($("#autoID").val());
    $("#pw").val($("#autoPW").val());
    $("#auto-check-box").attr("checked", true);
    // window.location.href = `/mypage/${$("#autoID").val()}`;
  }
}
