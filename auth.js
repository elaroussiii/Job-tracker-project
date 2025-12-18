// URL de l'API MockAPI pour gérer les utilisateurs (email + mot de passe)
const USERS_API_URL = "https://69428fb069b12460f311dc56.mockapi.io/users";
// URL de redirection après connexion réussie
const DASHBOARD_URL = "index.html";

// Titre dynamique qui change entre "Login" et "Sign Up"
const authTitle = document.getElementById("authTitle");
// Formulaires de connexion et d'inscription
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
// Liens pour basculer entre les deux formulaires
const showSignupLink = document.getElementById("showSignup");
const showLoginLink = document.getElementById("showLogin");

// Champs du formulaire de connexion
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");

// Champs du formulaire d'inscription
const signupEmailInput = document.getElementById("signupEmail");
const signupPasswordInput = document.getElementById("signupPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

// ========== FUNCTIONS ==========

// Affiche le formulaire de connexion et masque celui d'inscription
function showLoginForm() {
  authTitle.textContent = "Login";
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
}

// Affiche le formulaire d'inscription et masque celui de connexion
function showSignupForm() {
  authTitle.textContent = "Sign Up";
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
}

// Gère la soumission du formulaire de connexion
async function handleLogin(event) {
  event.preventDefault();

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value.trim();

  // Validation basique des champs
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    // Récupère tous les utilisateurs depuis l'API
    const response = await fetch(USERS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();

    // Recherche un utilisateur correspondant à l'email et au mot de passe
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      // Stocke l'état de connexion et l'email dans le localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email);
      // Redirige vers le tableau de bord principal
      window.location.href = DASHBOARD_URL;
    } else {
      alert("Invalid email or password.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again later.");
  }
}

// Gère la soumission du formulaire d'inscription
async function handleSignup(event) {
  event.preventDefault();

  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  // Validation : tous les champs doivent être remplis
  if (!email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  // Validation : les deux mots de passe doivent correspondre
  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    // Récupère tous les utilisateurs pour vérifier si l'email existe déjà
    const response = await fetch(USERS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();

    // Vérifie si un utilisateur avec cet email existe déjà
    if (users.some((u) => u.email === email)) {
      alert("An account with this email already exists. Please login.");
      return;
    }

    // Crée un nouvel utilisateur via l'API
    const newUser = { email, password };
    const createResponse = await fetch(USERS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!createResponse.ok) {
      throw new Error(`HTTP error! status: ${createResponse.status}`);
    }

    // Inscription réussie : bascule vers le formulaire de connexion
    alert("Account created successfully! Please login.");
    showLoginForm();
    loginEmailInput.value = email; // Pré-remplit l'email pour faciliter la connexion
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed. Please try again later.");
  }
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  // Affiche le formulaire de connexion par défaut
  showLoginForm();

  // Liens pour basculer entre les formulaires
  showSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    showSignupForm();
  });
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });

  // Gestion de la soumission des formulaires
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);
});
