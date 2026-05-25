const API = "https://app-donacion-production.up.railway.app/api/donantes";

const mapeoTipoSangre = {
  "O+": "O_POSITIVO",
  "O-": "O_NEGATIVO",
  "A+": "A_POSITIVO",
  "A-": "A_NEGATIVO",
  "B+": "B_POSITIVO",
  "B-": "B_NEGATIVO",
  "AB+": "AB_POSITIVO",
  "AB-": "AB_NEGATIVO",
};

const canvas = document.getElementById("signatureCanvas");
const ctx = canvas.getContext("2d");

const modoDibujarBtn = document.getElementById("modoDibujar");

const modoSubirBtn = document.getElementById("modoSubir");

const contenedorCanvas = document.getElementById("contenedorCanvas");

const contenedorUpload = document.getElementById("contenedorUpload");

let dibujando = false;
let archivoFirma = null;
let huboTrazo = false;
let modoFirma = "draw";

function resizeCanvas() {
  const ratio = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

function activarModoDraw() {
  modoFirma = "draw";

  contenedorCanvas.classList.remove("d-none");

  contenedorUpload.classList.add("d-none");

  modoDibujarBtn.classList.remove("btn-outline-danger");

  modoDibujarBtn.classList.add("btn-danger");

  modoSubirBtn.classList.remove("btn-danger");

  modoSubirBtn.classList.add("btn-outline-danger");
}

function activarModoUpload() {
  modoFirma = "upload";

  contenedorCanvas.classList.add("d-none");

  contenedorUpload.classList.remove("d-none");

  modoSubirBtn.classList.remove("btn-outline-danger");

  modoSubirBtn.classList.add("btn-danger");

  modoDibujarBtn.classList.remove("btn-danger");

  modoDibujarBtn.classList.add("btn-outline-danger");
}

modoDibujarBtn.addEventListener("click", activarModoDraw);

modoSubirBtn.addEventListener("click", activarModoUpload);

function obtenerPosicion(event) {
  const rect = canvas.getBoundingClientRect();

  let clientX;
  let clientY;

  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;

    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: clientX - rect.left,
    y: clientY - rect.top,
  };
}

function iniciarDibujo(e) {
  if (modoFirma !== "draw") return;

  dibujando = true;

  const pos = obtenerPosicion(e);

  ctx.beginPath();

  ctx.moveTo(pos.x, pos.y);
}

function dibujar(e) {
  if (!dibujando || modoFirma !== "draw") {
    return;
  }

  e.preventDefault();

  huboTrazo = true;

  const pos = obtenerPosicion(e);

  ctx.lineTo(pos.x, pos.y);

  ctx.stroke();
}

function finalizarDibujo() {
  dibujando = false;
}

canvas.addEventListener("mousedown", iniciarDibujo);

canvas.addEventListener("mousemove", dibujar);

canvas.addEventListener("mouseup", finalizarDibujo);

canvas.addEventListener("mouseleave", finalizarDibujo);

canvas.addEventListener("touchstart", iniciarDibujo);

canvas.addEventListener("touchmove", dibujar);

canvas.addEventListener("touchend", finalizarDibujo);

document.getElementById("limpiarFirma").addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  archivoFirma = null;

  huboTrazo = false;

  document.getElementById("firmaImagen").value = "";

  document.getElementById("previewFirma").innerHTML = "";
});

document.getElementById("firmaImagen").addEventListener("change", function (e) {
  const file = e.target.files[0];

  if (!file) return;

  const tiposPermitidos = ["image/png", "image/jpeg", "image/jpg"];

  if (!tiposPermitidos.includes(file.type)) {
    alert("Solo se permiten imágenes PNG o JPG");

    e.target.value = "";

    return;
  }

  if (file.size > 2 * 1024 * 1024) {
    alert("La imagen no puede superar 2MB");

    e.target.value = "";

    return;
  }

  archivoFirma = file;

  const url = URL.createObjectURL(file);

  document.getElementById("previewFirma").innerHTML = `
      <img
        src="${url}"
        class="img-fluid rounded border"
        style="max-height:220px;"
      />
    `;
});

function canvasToFile() {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      const file = new File([blob], `firma_${Date.now()}.png`, {
        type: "image/png",
      });

      resolve(file);
    }, "image/png");
  });
}

document.getElementById("donanteForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const aceptaConsentimiento =
    document.getElementById("consentimiento").checked;

  if (!aceptaConsentimiento) {
    document.getElementById("mensaje").innerHTML = `
        <div class="alert alert-danger">
          Debes aceptar el consentimiento
        </div>
      `;

    return;
  }

  if (modoFirma === "draw" && !huboTrazo) {
    document.getElementById("mensaje").innerHTML = `
        <div class="alert alert-danger">
          Debes realizar una firma
        </div>
      `;

    return;
  }

  if (modoFirma === "upload" && !archivoFirma) {
    document.getElementById("mensaje").innerHTML = `
        <div class="alert alert-danger">
          Debes subir una imagen
        </div>
      `;

    return;
  }

  if (modoFirma === "draw" && huboTrazo) {
    archivoFirma = await canvasToFile();
  }

  const sangreSeleccionada = document.getElementById("tipoSangre").value;

  const sangreEnum = mapeoTipoSangre[sangreSeleccionada] || sangreSeleccionada;

  const requestBody = {
    nombres: document.getElementById("nombres").value,

    apellidos: document.getElementById("apellidos").value,

    documento: document.getElementById("documento").value,

    fechaNacimiento: document.getElementById("fechaNacimiento").value,

    tipoSangre: sangreEnum,

    peso: parseFloat(document.getElementById("peso").value),

    telefono: document.getElementById("telefono").value,

    correo: document.getElementById("correo").value,

    direccion: document.getElementById("direccion").value,
  };

  const formData = new FormData();

  formData.append(
    "donante",
    new Blob([JSON.stringify(requestBody)], {
      type: "application/json",
    }),
  );

  formData.append("firma", archivoFirma);

  formData.append("aceptaConsentimiento", aceptaConsentimiento);

  try {
    const token = localStorage.getItem("token");

    const response = await fetch(API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al registrar donante");
    }

    document.getElementById("mensaje").innerHTML = `
        <div class="alert alert-success">
          Donante registrado correctamente
        </div>
      `;

    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    document.getElementById("mensaje").innerHTML = `
        <div class="alert alert-danger">
          ${error.message}
        </div>
      `;
  }
});
