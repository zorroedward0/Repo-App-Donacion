const API = "https://app-donacion-production.up.railway.app/api/donaciones";

const API_DONANTES = "https://app-donacion-production.up.railway.app/api/donantes";

async function cargarDonantes() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API_DONANTES, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar donantes");
    }

    const donantes = await response.json();

    const select = document.getElementById("donanteId");

    select.innerHTML = `
      <option value="">
        Seleccione un donante
      </option>
    `;

    donantes.forEach((donante) => {
      const option = document.createElement("option");

      option.value = donante.id;

      option.textContent = `
        ${donante.nombres} ${donante.apellidos}
        - CC: ${donante.documento}
      `;

      select.appendChild(option);
    });
  } catch (error) {
    console.error(error);

    document.getElementById("mensaje").innerHTML = `
      <div class="alert alert-danger shadow-sm">

        <i class="fa-solid fa-circle-exclamation"></i>

        ${error.message}

      </div>
    `;
  }
}

document
  .getElementById("donacionForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      donanteId: parseInt(document.getElementById("donanteId").value),

      cantidadMl: parseFloat(document.getElementById("cantidadML").value),

      observaciones: document.getElementById("observaciones").value,
    };

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("No fue posible registrar la donación");
      }

      document.getElementById("mensaje").innerHTML = `
  <div class="alert alert-success shadow-sm">
    <i class="fa-solid fa-circle-check"></i>
    Donación registrada correctamente
  </div>
`;

      setTimeout(() => {
        window.location.reload();
      }, 1000);

      document.getElementById("donacionForm").reset();
    } catch (error) {
      console.error(error);

      document.getElementById("mensaje").innerHTML = `
  <div class="alert alert-danger shadow-sm">
    <i class="fa-solid fa-circle-xmark"></i>
    ${error.message}
  </div>
`;

      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  cargarDonantes();
});
