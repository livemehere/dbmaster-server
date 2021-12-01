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
      if (response.data.res == true) {
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
  alert("sign UP!");
});
