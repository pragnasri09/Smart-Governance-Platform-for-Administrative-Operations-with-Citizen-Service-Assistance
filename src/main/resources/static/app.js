const COMPLAINT_API = "/api/complaints";
const RESOLUTION_API = "/api/resolutions";

console.log("CivicPulse app.js loaded");

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


let complaints = [];

let currentView = "citizen";


// ======================================================
// NAVIGATION
// ======================================================

function hideAllViews() {

    document
        .getElementById("citizenView")
        .classList.add("hidden");

    document
        .getElementById("officerView")
        .classList.add("hidden");

    document
        .getElementById("detailsView")
        .classList.add("hidden");

    document
        .getElementById("createView")
        .classList.add("hidden");

    document
        .getElementById("createResolutionView")
        .classList.add("hidden");
}


function setActiveRole(role) {

    document
        .getElementById("citizenTab")
        .classList.remove("active");

    document
        .getElementById("officerTab")
        .classList.remove("active");


    document
        .getElementById(role + "Tab")
        .classList.add("active");
}


function setActiveTab(tab) {

    document
        .getElementById("complaintTab")
        .classList.remove("active");

    document
        .getElementById("resolutionTab")
        .classList.remove("active");

    document
        .getElementById(tab)
        .classList.add("active");
}


function showCitizen() {

    currentView = "citizen";

    hideAllViews();

    document
        .getElementById("citizenView")
        .classList.remove("hidden");

    document
        .getElementById("pageTitle")
        .textContent = "Citizen Dashboard";

    setActiveRole("citizen");

    loadCitizenComplaints();
}


function showOfficer() {

    currentView = "officer";

    hideAllViews();

    document
        .getElementById("officerView")
        .classList.remove("hidden");

    document
        .getElementById("pageTitle")
        .textContent = "Officer Dashboard";

    setActiveRole("officer");

    loadOfficerComplaints();
}


function showComplaints() {

    currentModule = "complaints";

    hideAllViews();

    document
        .getElementById("complaintView")
        .classList.remove("hidden");

    document
        .getElementById("pageTitle")
        .textContent = "Complaint Management";

    setActiveTab("complaintTab");

    loadDashboard();
}


function showResolutions() {

    currentModule = "resolutions";

    hideAllViews();

    document
        .getElementById("resolutionView")
        .classList.remove("hidden");

    document
        .getElementById("pageTitle")
        .textContent = "Resolution Management";

    setActiveTab("resolutionTab");

    loadResolutions();
}


async function loadCitizenComplaints() {

    try {

        const response =
            await fetch(COMPLAINT_API);

        if (!response.ok) {
            throw new Error(
                "Unable to load complaints"
            );
        }

        complaints =
            await response.json();


        // Temporary citizen identity
        const citizenId = 101;


        const myComplaints =
            complaints.filter(
                complaint =>
                    complaint.citizenId === citizenId
            );


        updateCitizenStatistics(
            myComplaints
        );


        renderCitizenComplaints(
            myComplaints
        );

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to load complaints"
        );
    }
}


function updateCitizenStatistics(
    complaints
) {

    document
        .getElementById("citizenTotal")
        .textContent =
            complaints.length;


    document
        .getElementById("citizenPending")
        .textContent =
            complaints.filter(c =>
                c.status === "SUBMITTED" ||
                c.status === "VERIFIED"
            ).length;


    document
        .getElementById("citizenProgress")
        .textContent =
            complaints.filter(c =>
                c.status === "ASSIGNED" ||
                c.status === "IN_PROGRESS"
            ).length;


    document
        .getElementById("citizenResolved")
        .textContent =
            complaints.filter(c =>
                c.status === "RESOLVED" ||
                c.status === "CLOSED"
            ).length;
}


