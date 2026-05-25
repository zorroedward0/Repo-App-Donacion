document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", function () {
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión actual se cerrará",
      icon: "warning",

      background: "#1e1e2f",
      color: "#ffffff",

      iconColor: "#dc3545",

      showCancelButton: true,
      confirmButtonText: "Sí, salir",
      cancelButtonText: "Cancelar",

      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",

      reverseButtons: true,

      customClass: {
        popup: "swal-logout-popup",
        title: "swal-logout-title",
        htmlContainer: "swal-logout-text",
        confirmButton: "btn btn-danger px-4",
        cancelButton: "btn btn-outline-light px-4",
      },

      buttonsStyling: false,

      showClass: {
        popup: "animate__animated animate__fadeInDown",
      },
      hideClass: {
        popup: "animate__animated animate__fadeOutUp",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "login.html";
      }
    });
  });
});
