document.addEventListener("DOMContentLoaded", function () {
  const LIMIT = 2 * 60 * 60 * 1000;
  function isExpired() {
    const lastActivity = localStorage.getItem("lastActivity");
    return !lastActivity || Date.now() - lastActivity > LIMIT;
  }

  if (isExpired()) {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
  }

  function updateActivity() {
    localStorage.setItem("lastActivity", Date.now());
  }

  document.addEventListener("click", updateActivity);
  document.addEventListener("keydown", updateActivity);
  document.addEventListener("mousemove", updateActivity);
  document.addEventListener("scroll", updateActivity);
  document.addEventListener("touchstart", updateActivity);

  updateActivity();

  window.addEventListener("storage", function (event) {
    if (event.key === "logout") {
      window.location.href = "login.html";
    }
  });

  window.logout = function () {
    localStorage.setItem("logout", Date.now());
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "login.html";
  };
});