function renderCitizenComplaints(
    complaints
) {

    const container =
        document.getElementById(
            "citizenComplaintsContainer"
        );


    if (complaints.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <h3>No complaints yet</h3>

                <p>
                    Report a civic issue to get started.
                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        complaints.map(complaint => `

            <div class="complaint-card">

                <div class="complaint-main">

                    <div>

                        <div class="complaint-number">

                            ${escapeHtml(
                                complaint.complaintNumber
                                ||
                                "CP-" + complaint.id
                            )}

                        </div>


                        <div class="complaint-title">

                            ${escapeHtml(
                                complaint.title
                            )}

                        </div>


                        <div class="complaint-category">

                            ${formatStatus(
                                complaint.category
                            )}

                            ·

                            ${
                                complaint.assignedDepartmentId
                                ? getDepartmentName(
                                    complaint.assignedDepartmentId
                                )
                                : "Department pending"
                            }

                        </div>

                    </div>

                </div>


                <div class="card-right">

                    <span
                        class="badge status-${complaint.status}">

                        ${formatStatus(
                            complaint.status
                        )}

                    </span>


                    <button
                        class="secondary-btn"
                        onclick="showComplaint(
                            ${complaint.id}
                        )">

                        View Details

                    </button>

                </div>

            </div>

        `).join("");
}


async function loadOfficerComplaints() {

    try {

        const response =
            await fetch(COMPLAINT_API);


        if (!response.ok) {

            throw new Error(
                "Unable to load complaints"
            );

        }


        complaints =
            await response.json();


        updateOfficerStatistics(
            complaints
        );


        renderOfficerComplaints(
            complaints
        );

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to load complaints"
        );

    }
}


function updateOfficerStatistics(
    complaints
) {

    document
        .getElementById("officerTotal")
        .textContent =
            complaints.length;


    document
        .getElementById("officerPending")
        .textContent =
            complaints.filter(c =>
                c.status === "SUBMITTED" ||
                c.status === "VERIFIED"
            ).length;


    document
        .getElementById("officerProgress")
        .textContent =
            complaints.filter(c =>
                c.status === "ASSIGNED" ||
                c.status === "IN_PROGRESS"
            ).length;


    document
        .getElementById("officerResolved")
        .textContent =
            complaints.filter(c =>
                c.status === "RESOLVED" ||
                c.status === "CLOSED"
            ).length;
}


function renderOfficerComplaints(
    complaints
) {

    const container =
        document.getElementById(
            "officerComplaintsContainer"
        );


    if (complaints.length === 0) {

        container.innerHTML = `

            <div class="empty">
                No complaints found.
            </div>

        `;

        return;
    }


    container.innerHTML =
        complaints.map(complaint => `

            <div class="complaint-card">

                <div class="complaint-main">

                    <div>

                        <div class="complaint-number">

                            ${escapeHtml(
                                complaint.complaintNumber
                                ||
                                "CP-" + complaint.id
                            )}

                        </div>


                        <div class="complaint-title">

                            ${escapeHtml(
                                complaint.title
                            )}

                        </div>


                        <div class="complaint-category">

                            Citizen #${complaint.citizenId}

                            ·

                            ${formatStatus(
                                complaint.category
                            )}

                            ·

                            ${
                                complaint.assignedDepartmentId
                                ? getDepartmentName(
                                    complaint.assignedDepartmentId
                                )
                                : "Department pending"
                            }

                        </div>

                    </div>

                </div>


                <div class="card-right">

                    <span
                        class="badge priority-${complaint.priority}">

                        ${formatStatus(
                            complaint.priority
                        )}

                    </span>


                    <span
                        class="badge status-${complaint.status}">

                        ${formatStatus(
                            complaint.status
                        )}

                    </span>


                    <button
                        class="secondary-btn"
                        onclick="showComplaint(
                            ${complaint.id}
                        )">

                        Manage

                    </button>

                </div>

            </div>

        `).join("");
}


function showCreateComplaint() {

    hideAllViews();

    document
        .getElementById("createView")
        .classList.remove("hidden");

    document
        .getElementById("pageTitle")
        .textContent = "Create Complaint";

    setActiveTab("complaintTab");
}


