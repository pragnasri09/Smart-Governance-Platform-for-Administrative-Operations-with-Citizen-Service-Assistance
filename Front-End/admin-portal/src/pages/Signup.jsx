import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [role, setRole] = useState("citizen");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!form.email.toLowerCase().endsWith("@gmail.com")) {
      alert("Please use a valid Gmail address.");
      return;
    }

    if (form.password.length < 8) {
      alert("Password must contain at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (role === "staff" && !form.department) {
      alert("Please select your department.");
      return;
    }

    const existingUsers =
      JSON.parse(localStorage.getItem("civicpulseUsers")) || [];

    const alreadyExists = existingUsers.some(
      (user) => user.email.toLowerCase() === form.email.toLowerCase()
    );

    if (alreadyExists) {
      alert("An account with this email already exists.");
      return;
    }

    const newUser = {
      id: `USR-${Date.now().toString().slice(-6)}`,
      name: form.name,
      email: form.email,
      password: form.password,
      role: role,
      department: role === "staff" ? form.department : null,
    };

    localStorage.setItem(
      "civicpulseUsers",
      JSON.stringify([...existingUsers, newUser])
    );

    alert("Account created successfully. Please login.");

    navigate("/");
  };

  return (
    <div className="signup-page">

      <div className="signup-left">

        <div className="signup-brand">
          <div className="brand-mark">CP</div>

          <div>
            <h2>CivicPulse</h2>
            <span>Smart Government Management Platform</span>
          </div>
        </div>

        <div className="signup-intro">
          <span className="eyebrow">JOIN CIVICPULSE</span>

          <h1>
            One platform.
            <br />
            Better public services.
          </h1>

          <p>
            Create your CivicPulse account to report civic issues,
            track complaints, or manage department responsibilities.
          </p>

          <div className="signup-points">
            <div>
              <strong>01</strong>
              <span>Citizens can submit and track complaints.</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Department staff can manage assigned complaints.</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Role-based access keeps each workspace organized.</span>
            </div>
          </div>
        </div>

      </div>

      <div className="signup-right">

        <div className="signup-card">

          <div className="signup-heading">
            <span className="eyebrow">CREATE ACCOUNT</span>

            <h1>Join CivicPulse</h1>

            <p>
              Choose your account type and enter your details.
            </p>
          </div>

          <div className="role-selector">

            <button
              type="button"
              className={role === "citizen" ? "role-active" : ""}
              onClick={() => setRole("citizen")}
            >
              <strong>Citizen</strong>
              <span>Report civic issues</span>
            </button>

            <button
              type="button"
              className={role === "staff" ? "role-active" : ""}
              onClick={() => setRole("staff")}
            >
              <strong>Department Staff</strong>
              <span>Resolve complaints</span>
            </button>

          </div>

          <form onSubmit={handleSubmit}>

            <div className="signup-field">
              <label>Full name *</label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="signup-field">
              <label>Gmail address *</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            {role === "staff" && (
              <div className="signup-field">
                <label>Department *</label>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                >
                  <option value="">Select department</option>
                  <option value="Water Supply">
                    Water Supply
                  </option>
                  <option value="Electricity">
                    Electricity
                  </option>
                  <option value="Roads">
                    Roads & Infrastructure
                  </option>
                  <option value="Sanitation">
                    Sanitation
                  </option>
                  <option value="Waste Management">
                    Waste Management
                  </option>
                  <option value="Public Health">
                    Public Health
                  </option>
                </select>
              </div>
            )}

            <div className="signup-two-columns">

              <div className="signup-field">
                <label>Password *</label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Minimum 8 characters"
                />
              </div>

              <div className="signup-field">
                <label>Confirm password *</label>

                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                />
              </div>

            </div>

            <button
              type="submit"
              className="signup-submit"
            >
              Create Account →
            </button>

          </form>

          <div className="login-link">
            Already have an account?
            <button onClick={() => navigate("/")}>
              Sign in
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;