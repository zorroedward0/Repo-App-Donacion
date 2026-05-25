const API = "https://app-donacion-production.up.railway.app/api/inventario";

async function cargarInventario() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Error al cargar inventario");
    }

    const data = await response.json();

    let html = "";

    data.forEach((item) => {
      html += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.tipoSangre}</td>
                    <td>${item.cantidadMl} ml</td>
                    <td>${item.ultimaActualizacion}</td>
                </tr>
            `;
    });

    document.getElementById("tbodyInventario").innerHTML = html;
  } catch (error) {
    htmlsE= '';
    htmlsE += `
        <tr>
            <td colspan="100%" class="text-center">
                No hay registros actualmente
            </td>            
        </tr>
    `;

    document.getElementById("tbodyInventario").innerHTML = htmlsE;

    console.error(error);
  }
}

async function retirarSangre() {
  try {
    const tipoSangre = document.getElementById("tipoSangre").value;

    const cantidadMl = document.getElementById("cantidadMl").value;

    if (!cantidadMl || cantidadMl <= 0) {
      Swal.fire({
        icon: "warning",
        title: "Cantidad inválida",
        text: "Ingresa una cantidad mayor a 0",
      });
      return;
    }

    const token = localStorage.getItem("token");

    const body = {
      tipoSangre,
      cantidadMl: parseFloat(cantidadMl),
    };

    const result = await Swal.fire({
      title: "¿Confirmar retiro?",
      text: `Retirar ${cantidadMl} ml de ${tipoSangre}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Sí, retirar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    const response = await fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Error al retirar sangre");
    }

    await response.json();

    Swal.fire({
      icon: "success",
      title: "Éxito",
      text: "Sangre retirada correctamente",
      timer: 2000,
      showConfirmButton: false,
    });

    document.getElementById("cantidadMl").value = "";

    const modal = bootstrap.Modal.getInstance(
      document.getElementById("modalRetirar"),
    );

    modal.hide();

    cargarInventario();
  } catch (error) {
    console.error(error);

    Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo completar el retiro",
    });
  }
}

cargarInventario();
