const token = localStorage.getItem("token");
if (token == null || token.length <= 0) {
    window.location.href = "login.html"
}