function showCreateResolution() {

    hideAllViews();

    document
        .getElementById("createResolutionView")
        .classList.remove("hidden");

    document
        .getElementById("pageTitle")
        .textContent = "Create Resolution";

    setActiveTab("resolutionTab");
}


function refreshCurrentModule() {

    if (currentModule === "complaints") {

        loadDashboard();

    } else {

        loadResolutions();

    }
}


// ======================================================
// COMPLAINT DASHBOARD
// ======================================================

async function loadDashboard() {

    try {

        const response =
            await fetch(COMPLAINT_API);


        if (!response.ok) {

            throw new Error(
                "Unable to load complaints"
            );

        }


        complaints =
            await response.json();


        updateStatistics();

        renderComplaints();

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to connect to backend"
        );

        document
            .getElementById("complaintsContainer")
            .innerHTML = `

                <div class="empty">

                    Backend connection failed.

                    <br>

                    Make sure Spring Boot is running.

                </div>
            `;
    }
}


// ======================================================
// COMPLAINT STATISTICS
// ======================================================

function updateStatistics() {

    const total =
        complaints.length;


    const pending =
        complaints.filter(c =>
            c.status === "SUBMITTED" ||
            c.status === "VERIFIED"
        ).length;


    const progress =
        complaints.filter(c =>
            c.status === "ASSIGNED" ||
            c.status === "IN_PROGRESS"
        ).length;


    const resolved =
        complaints.filter(c =>
            c.status === "RESOLVED" ||
            c.status === "CLOSED"
        ).length;


    document
        .getElementById("totalCount")
        .textContent = total;


    document
        .getElementById("pendingCount")
        .textContent = pending;


    document
        .getElementById("progressCount")
        .textContent = progress;


    document
        .getElementById("resolvedCount")
        .textContent = resolved;
}


// ======================================================
// COMPLAINT LIST
// ======================================================

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


    container.innerHTML =
        complaints.map(complaint => `

            <div class="complaint-card">

                <div class="complaint-main">

                    <div>

                        <div class="complaint-number">

                            ${escapeHtml(
                                complaint.complaintNumber
                                ||
                                "CP-" + complaint.id
                            )}

                        </div>


                        <div class="complaint-title">

                            ${escapeHtml(
                                complaint.title
                            )}

                        </div>


                        <div class="complaint-category">

                            ${formatStatus(
                                complaint.category
                            )}

                            · Citizen #

                            ${complaint.citizenId}

                        </div>

                    </div>

                </div>


                <div class="card-right">

                    <span class="badge priority-${complaint.priority}">

                        ${formatStatus(
                            complaint.priority
                        )}

                    </span>


                    <span class="badge status-${complaint.status}">

                        ${formatStatus(
                            complaint.status
                        )}

                    </span>


                    <button
                        class="secondary-btn"
                        onclick="showComplaint(
                            ${complaint.id}
                        )">

                        View

                    </button>

                </div>

            </div>

        `).join("");
}


// ======================================================
// COMPLAINT DETAILS
// ======================================================

async function showComplaint(id) {

    try {

        const response =
            await fetch(
                `${COMPLAINT_API}/${id}`
            );


        if (!response.ok) {

            throw new Error(
                "Complaint not found"
            );

        }


        const complaint =
            await response.json();


        renderComplaintDetails(
            complaint
        );


        hideAllViews();


        document
            .getElementById("detailsView")
            .classList.remove("hidden");


        document
            .getElementById("pageTitle")
            .textContent =
                "Complaint Details";


        setActiveTab("complaintTab");

    }

    catch (error) {

        showToast(error.message);

    }
}


// ======================================================
// COMPLAINT DETAILS UI
// ======================================================

