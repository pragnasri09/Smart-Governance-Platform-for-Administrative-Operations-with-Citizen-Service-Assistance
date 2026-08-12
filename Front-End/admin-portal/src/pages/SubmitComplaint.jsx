import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SubmitComplaint() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    location: "",
    description: "",
    priority: "Medium",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.title ||
      !form.category ||
      !form.location ||
      !form.description
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    const existingComplaints =
      JSON.parse(localStorage.getItem("civicpulseComplaints")) || [];

    const newComplaint = {
      id: `CMP-${Date.now().toString().slice(-6)}`,
      title: form.title,
      category: form.category,
      location: form.location,
      description: form.description,
      priority: form.priority,
      status: "Submitted",
      date: new Date().toLocaleDateString(),
    };

    localStorage.setItem(
      "civicpulseComplaints",
      JSON.stringify([newComplaint, ...existingComplaints])
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="citizen-page">
        <header className="citizen-header">
          <div className="brand">
            <div className="brand-mark">CP</div>

            <div>
              <h2>CivicPulse</h2>
              <span>Citizen Portal</span>
            </div>
          </div>

          <button
            className="outline-button"
            onClick={() => navigate("/citizen/dashboard")}
          >
            Back to Dashboard
          </button>
        </header>

        <main className="form-page">
          <div className="success-card">
            <div className="success-icon">✓</div>

            <span className="eyebrow">COMPLAINT SUBMITTED</span>

            <h1>Your complaint has been registered.</h1>

            <p>
              Your complaint has been saved successfully. You can track its
              status from the My Complaints section.
            </p>

            <div className="success-actions">
              <button
                className="primary-button"
                onClick={() => navigate("/citizen/complaints")}
              >
                View My Complaints
              </button>

              <button
                className="secondary-button"
                onClick={() => navigate("/citizen/dashboard")}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="citizen-page">
      <header className="citizen-header">
        <div className="brand">
          <div className="brand-mark">CP</div>

          <div>
            <h2>CivicPulse</h2>
            <span>Citizen Portal</span>
          </div>
        </div>

        <button
          className="outline-button"
          onClick={() => navigate("/citizen/dashboard")}
        >
          Back to Dashboard
        </button>
      </header>

      <main className="form-page">
        <div className="page-heading">
          <span className="eyebrow">CITIZEN SERVICES</span>

          <h1>Submit a Complaint</h1>

          <p>
            Report a civic issue and provide the details required for the
            concerned department to take action.
          </p>
        </div>

        <form className="complaint-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-field full">
              <label>Complaint title *</label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Example: Street light not working"
              />
            </div>

            <div className="form-field">
              <label>Category *</label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                <option value="">Select category</option>
                <option value="Water Supply">Water Supply</option>
                <option value="Electricity">Electricity</option>
                <option value="Roads">Roads</option>
                <option value="Sanitation">Sanitation</option>
                <option value="Street Lights">Street Lights</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-field">
              <label>Priority</label>

              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="form-field full">
              <label>Location *</label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Enter the location of the issue"
              />
            </div>

            <div className="form-field full">
              <label>Description *</label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the problem clearly..."
                rows="6"
              />
            </div>
          </div>

          <div className="form-footer">
            <button
              type="button"
              className="secondary-button"
              onClick={() => navigate("/citizen/dashboard")}
            >
              Cancel
            </button>

            <button type="submit" className="primary-button">
              Submit Complaint →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default SubmitComplaint;