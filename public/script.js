// QR Code
async function generateQR() {
  const text = document.getElementById("qrText").value;
  const res = await fetch("/qrcode", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  const data = await res.json();
  document.getElementById(
    "qrResult"
  ).innerHTML = `<img src="${data.qr}" class="mx-auto"/>`;
}

// PDF Generator
function generatePDF() {
  const text = document.getElementById("pdfInput").value;
  fetch("/pdf", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  })
    .then((res) => res.blob())
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "generated.pdf";
      a.click();
    });
}

// Joke
async function getJoke() {
  const res = await fetch("/joke");
  const data = await res.json();
  document.getElementById(
    "jokeResult"
  ).innerText = `${data.setup} - ${data.punchline}`;
}
