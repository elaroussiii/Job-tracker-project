// ========== CONFIGURATION ==========
// TON URL MOCKAPI ICI
const API_URL = "https://69428fb069b12460f311dc56.mockapi.io/applications";

// ========== STATE ==========
let applications = [];
let currentFilter = "all";
let editingId = null;

// ========== DOM ELEMENTS ==========
const applicationsGrid = document.getElementById("applicationsGrid");
const statusFilter = document.getElementById("statusFilter");
const addApplicationBtn = document.getElementById("addApplicationBtn");

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const applicationForm = document.getElementById("applicationForm");

// Form inputs
const companyInput = document.getElementById("companyInput");
const positionInput = document.getElementById("positionInput");
const contractInput = document.getElementById("contractInput");
const statusInput = document.getElementById("statusInput");
const applyDateInput = document.getElementById("applyDateInput");
const interviewDateInput = document.getElementById("interviewDateInput");
const offerLinkInput = document.getElementById("offerLinkInput");
const notesInput = document.getElementById("notesInput");

// Stats
const statSent = document.getElementById("statSent");
const statInterview = document.getElementById("statInterview");
const statRejected = document.getElementById("statRejected");
const statAccepted = document.getElementById("statAccepted");

// ========== API FUNCTIONS ==========

/**
 * Fetch all applications from API
 */
async function loadApplications() {
  try {
    showLoading(true);
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    applications = await response.json();
    renderApplications();
  } catch (error) {
    console.error("Error loading applications:", error);
    alert("❌ Failed to load applications. Check console for details.");
  } finally {
    showLoading(false);
  }
}

/**
 * Create a new application
 */
async function createApplication(data) {
  try {
    showLoading(true);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const newApp = await response.json();
    applications.push(newApp);
    renderApplications();
    closeModal();
  } catch (error) {
    console.error("Error creating application:", error);
    alert("❌ Failed to create application. Please try again.");
  } finally {
    showLoading(false);
  }
}

/**
 * Update an existing application
 */
async function updateApplication(id, data) {
  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const updatedApp = await response.json();
    applications = applications.map((a) => (a.id === id ? updatedApp : a));
    renderApplications();
    closeModal();
  } catch (error) {
    console.error("Error updating application:", error);
    alert("❌ Failed to update application. Please try again.");
  } finally {
    showLoading(false);
  }
}

/**
 * Delete an application
 */
async function deleteApplication(id) {
  if (!confirm("Are you sure you want to delete this application?")) {
    return;
  }

  try {
    showLoading(true);
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    applications = applications.filter((a) => a.id !== id);
    renderApplications();
  } catch (error) {
    console.error("Error deleting application:", error);
    alert("❌ Failed to delete application. Please try again.");
  } finally {
    showLoading(false);
  }
}

// ========== MODAL FUNCTIONS ==========

function openModal(isEdit = false, app = null) {
  if (isEdit && app) {
    modalTitle.textContent = "Edit Application";
    editingId = app.id;

    companyInput.value = app.company;
    positionInput.value = app.position;
    contractInput.value = app.contractType;
    statusInput.value = app.status;
    applyDateInput.value = app.applyDate;
    interviewDateInput.value = app.interviewDate || "";
    offerLinkInput.value = app.offerLink || "";
    notesInput.value = app.notes || "";
  } else {
    modalTitle.textContent = "Add New Application";
    editingId = null;
    applicationForm.reset();
    applyDateInput.value = new Date().toISOString().split("T")[0];
  }

  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
  applicationForm.reset();
  editingId = null;
}

// ========== RENDER FUNCTIONS ==========

