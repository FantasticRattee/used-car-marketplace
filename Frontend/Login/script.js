import { initPage, api, icon, el, saveSession, flash, safeNextPath } from "/shared/app.js";

initPage();

const form = document.getElementById("login-form");
const username = document.getElementById("username");
const password = document.getElementById("password");
const toggle = document.getElementById("toggle-password");
const submit = document.getElementById("login-submit");
const errorBox = document.getElementById("login-error");
const next = safeNextPath(new URLSearchParams(location.search).get("next"));

// Show / hide password.
function setPasswordVisible(visible) {
  password.type = visible ? "text" : "password";
  toggle.setAttribute("aria-pressed", String(visible));
  toggle.setAttribute("aria-label", visible ? "Hide password" : "Show password");
  toggle.replaceChildren(icon(visible ? "eyeOff" : "eye"));
}
setPasswordVisible(false);
toggle.addEventListener("click", () => {
  setPasswordVisible(password.type === "password");
  password.focus();
});

function showError(message, field) {
  errorBox.replaceChildren(icon("alert"), el("span", { text: message }));
  errorBox.hidden = false;
  for (const input of [username, password]) input.removeAttribute("aria-invalid");
  if (field) {
    field.setAttribute("aria-invalid", "true");
    field.focus();
  }
}

form.addEventListener("input", () => {
  errorBox.hidden = true;
  username.removeAttribute("aria-invalid");
  password.removeAttribute("aria-invalid");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!username.value.trim()) return showError("Enter your username.", username);
  if (!password.value) return showError("Enter your password.", password);

  submit.disabled = true;
  submit.textContent = "Logging in…";
  try {
    const session = await api("/api/login", {
      method: "POST",
      body: { username: username.value.trim(), password: password.value },
    });
    saveSession(session);
    flash(`Logged in as ${session.username}.`);
    location.href = next;
  } catch (err) {
    password.value = "";
    showError(err.status === 401 ? "Incorrect username or password. Check both and try again." : err.message, err.status === 401 ? password : null);
    submit.disabled = false;
    submit.textContent = "Log in";
  }
});

username.focus();
