document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const data = await res.json();
      const loginTime = Date.now();
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", data.role);
      localStorage.setItem("loginTime", loginTime.toString());

      alert("✅ Login successful!");
      window.location.href = "/homepage";
    } else {
      alert("❌ Incorrect username or password");
    }
  });
});