function renderComplaintDetails(
    complaint
) {

    const currentIndex =
        statuses.indexOf(
            complaint.status
        );


    const timeline =
        statuses.map(
            (status, index) => {

                let state = "";


                if (index < currentIndex) {

                    state = "completed";

                }


                if (index === currentIndex) {

                    state = "current";

                }


                return `

                    <div
                        class="timeline-item ${state}">

                        <div
                            class="timeline-dot">
                        </div>


                        <div
                            class="timeline-line">
                        </div>


                        <div
                            class="timeline-content">

                            <strong>

                                ${formatStatus(
                                    status
                                )}

                            </strong>


                            <span>

                                ${
                                    index <
                                    currentIndex

                                    ? "Completed"

                                    : index ===
                                      currentIndex

                                    ? "Current status"

                                    : "Pending"
                                }

                            </span>

                        </div>

                    </div>

                `;

            }
        ).join("");


    document
        .getElementById(
            "complaintDetails"
        )
        .innerHTML = `

        <div class="details-card">

            <div class="details-header">

                <div>

                    <p class="eyebrow">

                        ${escapeHtml(
                            complaint.complaintNumber
                            ||
                            "CP-" + complaint.id
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

                    <span
                        class="badge priority-${complaint.priority}">

                        ${formatStatus(
                            complaint.priority
                        )}

                    </span>


                    <span
                        class="badge status-${complaint.status}">

                        ${formatStatus(
                            complaint.status
                        )}

                    </span>

                </div>

            </div>


            <div class="info-grid">


                <div class="info-item">

                    <span>
                        Citizen
                    </span>

                    <strong>
                        #${complaint.citizenId}
                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Category
                    </span>

                    <strong>
                        ${formatStatus(
                            complaint.category
                        )}
                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Department
                    </span>

                    <strong>

                        ${
                            complaint.assignedDepartmentId

                            ? getDepartmentName(
                                complaint.assignedDepartmentId
                            )

                            : "Not Assigned"
                        }

                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Latitude
                    </span>

                    <strong>

                        ${complaint.latitude ?? "N/A"}

                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Longitude
                    </span>

                    <strong>

                        ${complaint.longitude ?? "N/A"}

                    </strong>

                </div>


                <div class="info-item">

                    <span>
                        Created
                    </span>

                    <strong>

                        ${formatDate(
                            complaint.createdAt
                        )}

                    </strong>

                </div>

            </div>


            <div class="timeline">

                <h3>
                    Complaint Lifecycle
                </h3>

                ${timeline}

            </div>


            <div class="action-bar">

                ${currentView === "officer"
                    ? statusButtons(complaint)
                    : citizenComplaintActions(complaint)
                }

            </div>

        </div>

    `;
}


// ======================================================
// COMPLAINT ACTIONS
// ======================================================

function citizenComplaintActions(
    complaint
) {

    let html = `

        <button
            class="secondary-btn"
            onclick="showCitizen()">

            ← Back to My Complaints

        </button>

    `;


    if (
        complaint.status === "RESOLVED" ||
        complaint.status === "CLOSED"
    ) {

        html += `

            <div class="resolution-message">

                ✓ This complaint has been resolved.

                <br><br>

                You can view the resolution details
                from your complaint history.

            </div>

        `;

    }


    return html;
}



