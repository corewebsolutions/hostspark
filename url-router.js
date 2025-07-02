//check if user logged in
document.addEventListener("DOMContentLoaded", function () {
  authUser();
});

function authUser() {

  $.ajax({
    url: baseURL + "api:xAumndFJ/auth/me",
    type: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.authToken,
    },
    success: function (data) {
      pageRedirect();
    },
    error: function (error) {
      //run code if they are not logged in
      alert("You are not logged in");
      window.location.href = "/auth/login";
    },
  });
}

function pageRedirect() {

  // get url parameters
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const urlParameter = new URLSearchParams(window.location.search);
  let id = urlParams.get("id");

  var path = window.location.pathname; // get path name
  var page = path.substring(path.indexOf("/app/") + "/app/".length);

  // save to local storage
  console.log(page); // log
  localStorage.setItem("pageId", page); // store page variable for re-directs
  localStorage.setItem("pageRefreshParam", id);
  location.href = "/app/home"; // redirect to dashboard
  
}