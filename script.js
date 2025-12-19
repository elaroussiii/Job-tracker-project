// URL de l'API MockAPI pour gérer les candidatures
const API_URL = "https://69428fb069b12460f311dc56.mockapi.io/applications";

// ==== STATE ====
// Tableau contenant toutes les candidatures chargées depuis l'API
let applications = [];
// Filtre actuel pour afficher les candidatures (par défaut : toutes)
let currentFilter = "all";
// ID de la candidature en cours d'édition (null si création)
let editingId = null;

// ==== DOM ELEMENTS ====
// Conteneur principal où les cartes de candidatures sont affichées
const applicationsGrid = document.getElementById("applicationsGrid");
// Menu déroulant pour filtrer les candidatures par statut
const statusFilter = document.getElementById("statusFilter");
// Bouton pour ouvrir le modal d'ajout de candidature
const addApplicationBtn = document.getElementById("addApplicationBtn");

// Éléments du modal (fenêtre popup)
const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelModalBtn = document.getElementById("cancelModalBtn");
const applicationForm = document.getElementById("applicationForm");

// Champs du formulaire de candidature
const companyInput = document.getElementById("companyInput");
const positionInput = document.getElementById("positionInput");
const contractInput = document.getElementById("contractInput");
const statusInput = document.getElementById("statusInput");
const applyDateInput = document.getElementById("applyDateInput");
const interviewDateInput = document.getElementById("interviewDateInput");
const offerLinkInput = document.getElementById("offerLinkInput");
const notesInput = document.getElementById("notesInput");

// Éléments d'affichage des statistiques
const statSent = document.getElementById("statSent");
const statInterview = document.getElementById("statInterview");
const statRejected = document.getElementById("statRejected");
const statAccepted = document.getElementById("statAccepted");

// ==== API FUNCTIONS ====

// Charge toutes les candidatures depuis l'API et les affiche
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

// Crée une nouvelle candidature via l'API
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

// Met à jour une candidature existante via l'API
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

// Supprime une candidature après confirmation de l'utilisateur
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

// ==== MODAL FUNCTIONS ====

// Ouvre le modal en mode création ou édition
function openModal(isEdit = false, app = null) {
  if (isEdit && app) {
    // Mode édition : pré-remplit le formulaire avec les données existantes
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
    // Mode création : réinitialise le formulaire avec la date du jour
    modalTitle.textContent = "Add New Application";
    editingId = null;
    applicationForm.reset();
    applyDateInput.value = new Date().toISOString().split("T")[0];
  }

  modal.classList.add("active");
}

// Ferme le modal et réinitialise le formulaire
function closeModal() {
  modal.classList.remove("active");
  applicationForm.reset();
  editingId = null;
}

// ==== RENDER FUNCTIONS ====

