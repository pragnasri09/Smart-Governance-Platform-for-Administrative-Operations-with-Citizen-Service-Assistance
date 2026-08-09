const loginForm = document.getElementById("adminLoginForm");

loginForm.addEventListener("submit", function(event) {

    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "admin@civicpulse.com" && password === "admin123") {

        document.getElementById("loginMessage").textContent =
            "Login successful!";

    } else {

        document.getElementById("loginMessage").textContent =
            "Invalid email or password.";
    }
});