const API_URL = "http://localhost:5000/api/opportunities";

const opportunityForm = document.getElementById("opportunityForm");
const formSection = document.getElementById("formSection");
const formHeading = document.getElementById("formHeading");
const opportunitiesList = document.getElementById("opportunitiesList");
const messageBox = document.getElementById("message");

const showFormBtn = document.getElementById("showFormBtn");
const cancelFormBtn = document.getElementById("cancelFormBtn");
const refreshBtn = document.getElementById("refreshBtn");

let editingId = null;

// Display success or error messages
function showMessage(message, type = "success") {
    messageBox.innerHTML = "";

    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    messageBox.appendChild(alert);

    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Escape text before inserting it into HTML
function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[character]);
}

// Show the form
function openForm() {
    opportunityForm.reset();
    editingId = null;
    formHeading.textContent = "Add Research Opportunity";
    formSection.classList.remove("d-none");
    formSection.scrollIntoView({ behavior: "smooth" });
}

// Hide the form
function closeForm() {
    formSection.classList.add("d-none");
    opportunityForm.reset();
    editingId = null;
}

// Load all opportunities from the backend
async function loadOpportunities() {
    opportunitiesList.innerHTML = "<p>Loading research opportunities...</p>";

    try {
        const response = await fetch(API_URL);
        const opportunities = await response.json();

        if (!response.ok) {
            throw new Error(opportunities.message || "Could not load opportunities.");
        }

        if (!Array.isArray(opportunities) || opportunities.length === 0) {
            opportunitiesList.innerHTML = `
                <div class="col-12">
                    <div class="card">
                        <div class="card-body text-center py-5">
                            <h3 class="h5">No research opportunities found</h3>
                            <p class="text-muted mb-0">
                                Click "Add Opportunity" to create the first one.
                            </p>
                        </div>
                    </div>
                </div>
            `;
            return;
        }

        opportunitiesList.innerHTML = opportunities.map(opportunity => {
            const status = opportunity.status === "Closed" ? "Closed" : "Open";
            const badgeClass = status === "Open" ? "status-open" : "status-closed";

            const deadline = opportunity.application_deadline
                ? String(opportunity.application_deadline).slice(0, 10)
                : "Not specified";

            return `
                <div class="col-md-6 col-lg-4">
                    <article class="card opportunity-card shadow-sm">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start gap-2 mb-3">
                                <span class="badge bg-secondary">
                                    ${escapeHTML(opportunity.research_area)}
                                </span>
                                <span class="status-badge ${badgeClass}">
                                    ${status}
                                </span>
                            </div>

                            <h3 class="h5">
                                ${escapeHTML(opportunity.research_title)}
                            </h3>

                            <p class="opportunity-description">
                                ${escapeHTML(opportunity.research_description)}
                            </p>

                            <div class="opportunity-meta mb-3">
                                <p class="mb-1">
                                    <strong>Faculty:</strong>
                                    ${escapeHTML(opportunity.faculty_name)}
                                </p>
                                <p class="mb-1">
                                    <strong>Department:</strong>
                                    ${escapeHTML(opportunity.department)}
                                </p>
                                <p class="mb-1">
                                    <strong>Skills:</strong>
                                    ${escapeHTML(opportunity.required_skills)}
                                </p>
                                <p class="mb-1">
                                    <strong>Positions:</strong>
                                    ${escapeHTML(opportunity.available_positions)}
                                </p>
                                <p class="mb-0">
                                    <strong>Deadline:</strong>
                                    ${escapeHTML(deadline)}
                                </p>
                            </div>

                            <div class="mt-auto d-flex flex-wrap gap-2">
                                <button class="btn btn-outline-primary btn-sm"
                                    data-action="edit"
                                    data-id="${escapeHTML(opportunity.id)}">
                                    Edit
                                </button>

                                ${status === "Open" ? `
                                    <button class="btn btn-outline-success btn-sm"
                                        data-action="close"
                                        data-id="${escapeHTML(opportunity.id)}">
                                        Close
                                    </button>
                                ` : ""}

                                <button class="btn btn-outline-danger btn-sm"
                                    data-action="delete"
                                    data-id="${escapeHTML(opportunity.id)}">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        }).join("");

    } catch (error) {
        opportunitiesList.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    Could not load opportunities. Make sure the backend is running.
                    <br>
                    <small>${escapeHTML(error.message)}</small>
                </div>
            </div>
        `;
    }
}

// Read the form fields
function getFormData() {
    return {
        research_title: document.getElementById("research_title").value.trim(),
        research_description: document.getElementById("research_description").value.trim(),
        research_area: document.getElementById("research_area").value.trim(),
        faculty_name: document.getElementById("faculty_name").value.trim(),
        department: document.getElementById("department").value.trim(),
        required_skills: document.getElementById("required_skills").value.trim(),
        available_positions: Number(
            document.getElementById("available_positions").value
        ),
        application_deadline: document.getElementById("application_deadline").value,
        status: document.getElementById("status").value
    };
}

// Create or update an opportunity
opportunityForm.addEventListener("submit", async event => {
    event.preventDefault();

    const data = getFormData();

    const requiredTextFields = [
        data.research_title,
        data.research_description,
        data.research_area,
        data.faculty_name,
        data.department,
        data.required_skills,
        data.application_deadline
    ];

    if (requiredTextFields.some(value => !value)) {
        showMessage("Please complete all required fields.", "danger");
        return;
    }

    if (!Number.isInteger(data.available_positions) || data.available_positions < 1) {
        showMessage("Available positions must be a whole number greater than zero.", "danger");
        return;
    }

    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? "PUT" : "POST";

    try {
        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to save opportunity.");
        }

        showMessage(
            isEditing
                ? "Research opportunity updated successfully."
                : "Research opportunity created successfully."
        );

        closeForm();
        await loadOpportunities();

    } catch (error) {
        showMessage(error.message, "danger");
    }
});

// Edit an opportunity
async function editOpportunity(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const opportunity = await response.json();

        if (!response.ok) {
            throw new Error(opportunity.message || "Opportunity not found.");
        }

        editingId = id;
        formHeading.textContent = "Update Research Opportunity";

        const fields = [
            "research_title",
            "research_description",
            "research_area",
            "faculty_name",
            "department",
            "required_skills",
            "available_positions",
            "application_deadline",
            "status"
        ];

        fields.forEach(field => {
            const input = document.getElementById(field);
            let value = opportunity[field] ?? "";

            if (field === "application_deadline") {
                value = String(value).slice(0, 10);
            }

            input.value = value;
        });

        formSection.classList.remove("d-none");
        formSection.scrollIntoView({ behavior: "smooth" });

    } catch (error) {
        showMessage(error.message, "danger");
    }
}

