const API = "/api/complaints";

let complaints = [];

const statuses = [
    "SUBMITTED",
    "VERIFIED",
    "ASSIGNED",
    "IN_PROGRESS",
    "RESOLVED",
    "CLOSED"
];

const departments = {
    1: "Roads & Infrastructure",
    2: "Water Supply",
    3: "Electrical Services",
    4: "Sanitation & Waste",
    5: "Public Health",
    6: "Parks & Environment",
    7: "General Administration"
};


// ===============================
// NAVIGATION
// ===============================

function showDashboard() {

    document.getElementById("dashboardView")
        .classList.remove("hidden");

    document.getElementById("detailsView")
        .classList.add("hidden");

    document.getElementById("createView")
        .classList.add("hidden");

    document.getElementById("pageTitle")
        .textContent = "Complaint Management";

    loadDashboard();
}


function showCreateComplaint() {

    document.getElementById("dashboardView")
        .classList.add("hidden");

    document.getElementById("detailsView")
        .classList.add("hidden");

    document.getElementById("createView")
        .classList.remove("hidden");

    document.getElementById("pageTitle")
        .textContent = "Create Complaint";
}


// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        const response = await fetch(API);

        if (!response.ok) {
            throw new Error("Unable to load complaints");
        }

        complaints = await response.json();

        updateStatistics();

        renderComplaints();

    } catch (error) {

        console.error(error);

        showToast(
            "Unable to connect to CivicPulse backend"
        );

        document.getElementById(
            "complaintsContainer"
        ).innerHTML = `
            <div class="empty">
                Backend connection failed.<br>
                Make sure Spring Boot is running.
            </div>
        `;
    }
}


// ===============================
// STATISTICS
// ===============================

function updateStatistics() {

    const total = complaints.length;

    const pending = complaints.filter(c =>
        c.status === "SUBMITTED" ||
        c.status === "VERIFIED"
    ).length;

    const progress = complaints.filter(c =>
        c.status === "ASSIGNED" ||
        c.status === "IN_PROGRESS"
    ).length;

    const resolved = complaints.filter(c =>
        c.status === "RESOLVED" ||
        c.status === "CLOSED"
    ).length;


    document.getElementById("totalCount")
        .textContent = total;

    document.getElementById("pendingCount")
        .textContent = pending;

    document.getElementById("progressCount")
        .textContent = progress;

    document.getElementById("resolvedCount")
        .textContent = resolved;
}


// ===============================
// COMPLAINT LIST
// ===============================

function renderComplaints() {

    const container =
        document.getElementById(
            "complaintsContainer"
        );

    if (complaints.length === 0) {

        container.innerHTML = `
            <div class="empty">
                No complaints found.
            </div>
        `;

        return;
    }


    container.innerHTML = complaints
        .map(complaint => `

            <div class="complaint-card">

                <div class="complaint-main">

                    <div>
                        <div class="complaint-number">
                            ${escapeHtml(
                                complaint.complaintNumber
                                || "CP-" + complaint.id
                            )}
                        </div>

                        <div class="complaint-title">
                            ${escapeHtml(
                                complaint.title
                            )}
                        </div>

                        <div class="complaint-category">
                            ${escapeHtml(
                                complaint.category
                            )}
                            · Citizen #${complaint.citizenId}
                        </div>
                    </div>

                </div>


                <div class="card-right">

                    <span class="badge priority-${complaint.priority}">
                        ${formatStatus(complaint.priority)}
                    </span>

                    <span class="badge status-${complaint.status}">
                        ${formatStatus(complaint.status)}
                    </span>

                    <button
                        class="secondary-btn"
                        onclick="showComplaint(${complaint.id})">
                        View
                    </button>

                </div>

            </div>

        `)
        .join("");
}


// ===============================
// SHOW COMPLAINT
// ===============================

async function showComplaint(id) {

    try {

        const response =
            await fetch(`${API}/${id}`);

        if (!response.ok) {
            throw new Error("Complaint not found");
        }

        const complaint =
            await response.json();

        renderComplaintDetails(complaint);

        document.getElementById("dashboardView")
            .classList.add("hidden");

        document.getElementById("createView")
            .classList.add("hidden");

        document.getElementById("detailsView")
            .classList.remove("hidden");

        document.getElementById("pageTitle")
            .textContent = "Complaint Details";

    } catch (error) {

        showToast(error.message);

    }
}


// ===============================
// COMPLAINT DETAILS
// ===============================

function getDepartmentName(id) {
    return departments[id] || "Unknown Department";
}

