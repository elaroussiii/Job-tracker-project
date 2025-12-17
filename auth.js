// ========== CONFIGURATION ==========
const USERS_API_URL = "https://69428fb069b12460f311dc56.mockapi.io/users";
const DASHBOARD_URL = "index.html"; // L'URL de ton tableau de bord

// ========== DOM ELEMENTS ==========
const authTitle = document.getElementById("authTitle");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const showSignupLink = document.getElementById("showSignup");
const showLoginLink = document.getElementById("showLogin");

// Login inputs
const loginEmailInput = document.getElementById("loginEmail");
const loginPasswordInput = document.getElementById("loginPassword");

// Signup inputs
const signupEmailInput = document.getElementById("signupEmail");
const signupPasswordInput = document.getElementById("signupPassword");
const confirmPasswordInput = document.getElementById("confirmPassword");

// ========== FUNCTIONS ==========

/**
 * Affiche le formulaire de connexion et cache celui d'inscription.
 */
function showLoginForm() {
  authTitle.textContent = "Login";
  loginForm.classList.add("active");
  signupForm.classList.remove("active");
}

/**
 * Affiche le formulaire d'inscription et cache celui de connexion.
 */
function showSignupForm() {
  authTitle.textContent = "Sign Up";
  signupForm.classList.add("active");
  loginForm.classList.remove("active");
}

/**
 * Gère la connexion de l'utilisateur.
 */
async function handleLogin(event) {
  event.preventDefault();

  const email = loginEmailInput.value.trim();
  const password = loginPasswordInput.value.trim();

  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }

  try {
    const response = await fetch(USERS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();

    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", user.email); // Stocke l'email pour affichage si besoin
      window.location.href = DASHBOARD_URL; // Redirige vers le tableau de bord
    } else {
      alert("Invalid email or password.");
    }
  } catch (error) {
    console.error("Login error:", error);
    alert("Login failed. Please try again later.");
  }
}

/**
 * Gère l'inscription de l'utilisateur.
 */
async function handleSignup(event) {
  event.preventDefault();

  const email = signupEmailInput.value.trim();
  const password = signupPasswordInput.value.trim();
  const confirmPassword = confirmPasswordInput.value.trim();

  if (!email || !password || !confirmPassword) {
    alert("Please fill in all fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  try {
    const response = await fetch(USERS_API_URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const users = await response.json();

    // Vérifie si l'email existe déjà
    if (users.some((u) => u.email === email)) {
      alert("An account with this email already exists. Please login.");
      return;
    }

    // Crée un nouvel utilisateur
    const newUser = { email, password }; // ATTENTION: Mot de passe non haché pour MockAPI simple
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

    alert("Account created successfully! Please login.");
    showLoginForm(); // Affiche le formulaire de connexion après l'inscription
    loginEmailInput.value = email; // Pré-remplit l'email
  } catch (error) {
    console.error("Signup error:", error);
    alert("Signup failed. Please try again later.");
  }
}

// ========== EVENT LISTENERS ==========

document.addEventListener("DOMContentLoaded", () => {
  // Affiche le formulaire de connexion par défaut
  showLoginForm();

  // Bascule entre connexion et inscription
  showSignupLink.addEventListener("click", (e) => {
    e.preventDefault();
    showSignupForm();
  });
  showLoginLink.addEventListener("click", (e) => {
    e.preventDefault();
    showLoginForm();
  });

  // Soumission des formulaires
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);
});