function statusButtons(
    complaint
) {

    const currentIndex =
        statuses.indexOf(
            complaint.status
        );


    const nextStatus =
        statuses[
            currentIndex + 1
        ];


    let html = "";


    if (nextStatus) {

        html += `

            <button
                class="primary-btn"
                onclick="changeStatus(
                    ${complaint.id},
                    '${nextStatus}'
                )">

                Move to
                ${formatStatus(
                    nextStatus
                )}

            </button>

        `;
    }


    if (
        complaint.status ===
        "VERIFIED"
    ) {

        html += `

            <select
                id="departmentSelect">

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


    if (
        complaint.status ===
        "IN_PROGRESS"
    ) {

        html += `

            <button
                class="primary-btn"
                onclick="showCreateResolutionForComplaint(
                    ${complaint.id}
                )">

                + Create Resolution

            </button>

        `;
    }


    return html;
}


// ======================================================
// CHANGE COMPLAINT STATUS
// ======================================================

async function changeStatus(
    complaintId,
    newStatus
) {

    try {

        const response =
            await fetch(
                `${COMPLAINT_API}/${complaintId}/status?status=${newStatus}`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(
                error ||
                "Status update failed"
            );
        }


        showToast(
            `Complaint moved to ${
                formatStatus(newStatus)
            }`
        );


        await showComplaint(
            complaintId
        );

    }

    catch (error) {

        showToast(
            error.message
        );

    }
}


// ======================================================
// ASSIGN DEPARTMENT
// ======================================================

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

        assignedBy: 23

    };


    try {

        const response =
            await fetch(
                `${COMPLAINT_API}/${complaintId}/assign`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            request
                        )
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(
                error ||
                "Assignment failed"
            );

        }


        showToast(
            "Complaint assigned successfully"
        );


        await showComplaint(
            complaintId
        );

    }

    catch (error) {

        showToast(
            error.message
        );

    }
}


// ======================================================
// CREATE COMPLAINT
// ======================================================

document
    .getElementById("complaintForm")
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const complaint = {

                citizenId: 101,

                title:
                    document
                        .getElementById("title")
                        .value,

                description:
                    document
                        .getElementById("description")
                        .value,

                category:
                    document
                        .getElementById("category")
                        .value,

                priority:
                    document
                        .getElementById("priority")
                        .value,

                latitude:
                    getNumber("latitude"),

                longitude:
                    getNumber("longitude")

            };


            try {

                const response =
                    await fetch(
                        COMPLAINT_API,
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
                        error ||
                        "Failed to create complaint"
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


                document
                    .getElementById(
                        "complaintForm"
                    )
                    .reset();


                showCitizen();

            }

            catch (error) {

                showToast(
                    error.message
                );

            }

        }
    );


// ======================================================
// RESOLUTION MODULE
// ======================================================

async function loadResolutions() {

    /*
     * Your current backend has:
     *
     * GET /api/resolutions/complaint/{complaintId}
     *
     * rather than:
     *
     * GET /api/resolutions
     *
     * So we obtain resolutions by checking the
     * complaints that currently exist.
     */

    try {

        const response =
            await fetch(
                COMPLAINT_API
            );


        if (!response.ok) {

            throw new Error(
                "Unable to load complaints"
            );

        }


        const complaintList =
            await response.json();


        const resolutions = [];


        for (
            const complaint
            of complaintList
        ) {

            try {

                const resolutionResponse =
                    await fetch(
                        `${RESOLUTION_API}/complaint/${complaint.id}`
                    );


                if (
                    resolutionResponse.ok
                ) {

                    const resolution =
                        await resolutionResponse.json();


                    resolutions.push({
                        ...resolution,
                        complaint
                    });

                }

            }

            catch (error) {

                console.log(
                    "No resolution for complaint:",
                    complaint.id
                );

            }

        }


        renderResolutions(
            resolutions
        );


        updateResolutionStatistics(
            resolutions
        );

    }

    catch (error) {

        console.error(error);

        showToast(
            "Unable to load resolutions"
        );

    }
}


// ======================================================
// RESOLUTION STATISTICS
// ======================================================

function updateResolutionStatistics(
    resolutions
) {

    const total =
        resolutions.length;


    const pending =
        resolutions.filter(
            r =>
                r.status ===
                "INITIATED"
        ).length;


    const completed =
        resolutions.filter(
            r =>
                r.status ===
                "COMPLETED"
        ).length;


    const linked =
        new Set(
            resolutions.map(
                r =>
                    r.complaintId
            )
        ).size;


    document
        .getElementById(
            "resolutionTotal"
        )
        .textContent = total;


    document
        .getElementById(
            "resolutionPending"
        )
        .textContent = pending;


    document
        .getElementById(
            "resolutionCompleted"
        )
        .textContent = completed;


    document
        .getElementById(
            "linkedComplaints"
        )
        .textContent = linked;
}


// ======================================================
// RESOLUTION LIST
// ======================================================

function renderResolutions(
    resolutions
) {

    const container =
        document.getElementById(
            "resolutionsContainer"
        );


    if (
        resolutions.length === 0
    ) {

        container.innerHTML = `

            <div class="empty">

                <h3>
                    No resolutions yet
                </h3>

                <p style="margin-top:8px">

                    Resolutions will appear here
                    once they are created for
                    IN_PROGRESS complaints.

                </p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        resolutions.map(
            resolution => `

            <div class="complaint-card">

                <div class="complaint-main">

                    <div>

                        <div class="complaint-number">

                            Resolution #${resolution.id}

                        </div>


                        <div class="complaint-title">

                            ${
                                escapeHtml(
                                    resolution
                                        .complaint
                                        ?.title
                                    ||
                                    "Complaint #" +
                                    resolution.complaintId
                                )
                            }

                        </div>


                        <div class="complaint-category">

                            Complaint #

                            ${resolution.complaintId}

                            · Resolved by #

                            ${resolution.resolvedBy}

                        </div>

                    </div>

                </div>


                <div class="card-right">

                    <span
                        class="badge
                        ${
                            resolution.status ===
                            "COMPLETED"

                            ? "status-RESOLVED"

                            : "status-IN_PROGRESS"
                        }">

                        ${formatStatus(
                            resolution.status
                        )}

                    </span>


                    ${
                        resolution.status ===
                        "INITIATED"

                        ? `

                            <button
                                class="primary-btn"
                                onclick="completeResolution(
                                    ${resolution.id}
                                )">

                                Complete

                            </button>

                        `

                        : ""

                    }

                </div>

            </div>

        `
        ).join("");
}