function renderApplications() {
  const list = applications.filter((app) => {
    return currentFilter === "all" || app.status === currentFilter;
  });

  applicationsGrid.innerHTML = "";

  if (list.length === 0) {
    applicationsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: white; font-size: 18px;">
                📭 No applications found. Add your first one!
            </div>
        `;
    updateStats();
    return;
  }

  list.forEach((app) => {
    const card = document.createElement("div");
    card.className = "app-card";
    card.dataset.status = app.status;

    const statusClass =
      app.status === "sent"
        ? "status-sent"
        : app.status === "interview"
        ? "status-interview"
        : app.status === "rejected"
        ? "status-rejected"
        : "status-accepted";

    card.innerHTML = `
            <div class="card-header">
                <div class="company-info">
                    <h3>${escapeHtml(app.company)}</h3>
                    <p class="position">${escapeHtml(app.position)}</p>
                </div>
                <span class="status-badge ${statusClass}">
                    ${capitalize(app.status)}
                </span>
            </div>
            <div class="card-body">
                <div class="info-row">
                    <span class="info-label">Contract Type</span>
                    <span class="contract-badge">${escapeHtml(
                      app.contractType
                    )}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Applied Date</span>
                    <span class="info-value">${formatDate(app.applyDate)}</span>
                </div>
                ${
                  app.interviewDate
                    ? `
                <div class="info-row">
                    <span class="info-label">Interview Date</span>
                    <span class="info-value">${formatDate(
                      app.interviewDate
                    )}</span>
                </div>`
                    : ""
                }
                ${
                  app.notes
                    ? `
                <div style="margin-top: 1rem; padding: 0.8rem; background: #f9fafb; border-radius: 8px; font-size: 13px; color: #555;">
                    💬 ${escapeHtml(app.notes)}
                </div>`
                    : ""
                }
                ${
                  app.offerLink
                    ? `
                <div style="margin-top: 0.8rem;">
                    <a href="${escapeHtml(
                      app.offerLink
                    )}" target="_blank" style="color: #667eea; text-decoration: none; font-size: 14px;">
                        🔗 View Offer
                    </a>
                </div>`
                    : ""
                }
            </div>
            <div class="card-footer">
                <button class="btn btn-edit">✏️ Edit</button>
                <button class="btn btn-delete">🗑️ Delete</button>
            </div>
        `;

    // Attach events
    const editBtn = card.querySelector(".btn-edit");
    const deleteBtn = card.querySelector(".btn-delete");

    editBtn.addEventListener("click", () => openModal(true, app));
    deleteBtn.addEventListener("click", () => deleteApplication(app.id));

    applicationsGrid.appendChild(card);
  });

  updateStats();
}

function updateStats() {
  statSent.textContent = applications.filter((a) => a.status === "sent").length;
  statInterview.textContent = applications.filter(
    (a) => a.status === "interview"
  ).length;
  statRejected.textContent = applications.filter(
    (a) => a.status === "rejected"
  ).length;
  statAccepted.textContent = applications.filter(
    (a) => a.status === "accepted"
  ).length;
}

// ========== UTILITY FUNCTIONS ==========

function showLoading(show) {
  if (show) {
    applicationsGrid.style.opacity = "0.5";
    applicationsGrid.style.pointerEvents = "none";
  } else {
    applicationsGrid.style.opacity = "1";
    applicationsGrid.style.pointerEvents = "auto";
  }
}

function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ========== EVENT LISTENERS ==========

document.addEventListener("DOMContentLoaded", () => {
  // Set default apply date
  applyDateInput.value = new Date().toISOString().split("T")[0];

  // 🔥 Load applications from API on page load
  loadApplications();

  // Add application button
  addApplicationBtn.addEventListener("click", () => openModal(false));

  // Close modal buttons
  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);

  // Close modal on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Filter change
  statusFilter.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    renderApplications();
  });

  // Form submit
  applicationForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = {
      company: companyInput.value.trim(),
      position: positionInput.value.trim(),
      contractType: contractInput.value,
      status: statusInput.value,
      applyDate: applyDateInput.value,
      interviewDate: interviewDateInput.value || "",
      offerLink: offerLinkInput.value.trim(),
      notes: notesInput.value.trim(),
    };

    if (editingId) {
      updateApplication(editingId, data);
    } else {
      createApplication(data);
    }
  });

  // Déconnexion au clic sur l'avatar
  const userAvatar = document.querySelector(".user-avatar");
  if (userAvatar) {
    userAvatar.addEventListener("click", logout);
    userAvatar.style.cursor = "pointer"; // Indique que c'est cliquable
  }
});

// Fonction de déconnexion
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  window.location.href = "auth.html"; // Redirige vers la page d'authentification
}
