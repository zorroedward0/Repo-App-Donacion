const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const username =
        document.getElementById("username").value;

    const password =
        document.getElementById("password").value;

    try {

        const response = await fetch(
            "https://app-donacion-production.up.railway.app/auth/register",
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
                title: "Registro fallido",
                text: "Error al registrar usuario",
                icon: "error",
                confirmButtonText: "Intentar nuevamente",
                background: "#1e1e2f",
                color: "#fff",
                confirmButtonColor: "#e74c3c"
            });

            return;
        }

        Swal.fire({
            title: "Registro exitoso",
            text: "Usuario registrado correctamente",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
            background: "#1e1e2f",
            color: "#fff"
        });

        form.reset();

        setTimeout(() => {

            window.location.href = "login.html";

        }, 1500);

    } catch (error) {

        Swal.fire({
            title: "Error del servidor",
            text: "No se pudo conectar con el servidor",
            icon: "warning",
            confirmButtonText: "Aceptar",
            background: "#1e1e2f",
            color: "#fff",
            confirmButtonColor: "#f39c12"
        });

        console.error(error);
    }
});