// Close an opportunity
async function closeOpportunity(id) {
    const confirmed = confirm("Are you sure you want to close this opportunity?");

    if (!confirmed) return;

    try {
        const getResponse = await fetch(`${API_URL}/${id}`);
        const opportunity = await getResponse.json();

        if (!getResponse.ok) {
            throw new Error(opportunity.message || "Opportunity not found.");
        }

        opportunity.status = "Closed";

        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(opportunity)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to close opportunity.");
        }

        showMessage("Opportunity closed successfully.");
        await loadOpportunities();

    } catch (error) {
        showMessage(error.message, "danger");
    }
}

// Delete an opportunity
async function deleteOpportunity(id) {
    const confirmed = confirm("Are you sure you want to delete this opportunity?");

    if (!confirmed) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE"
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Unable to delete opportunity.");
        }

        showMessage("Opportunity deleted successfully.");
        await loadOpportunities();

    } catch (error) {
        showMessage(error.message, "danger");
    }
}

// Handle card button clicks
opportunitiesList.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    if (action === "edit") editOpportunity(id);
    if (action === "close") closeOpportunity(id);
    if (action === "delete") deleteOpportunity(id);
});

// Form buttons
showFormBtn.addEventListener("click", openForm);
cancelFormBtn.addEventListener("click", closeForm);
refreshBtn.addEventListener("click", loadOpportunities);

// Load opportunities when the page opens
loadOpportunities();