function renderComplaintDetails(complaint) {

    const currentIndex =
        statuses.indexOf(complaint.status);


    const timeline =
        statuses.map((status, index) => {

            let state = "";

            if (index < currentIndex) {
                state = "completed";
            }

            if (index === currentIndex) {
                state = "current";
            }

            return `
                <div class="timeline-item ${state}">

                    <div class="timeline-dot"></div>

                    <div class="timeline-line"></div>

                    <div class="timeline-content">

                        <strong>
                            ${formatStatus(status)}
                        </strong>

                        <span>
                            ${
                                index < currentIndex
                                ? "Completed"
                                : index === currentIndex
                                ? "Current status"
                                : "Pending"
                            }
                        </span>

                    </div>

                </div>
            `;

        }).join("");


    document.getElementById(
        "complaintDetails"
    ).innerHTML = `

        <div class="details-card">

            <div class="details-header">

                <div>

                    <p class="eyebrow">
                        ${escapeHtml(
                            complaint.complaintNumber
                            || "CP-" + complaint.id
                        )}
                    </p>

                    <h2>
                        ${escapeHtml(
                            complaint.title
                        )}
                    </h2>

                    <p class="details-subtitle">
                        ${escapeHtml(
                            complaint.description
                        )}
                    </p>

                </div>

                <div>

                    <span class="badge priority-${complaint.priority}">
                        ${formatStatus(complaint.priority)}
                    </span>

                    <span class="badge status-${complaint.status}">
                        ${formatStatus(complaint.status)}
                    </span>

                </div>

            </div>


            <div class="info-grid">

                <div class="info-item">
                    <span>Citizen</span>
                    <strong>#${complaint.citizenId}</strong>
                </div>

                <div class="info-item">
                    <span>Category</span>
                    <strong>${formatStatus(
                        complaint.category
                    )}</strong>
                </div>

                <div class="info-item">
                    <span>Department</span>
                    <strong>
                        ${
                            complaint.assignedDepartmentId
                            ? getDepartmentName(complaint.assignedDepartmentId)
                            : "Not Assigned"
                        }
                    </strong>
                </div>

                <div class="info-item">
                    <span>Latitude</span>
                    <strong>
                        ${complaint.latitude ?? "N/A"}
                    </strong>
                </div>

                <div class="info-item">
                    <span>Longitude</span>
                    <strong>
                        ${complaint.longitude ?? "N/A"}
                    </strong>
                </div>

                <div class="info-item">
                    <span>Created</span>
                    <strong>
                        ${formatDate(
                            complaint.createdAt
                        )}
                    </strong>
                </div>

            </div>


            <div class="timeline">

                <h3>Complaint Lifecycle</h3>

                ${timeline}

            </div>


            <div class="action-bar">

                ${statusButtons(complaint)}

            </div>

        </div>
    `;
}


// ===============================
// STATUS BUTTONS
// ===============================

function statusButtons(complaint) {

    const currentIndex =
        statuses.indexOf(complaint.status);

    const nextStatus =
        statuses[currentIndex + 1];


    let html = "";


    if (nextStatus) {

        html += `
            <button
                class="primary-btn"
                onclick="changeStatus(
                    ${complaint.id},
                    '${nextStatus}'
                )">

                Move to ${formatStatus(nextStatus)}

            </button>
        `;
    }


    if (
        complaint.status === "VERIFIED"
    ) {

        html += `

            <select id="departmentSelect">

                <option value="">
                    Select Department
                </option>

                <option value="1">
                    Roads & Infrastructure
                </option>

                <option value="2">
                    Water Supply
                </option>

                <option value="3">
                    Electrical Services
                </option>

                <option value="4">
                    Sanitation & Waste
                </option>

                <option value="5">
                    Public Health
                </option>

                <option value="6">
                    Parks & Environment
                </option>

                <option value="7">
                    General Administration
                </option>

            </select>


            <button
                class="secondary-btn"
                onclick="assignComplaint(
                    ${complaint.id}
                )">

                Assign Department

            </button>

        `;
    }


    return html;
}


// ===============================
// CHANGE STATUS
// ===============================

async function changeStatus(
    complaintId,
    newStatus
) {

    try {

        const response = await fetch(
            `${API}/${complaintId}/status?status=${newStatus}`,
            {
                method: "PUT"
            }
        );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(
                error || "Status update failed"
            );
        }


        showToast(
            `Complaint moved to ${formatStatus(newStatus)}`
        );

        await showComplaint(complaintId);

    } catch (error) {

        showToast(error.message);

    }
}


// ===============================
// ASSIGN DEPARTMENT
// ===============================

async function assignComplaint(
    complaintId
) {

    const select =
        document.getElementById(
            "departmentSelect"
        );

    const departmentId =
        select.value;


    if (!departmentId) {

        showToast(
            "Please select a department"
        );

        return;
    }


    const request = {

        departmentId:
            Number(departmentId),

        // Temporary demo value.
        // Later this comes from authentication.
        assignedBy: 23
    };


    try {

        const response = await fetch(
            `${API}/${complaintId}/assign`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify(request)
            }
        );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(
                error || "Assignment failed"
            );
        }


        showToast(
            "Complaint assigned successfully"
        );

        await showComplaint(complaintId);

    } catch (error) {

        showToast(error.message);

    }
}


// ===============================
// CREATE COMPLAINT
// ===============================

document.getElementById(
    "complaintForm"
).addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        const complaint = {

            // Temporary demo citizen.
            // Later this comes from login.
            citizenId: 101,

            title:
                document.getElementById(
                    "title"
                ).value,

            description:
                document.getElementById(
                    "description"
                ).value,

            category:
                document.getElementById(
                    "category"
                ).value,

            priority:
                document.getElementById(
                    "priority"
                ).value,

            latitude:
                getNumber(
                    "latitude"
                ),

            longitude:
                getNumber(
                    "longitude"
                )
        };


        try {

            const response = await fetch(
                API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            complaint
                        )
                }
            );


            if (!response.ok) {

                const error =
                    await response.text();

                throw new Error(
                    error || "Failed to create complaint"
                );
            }


            const created =
                await response.json();


            showToast(
                `Complaint ${
                    created.complaintNumber
                    || "created"
                } successfully`
            );


            document.getElementById(
                "complaintForm"
            ).reset();


            showDashboard();

        } catch (error) {

            showToast(error.message);

        }

    }
);


// ===============================
// HELPERS
// ===============================

function formatStatus(value) {

    if (!value) {
        return "N/A";
    }

    return value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g,
            letter => letter.toUpperCase()
        );
}


function formatDate(value) {

    if (!value) {
        return "N/A";
    }

    return new Date(value)
        .toLocaleString();
}


function getNumber(id) {

    const value =
        document.getElementById(id).value;

    return value
        ? Number(value)
        : null;
}


function escapeHtml(value) {

    if (value === null ||
        value === undefined) {

        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

    }, 3000);
}


// ===============================
// START
// ===============================

loadDashboard();