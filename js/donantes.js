
const API = "https://app-donacion-production.up.railway.app/api/donantes";

async function listarDonantes() {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(API, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) throw new Error("Error al obtener donantes");

        const data = await response.json();
        let html = "";

        data.forEach(donante => {
            html += `
                <tr>
                    <td>${donante.id}</td>
                    <td>${donante.nombres} ${donante.apellidos}</td>
                    <td>${donante.documento}</td>
                    <td><span class="badge bg-danger">${donante.tipoSangre}</span></td>
                    <td>${donante.peso} KG</td>
                    <td>${donante.correo}</td>
                    <td>${donante.telefono}</td>
                    <td>${donante.direccion}</td>
                    <td>${donante.fechaNacimiento}</td>
                    <td class="text-center">
                        <button class="btn btn-warning btn-sm me-2" onclick="editarDonante(${donante.id})">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarDonante(${donante.id})">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });

        if ($.fn.DataTable.isDataTable('#tablaDonantes')) {
            $('#tablaDonantes').DataTable().destroy();
        }

        document.getElementById("tbodyDonantes").innerHTML = html;

        $('#tablaDonantes').DataTable({
            pageLength: 5,
            lengthChange: false,
            language: {
                search: "Buscar:"
            }
        });

    } catch (error) {
        console.error(error);

        if ($.fn.DataTable.isDataTable('#tablaDonantes')) {
            $('#tablaDonantes').DataTable().destroy();
        }

        document.getElementById("tbodyDonantes").innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-danger">
                    Error cargando donantes
                </td>
            </tr>`;
    }
}

async function editarDonante(id) {

    try {

        const token = localStorage.getItem("token");

        const response = await fetch(`${API}/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error("Error obteniendo donante");
        }

        const d = await response.json();

        editarId.value = d.id;
        editarNombres.value = d.nombres;
        editarApellidos.value = d.apellidos;
        editarDocumento.value = d.documento;
        editarTipo.value = d.tipoSangre;
        editarTelefono.value = d.telefono;
        editarCorreo.value = d.correo;
        editarDireccion.value = d.direccion;
        editarFechaNacimiento.value = d.fechaNacimiento;
        editarPeso.value = d.peso;

        new bootstrap.Modal(
            document.getElementById("modalEditar")
        ).show();

    } catch (error) {

        console.error(error);

        Swal.fire({
            icon: "error",
            title: "Error cargando donante"
        });
    }
}

document.getElementById("formEditar")
    .addEventListener("submit", async e => {

        e.preventDefault();

        try {

            const token = localStorage.getItem("token");

            const id = editarId.value;

            const donanteActualizado = {

                nombres: editarNombres.value,
                apellidos: editarApellidos.value,
                documento: editarDocumento.value,
                tipoSangre: editarTipo.value,
                telefono: editarTelefono.value,
                correo: editarCorreo.value,
                direccion: editarDireccion.value,
                fechaNacimiento: editarFechaNacimiento.value,
                peso: editarPeso.value

            };

            const response = await fetch(`${API}/${id}`, {

                method: "PUT",

                headers: {

                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`

                },

                body: JSON.stringify(donanteActualizado)

            });

            if (!response.ok) {
                throw new Error("Error actualizando donante");
            }

            bootstrap.Modal.getInstance(
                document.getElementById("modalEditar")
            ).hide();

            Swal.fire({
                icon: "success",
                title: "Donante actualizado"
            });

            listarDonantes();

        } catch (error) {

            console.error(error);

            Swal.fire({
                icon: "error",
                title: "No se pudo actualizar"
            });
        }

    });

async function eliminarDonante(id) {

    Swal.fire({

        title: "¿Eliminar donante?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#dc3545",
        confirmButtonText: "Eliminar"

    }).then(async result => {

        if (result.isConfirmed) {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(`${API}/${id}`, {

                    method: "DELETE",

                    headers: {
                        Authorization: `Bearer ${token}`
                    }

                });

                if (!response.ok) {
                    throw new Error("Error eliminando");
                }

                Swal.fire({
                    icon: "success",
                    title: "Donante eliminado"
                });

                listarDonantes();

            } catch (error) {

                console.error(error);

                Swal.fire({
                    icon: "error",
                    title: "No se pudo eliminar"
                });
            }
        }

    });
}

$(document).ready(function () {


    listarDonantes();
    $('#tablaDonantes').DataTable({

        pageLength: 5,
        lengthChange: false,

        language: {
            search: "Buscar:"
        }

    });


});

function clonarBloqueo(capaBloqueo) {
    capaBloqueo.addEventListener('click', function () {
        const capaActual = this;

        Swal.fire({
            title: '¿Desea continuar?',
            text: 'Este campo no debe ser modificado, a menos que haya habido un error de creación.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'No, mantener'
        }).then((result) => {
            if (result.isConfirmed) {
                const contenedorPadre = capaActual.closest('.contenedor-bloqueado');
                const inputAsociado = contenedorPadre.querySelector('.input-bloqueado');

                inputAsociado.removeAttribute('disabled');
                capaActual.remove();
            }
        });
    });
}

document.querySelectorAll('.bloqueo-click').forEach(clonarBloqueo);

const miModal = document.getElementById('modalEditar');
miModal.addEventListener('hidden.bs.modal', function () {

    const contenedores = document.querySelectorAll('.contenedor-bloqueado');

    contenedores.forEach(function (contenedor) {
        const inputAsociado = contenedor.querySelector('.input-bloqueado');

        inputAsociado.setAttribute('disabled', 'true');

        if (!contenedor.querySelector('.bloqueo-click')) {
            const nuevaCapa = document.createElement('div');
            nuevaCapa.className = 'bloqueo-click';

            nuevaCapa.style.cssText = 'position: absolute; top: 0; left: 8px; right: 8px; bottom: 0; z-index: 10; cursor: pointer;';

            contenedor.appendChild(nuevaCapa);

            clonarBloqueo(nuevaCapa);
        }
    });
});