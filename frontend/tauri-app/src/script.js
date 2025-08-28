// Handle role selection
function goToRole(role) {
  hideAllPages();

  if (role === 'researcher') {
    document.getElementById('researcherPage').classList.add('active');
    showSubPage('uploadPage');
  } else if (role === 'visitor') {
    document.getElementById('visitorPage').classList.add('active');
  } else if (role === 'admin') {
    document.getElementById('adminPage').classList.add('active');
  }
}

// Go back to landing page
function backToLanding() {
  hideAllPages();
  document.getElementById('landingPage').classList.add('active');
}



// Hide all main role pages
function hideAllPages() {
  const allPages = document.querySelectorAll('.page');
  allPages.forEach(page => page.classList.remove('active'));
}

// Switch subpages within researcher dashboard
function showPage(pageId) {
  const allSubpages = document.querySelectorAll('.subpage');
  allSubpages.forEach(page => page.classList.remove('active'));

  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }
}

// Frame slider logic
function updateFrameLabel(value) {
  document.getElementById('currentFrame').textContent = value;
  // Optional: update preview image to match frame
}

// Placeholder for prediction function
async function runPrediction() {
  const rawInput = document.getElementById('fileInput').files[0];
  const lsOutput = document.getElementById('fileLS').files[0];
  const hardware = document.getElementById('hardwareSelector').value;

  if (!rawInput) {
    alert("Please upload a .npz file to run prediction.");
    return;
  }
  const form = new FormData();
  form.append('raw_data', rawInput); 
  if(lsOutput) form.append('ls_output', lsOutput);
  form.append('hardware', hardware);

  try {
    const resp = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      body: form
    });
  } catch (error) {
    console.error("Error during prediction:", error);
  }
  // You would send rawInput and hardware to your backend API here.
  alert("Prediction started with: " + rawInput.name + "\nMode: " + hardware);

  // Placeholder: Show a fake GIF preview after "render"
  setTimeout(() => {
    document.getElementById('gifPreview').textContent = 'Rendered GIF preview shown here!';
    document.getElementById('frameControls').style.display = 'block';
  }, 1000);
}

// Placeholder for rendering GIF
function renderGif() {
  alert("Render GIF clicked. This would generate a comparison visual.");
  // Logic to call API and update gifPreview
}

// Placeholder for downloading rendered GIF
function downloadGif() {
  alert("Download started. This would download the rendered GIF.");
}
// Test Reveal Hidden Visitor gif
document.addEventListener("DOMContentLoaded", () => {
  const viewBtn = document.getElementById("viewBtn");
  const hiddenImage = document.getElementById("hiddenImage");

  viewBtn.addEventListener("click", () => {
    hiddenImage.style.display = "block";
  });

  hiddenImage.addEventListener("click", () => {
    hiddenImage.style.display = "none";
  });
});

// Show or hide frame controls based on visualisation mode
document.addEventListener("DOMContentLoaded", function () {
  const comparisonMode = document.getElementById("comparisonMode");
  const frameControls = document.getElementById("frameControls");

  comparisonMode.addEventListener("change", function () {
    if (comparisonMode.value === "Frame-by-Frame Viewer") {
      frameControls.style.display = "block";
    } else {
      frameControls.style.display = "none";
    }
  });
});