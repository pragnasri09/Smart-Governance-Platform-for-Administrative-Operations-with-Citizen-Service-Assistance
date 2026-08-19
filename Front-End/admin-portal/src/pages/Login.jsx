import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const demoAccounts = {
  citizen: {
    email: "citizen@gmail.com",
    password: "Citizen@123",
  },
  staff: {
    email: "staff@gmail.com",
    password: "Staff@123",
  },
  admin: {
    email: "admin@gmail.com",
    password: "Admin@123",
  },
};

function Login() {
  const navigate = useNavigate();

  const [role, setRole] = useState("citizen");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith("@gmail.com")) {
      setError("Please use a valid Gmail address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Check registered citizen/staff accounts
    const registeredUsers =
      JSON.parse(localStorage.getItem("civicpulseUsers")) || [];

    const registeredUser = registeredUsers.find(
      (user) =>
        user.email.toLowerCase() === cleanEmail &&
        user.password === password &&
        user.role === role
    );

    // Demo accounts
    const demoAccount = demoAccounts[role];

    const validDemo =
      cleanEmail === demoAccount.email &&
      password === demoAccount.password;

    if (!registeredUser && !validDemo) {
      setError("Invalid email or password.");
      return;
    }

    const loggedInUser = registeredUser || {
      name:
        role === "admin"
          ? "System Administrator"
          : role === "staff"
          ? "Department Staff"
          : "CivicPulse Citizen",
      email: cleanEmail,
      role,
    };

    localStorage.setItem(
      "civicpulseSession",
      JSON.stringify(loggedInUser)
    );

    if (role === "admin") {
      navigate("/admin/dashboard");
    } else if (role === "staff") {
      navigate("/department/dashboard");
    } else {
      navigate("/citizen/dashboard");
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-intro">
        <div className="brand">
          <div className="brand-mark">CP</div>

          <div>
            <h2>CivicPulse</h2>
            <span>Smart Government Platform</span>
          </div>
        </div>

        <div className="intro-content">
          <span className="eyebrow">SMART GOVERNANCE</span>

          <h1>
            Better services.
            <br />
            Connected
            <br />
            communities.
          </h1>

          <p>
            A centralized platform for managing citizen complaints,
            coordinating departments and improving public service delivery.
          </p>

          <div className="feature-list">
            <div>
              <strong>01</strong>
              <section>
                <b>Role-based access</b>
                <span>Secure access for citizens, staff and administrators.</span>
              </section>
            </div>

            <div>
              <strong>02</strong>
              <section>
                <b>Complaint management</b>
                <span>Track issues from submission to resolution.</span>
              </section>
            </div>

            <div>
              <strong>03</strong>
              <section>
                <b>Department coordination</b>
                <span>Connect departments and improve response times.</span>
              </section>
            </div>
          </div>
        </div>

        <small>© 2026 CivicPulse</small>
      </section>

      <section className="auth-panel">
        <div className="login-card">
          <span className="eyebrow">AUTHORIZED ACCESS</span>

          <h1>Welcome back.</h1>

          <p className="login-description">
            Sign in to access your CivicPulse workspace.
          </p>

          <div className="role-tabs">
            <button
              type="button"
              className={role === "citizen" ? "active" : ""}
              onClick={() => {
                setRole("citizen");
                setError("");
              }}
            >
              Citizen
            </button>

            <button
              type="button"
              className={role === "staff" ? "active" : ""}
              onClick={() => {
                setRole("staff");
                setError("");
              }}
            >
              Department Staff
            </button>

            <button
              type="button"
              className={role === "admin" ? "active" : ""}
              onClick={() => {
                setRole("admin");
                setError("");
              }}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin}>
            <label>Email address</label>

            <input
              type="email"
              placeholder="yourname@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="password-label">
              <label>Password</label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && <div className="form-error">{error}</div>}

            <button className="primary-button" type="submit">
              Sign in securely
              <span>→</span>
            </button>
          </form>

          {role !== "admin" && (
            <p className="signup-text">
              New to CivicPulse?{" "}
              <button
  type="button"
  className="create-account-link"
  onClick={() => navigate("/signup")}
>
  Create an account
</button>
                
              
            </p>
          )}

          {role === "admin" && (
            <p className="admin-note">
              Administrator accounts are created by the CivicPulse
              organization.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default Login;