// ======================================================
// CREATE RESOLUTION
// ======================================================

function showCreateResolutionForComplaint(
    complaintId
) {

    showCreateResolution();


    document
        .getElementById(
            "resolutionComplaintId"
        )
        .value = complaintId;
}


document
    .getElementById(
        "resolutionForm"
    )
    .addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const request = {

                complaintId:
                    Number(
                        document
                            .getElementById(
                                "resolutionComplaintId"
                            )
                            .value
                    ),

                resolvedBy:
                    Number(
                        document
                            .getElementById(
                                "resolvedBy"
                            )
                            .value
                    ),

                resolutionDescription:
                    document
                        .getElementById(
                            "resolutionDescription"
                        )
                        .value,

                evidenceUrl:
                    document
                        .getElementById(
                            "evidenceUrl"
                        )
                        .value

            };


            try {

                const response =
                    await fetch(
                        RESOLUTION_API,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    request
                                )
                        }
                    );


                if (!response.ok) {

                    const error =
                        await response.text();

                    throw new Error(
                        error ||
                        "Failed to create resolution"
                    );

                }


                const resolution =
                    await response.json();


                showToast(
                    `Resolution #${
                        resolution.id
                    } created successfully`
                );


                document
                    .getElementById(
                        "resolutionForm"
                    )
                    .reset();


                showResolutions();

            }

            catch (error) {

                showToast(
                    error.message
                );

            }

        }
    );


// ======================================================
// COMPLETE RESOLUTION
// ======================================================

async function completeResolution(
    resolutionId
) {

    try {

        const response =
            await fetch(
                `${RESOLUTION_API}/${resolutionId}/complete`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            const error =
                await response.text();

            throw new Error(
                error ||
                "Unable to complete resolution"
            );

        }


        showToast(
            "Resolution completed successfully"
        );


        await loadResolutions();

    }

    catch (error) {

        showToast(
            error.message
        );

    }
}


// ======================================================
// HELPERS
// ======================================================

function formatStatus(value) {

    if (!value) {

        return "N/A";

    }


    return value
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            letter =>
                letter.toUpperCase()
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
        document
            .getElementById(id)
            .value;


    return value
        ? Number(value)
        : null;

}


function getDepartmentName(id) {

    return departments[id]
        || "Unknown Department";

}


function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {

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
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        3000
    );
}


// ======================================================
// START
// ======================================================

loadDashboard();