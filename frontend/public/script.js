function showPage(pageId) {
  const pages = document.querySelectorAll('.page');
  pages.forEach(page => page.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
}

function updateFrameLabel(value) {
  document.getElementById('currentFrame').textContent = value;
}

function runPrediction() {
  alert("Prediction started (stub)");
}

function renderGif() {
  document.getElementById("gifPreview").textContent = "Rendering preview (stub)...";
}

function downloadGif() {
  alert("Downloading GIF (stub)");
}