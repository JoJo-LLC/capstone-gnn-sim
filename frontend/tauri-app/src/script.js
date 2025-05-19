// Sidebar navigation
function showPage(pageId) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => {
    page.classList.remove("active");
  });

  const selectedPage = document.getElementById(pageId);
  if (selectedPage) {
    selectedPage.classList.add("active");
  }
}

// Prediction placeholder
function runPrediction() {
  const fileInput = document.getElementById("fileInput");
  const fileLS = document.getElementById("fileLS");
  const hardwareMode = document.getElementById("hardwareSelector").value;

  if (!fileInput.files.length) {
    alert("Please upload a raw simulation input (.npz) file.");
    return;
  }

  alert(`Running prediction on ${fileInput.files[0].name} using ${hardwareMode.toUpperCase()}...`);
}

// Render GIF placeholder
function renderGif() {
  document.getElementById("gifPreview").innerHTML = "<p>[Rendered GIF Placeholder]</p>";
}

// Download GIF placeholder
function downloadGif() {
  alert("Downloading simulated GIF... (placeholder)");
}

// Comparison mode change
function updateMode() {
  const mode = document.getElementById("comparisonMode").value;
  const frameControls = document.getElementById("frameControls");
  frameControls.style.display = (mode === "Frame-by-Frame Viewer") ? "block" : "none";
}

// Update frame slider
function updateFrameLabel(value) {
  document.getElementById("currentFrame").innerText = value;
}