// Get references to DOM elements
const projectForm = document.getElementById("projectForm");
const projectNameInput = document.getElementById("projectName");
const deadlineInput = document.getElementById("deadline");
const studentsSelect = document.getElementById("studentsSelect");
const projectIdInput = document.getElementById("projectId");
const projectsList = document.getElementById("projectsList");

// Function to generate a random ID
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Function to get projects from localStorage
function getProjects() {
  return JSON.parse(localStorage.getItem("projects")) || [];
}

// Function to save projects to localStorage
function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

// Function to get students from localStorage
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

// Function to check if a student is already assigned to a project
function isStudentAssigned(studentId, excludeProjectId = null) {
  const projects = getProjects();
  return projects.some(
    (project) =>
      project.studentId === studentId && project.id !== excludeProjectId
  );
}

// Function to populate students select
function populateStudentsSelect() {
  const students = getStudents();
  // Keep the default "Select a student" option
  studentsSelect.innerHTML = '<option value="">Select a student</option>';

  students.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = student.name;
    studentsSelect.appendChild(option);
  });
}

// Function to format date for display
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// Function to render the projects list
function renderProjects() {
  const projects = getProjects();
  projectsList.innerHTML = ""; // Clear the list

  if (projects.length === 0) {
    projectsList.innerHTML =
      '<li class="list-group-item text-muted">No projects found. Create a project to get started!</li>';
    return;
  }

  projects.forEach((project) => {
    const student = getStudents().find((s) => s.id === project.studentId);
    const studentName = student ? student.name : "Unassigned";

    const projectItem = document.createElement("li");
    projectItem.classList.add("list-group-item");
    projectItem.innerHTML = `
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h5 class="mb-1">${project.name}</h5>
          <p class="mb-1"><strong>Deadline:</strong> ${formatDate(
            project.deadline
          )}</p>
          <p class="mb-1"><strong>Assigned Student:</strong> ${studentName}</p>
        </div>
        <div>
          <button class="btn btn-warning btn-sm me-2" onclick="editProject('${
            project.id
          }')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteProject('${
            project.id
          }')">Delete</button>
        </div>
      </div>
    `;
    projectsList.appendChild(projectItem);
  });
}

// Function to handle form submission (create/update project)
projectForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = projectNameInput.value.trim();
  const deadline = deadlineInput.value;
  const studentId = studentsSelect.value;

  // Validation
  if (!name || !deadline || !studentId) {
    alert("Please fill in all required fields.");
    return;
  }

  const projectId = projectIdInput.value;

  // Check if student is already assigned to another project
  if (isStudentAssigned(studentId, projectId)) {
    alert("This student is already assigned to another project.");
    return;
  }

  const projects = getProjects();

  if (projectId) {
    // Update existing project
    const projectIndex = projects.findIndex((p) => p.id === projectId);
    if (projectIndex !== -1) {
      projects[projectIndex] = {
        ...projects[projectIndex],
        name,
        deadline,
        studentId,
      };
    }
  } else {
    // Create new project
    const newProject = {
      id: generateId(),
      name,
      deadline,
      studentId,
    };
    projects.push(newProject);
  }

  saveProjects(projects);
  renderProjects();
  projectForm.reset();
  projectIdInput.value = "";
  projectForm.querySelector("button[type='submit']").textContent =
    "Create Project";
});

// Function to edit a project
function editProject(projectId) {
  const project = getProjects().find((p) => p.id === projectId);
  if (!project) return;

  projectNameInput.value = project.name;
  deadlineInput.value = project.deadline;
  projectIdInput.value = project.id;
  studentsSelect.value = project.studentId;

  projectForm.querySelector("button[type='submit']").textContent =
    "Update Project";
  projectNameInput.focus();
}

// Function to delete a project
function deleteProject(projectId) {
  if (!confirm("Are you sure you want to delete this project?")) return;

  let projects = getProjects();
  projects = projects.filter((project) => project.id !== projectId);
  saveProjects(projects);
  renderProjects();
}

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  populateStudentsSelect();
  renderProjects();
});
