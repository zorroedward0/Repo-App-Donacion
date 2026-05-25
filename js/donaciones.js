const API = "https://app-donacion-production.up.railway.app/api/donaciones";

async function listarDonaciones() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al obtener donaciones");
    }

    const data = await response.json();

    let html = "";

    data.forEach((donacion) => {
      html += `
        <tr class="text-center">

            <td>${donacion.id}</td>

            <td>${donacion.donanteNombreCompleto}</td>

            <td>${donacion.cantidadMl} ML</td>

            <td>${donacion.fechaDonacion || "Sin fecha"}</td>

            <td>${donacion.observaciones || "Sin observaciones"}</td>

            <td>

                <button class="btn btn-info btn-sm text-white me-2"
                    onclick="verDonacion(${donacion.id})">

                    <i class="fa-solid fa-eye"></i>

                </button>

                <button class="btn btn-danger btn-sm"
                    onclick="eliminarDonacion(${donacion.id})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>
      `;
    });

    if ($.fn.DataTable.isDataTable("#tablaDonaciones")) {
      $("#tablaDonaciones").DataTable().destroy();
    }

    document.getElementById("tbodyDonaciones").innerHTML = html;

    $("#tablaDonaciones").DataTable({
      pageLength: 5,
      lengthChange: false,
      language: {
        search: "Buscar:",
      },
    });

  } catch (error) {
    console.error(error);

    if ($.fn.DataTable.isDataTable("#tablaDonaciones")) {
      $("#tablaDonaciones").DataTable().destroy();
    }

    document.getElementById("tbodyDonaciones").innerHTML = `
      <tr>
          <td colspan="6" class="text-center text-danger">
              Error cargando donaciones
          </td>
      </tr>
    `;
  }
}


async function verDonacion(id) {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error obteniendo donación");
    }

    const d = await response.json();

    detalleId.textContent = d.id;

    detalleDonante.textContent = d.donanteNombreCompleto;

    detalleCantidad.textContent = `${d.cantidadMl} ML`;

    detalleFecha.textContent = d.fechaDonacion || "Sin fecha";

    detalleObservaciones.textContent =
      d.observaciones || "Sin observaciones";

    new bootstrap.Modal(
      document.getElementById("modalDetalle")
    ).show();

  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error cargando donación",
    });
  }
}

async function eliminarDonacion(id) {
  Swal.fire({
    title: "¿Eliminar donación?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc3545",
    confirmButtonText: "Eliminar",
  }).then(async (result) => {

    if (result.isConfirmed) {

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API}/${id}`, {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error eliminando");
        }

        Swal.fire({
          icon: "success",
          title: "Donación eliminada",
        });

        listarDonaciones();

      } catch (error) {
        console.error(error);

        Swal.fire({
          icon: "error",
          title: "No se pudo eliminar",
        });
      }
    }
  });
}

$(document).ready(function () {
  listarDonaciones();
});