// Affiche les candidatures filtrées sous forme de cartes
function renderApplications() {
  const list = applications.filter((app) => {
    return currentFilter === "all" || app.status === currentFilter;
  });

  applicationsGrid.innerHTML = "";

  // Si aucune candidature ne correspond au filtre
  if (list.length === 0) {
    applicationsGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: white; font-size: 18px;">
        📭 No applications found. Add your first one!
      </div>
    `;
    updateStats();
    return;
  }

  // Génère une carte pour chaque candidature
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
          <span class="contract-badge">${escapeHtml(app.contractType)}</span>
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
          <span class="info-value">${formatDate(app.interviewDate)}</span>
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

    // Attache les événements aux boutons d'édition et de suppression
    const editBtn = card.querySelector(".btn-edit");
    const deleteBtn = card.querySelector(".btn-delete");

    editBtn.addEventListener("click", () => openModal(true, app));
    deleteBtn.addEventListener("click", () => deleteApplication(app.id));

    applicationsGrid.appendChild(card);
  });

  updateStats();
}

// Met à jour les compteurs de statistiques selon les statuts
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

// ==== UTILITY FUNCTIONS ====

// Affiche ou masque l'indicateur de chargement
function showLoading(show) {
  if (show) {
    applicationsGrid.style.opacity = "0.5";
    applicationsGrid.style.pointerEvents = "none";
  } else {
    applicationsGrid.style.opacity = "1";
    applicationsGrid.style.pointerEvents = "auto";
  }
}

// Formate une date au format "DD MMM YYYY"
function formatDate(dateString) {
  if (!dateString) return "";
  const d = new Date(dateString);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Met en majuscule la première lettre d'une chaîne
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Échappe les caractères HTML pour éviter les injections XSS
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// ==== EVENT LISTENERS ====

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  // Définit la date du jour par défaut dans le champ de date de candidature
  applyDateInput.value = new Date().toISOString().split("T")[0];

  // Charge les candidatures depuis l'API
  loadApplications();

  // Ouvre le modal pour ajouter une nouvelle candidature
  addApplicationBtn.addEventListener("click", () => openModal(false));

  // Ferme le modal via les boutons de fermeture
  closeModalBtn.addEventListener("click", closeModal);
  cancelModalBtn.addEventListener("click", closeModal);

  // Ferme le modal si l'utilisateur clique en dehors de la fenêtre
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Applique le filtre sélectionné et réaffiche les candidatures
  statusFilter.addEventListener("change", (e) => {
    currentFilter = e.target.value;
    renderApplications();
  });

  // Gère la soumission du formulaire (création ou mise à jour)
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

  const logoutButton = document.getElementById("logout-button");
  if (logoutButton) {
    if (localStorage.getItem("isLoggedIn") === "true") {
      logoutButton.style.display = "inline-flex";
    } else {
      logoutButton.style.display = "none";
    }

    logoutButton.addEventListener("click", logout);
  }
});

// Déconnecte l'utilisateur et le redirige vers la page d'authentification
function logout() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userEmail");
  window.location.href = "auth.html";
}

// =====================
// ADZUNA JOB SEARCH
// =====================

// Éléments du formulaire de recherche d'emplois
const searchWhatInput = document.getElementById("searchWhat");
const searchWhereInput = document.getElementById("searchWhere");
const searchContractInput = document.getElementById("searchContract");
const searchJobsBtn = document.getElementById("searchJobsBtn");
const jobResultsContainer = document.getElementById("jobResults");

// URL de l'API backend pour rechercher des offres d'emploi via Adzuna
const JOB_SEARCH_API = "http://localhost:3001/api/jobs/search";

// Affiche les résultats de recherche d'emplois sous forme de cartes
function renderJobResults(jobs) {
  jobResultsContainer.innerHTML = "";

  if (!jobs || jobs.length === 0) {
    jobResultsContainer.innerHTML =
      '<div style="grid-column: 1/-1; color: white; padding: 1rem;">No jobs found.</div>';
    return;
  }

  jobs.forEach((job) => {
    const card = document.createElement("div");
    card.className = "job-result-card";

    const company = job.company?.display_name || "Unknown company";
    const title = job.title || "No title";
    const location = job.location?.display_name || "Unknown location";
    const contract = job.contract_type || "";
    const url = job.redirect_url || "#";

    card.innerHTML = `
      <div class="job-result-header">
        <h4>${escapeHtml(title)}</h4>
        <span class="job-company">${escapeHtml(company)}</span>
      </div>
      <div class="job-result-body">
        <p class="job-location">📍 ${escapeHtml(location)}</p>
        <p class="job-contract">📄 Contract: ${escapeHtml(
          contract || "N/A"
        )}</p>
      </div>
      <div class="job-result-footer">
        <a href="${escapeHtml(
          url
        )}" target="_blank" class="btn-small">View Offer</a>
        <button class="btn-small btn-import">Import to Tracker</button>
      </div>
    `;

    // Bouton pour importer l'offre dans le tracker de candidatures
    const importBtn = card.querySelector(".btn-import");
    importBtn.addEventListener("click", () => {
      // Pré-remplit le formulaire avec les données de l'offre
      companyInput.value = company;
      positionInput.value = title;

      // Convertit le type de contrat Adzuna vers les valeurs du formulaire
      if (contract === "intern" || contract === "internship") {
        contractInput.value = "Internship";
      } else if (contract === "permanent") {
        contractInput.value = "CDI";
      } else if (contract === "contract") {
        contractInput.value = "CDD";
      } else {
        contractInput.value = "Freelance";
      }

      offerLinkInput.value = url;
      statusInput.value = "sent";
      applyDateInput.value = new Date().toISOString().split("T")[0];

      openModal(false);
    });

    jobResultsContainer.appendChild(card);
  });
}

// Effectue une recherche d'emplois via l'API backend
async function searchJobs() {
  const what = searchWhatInput.value.trim() || "developer";
  const where = searchWhereInput.value.trim() || "Paris";
  const contract = searchContractInput.value;

  try {
    jobResultsContainer.innerHTML =
      '<div style="grid-column: 1/-1; color: white; padding: 1rem;">Loading jobs...</div>';

    const params = new URLSearchParams({ what, where });
    if (contract) params.append("contract", contract);

    const response = await fetch(`${JOB_SEARCH_API}?${params.toString()}`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }

    const data = await response.json();
    const jobs = data.results || [];
    renderJobResults(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    jobResultsContainer.innerHTML =
      '<div style="grid-column: 1/-1; color: red; padding: 1rem;">Error loading jobs.</div>';
  }
}

// Lance la recherche d'emplois au clic sur le bouton
if (searchJobsBtn) {
  searchJobsBtn.addEventListener("click", searchJobs);
}
