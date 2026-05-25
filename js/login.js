const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "https://app-donacion-production.up.railway.app/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    username,
                    password
                })
            }
        );

        if (!response.ok) {

            Swal.fire({
                title: "Error",
                text: "Credenciales incorrectas",
                icon: "error",
                confirmButtonText: "Intentar nuevamente",
                background: "#1e1e2f",
                color: "#fff",
                confirmButtonColor: "#e74c3c"
            });

            return;
        }

        const data = await response.json();

        localStorage.setItem(
            "token",
            data.token
        );

        Swal.fire({
            title: "Bienvenido",
            text: "Login exitoso",
            icon: "success",
            confirmButtonText: "Continuar",
            background: "#1e1e2f",
            color: "#fff",
            confirmButtonColor: "#27ae60"
        }).then(() => {

            window.location.href = "index.html";
        });

    } catch (error) {

        Swal.fire({
            title: "Error del servidor",
            text: "No se pudo conectar con el backend",
            icon: "warning",
            confirmButtonText: "Aceptar",
            background: "#1e1e2f",
            color: "#fff",
            confirmButtonColor: "#f39c12"
        });
    }
});