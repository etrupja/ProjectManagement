// Get references to jQuery elements
const $projectForm = $("#projectForm");
const $projectNameInput = $("#projectName");
const $deadlineInput = $("#deadline");
const $studentsSelect = $("#studentsSelect");
const $projectIdInput = $("#projectId");
const $projectsList = $("#projectsList");

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
  $studentsSelect.html('<option value="">Select a student</option>');

  students.forEach((student) => {
    $studentsSelect.append($("<option>").val(student.id).text(student.name));
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
  $projectsList.empty(); // Clear the list

  if (projects.length === 0) {
    $projectsList.html(
      '<li class="list-group-item text-muted">No projects found. Create a project to get started!</li>'
    );
    return;
  }

  projects.forEach((project) => {
    const student = getStudents().find((s) => s.id === project.studentId);
    const studentName = student ? student.name : "Unassigned";

    const $projectItem = $("<li>").addClass("list-group-item").html(`
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1">${project.name}</h5>
            <p class="mb-1"><strong>Deadline:</strong> ${formatDate(
              project.deadline
            )}</p>
            <p class="mb-1"><strong>Assigned Student:</strong> ${studentName}</p>
          </div>
          <div>
            <button class="btn btn-warning btn-sm me-2 edit-project" data-project-id="${
              project.id
            }">Edit</button>
            <button class="btn btn-danger btn-sm delete-project" data-project-id="${
              project.id
            }">Delete</button>
          </div>
        </div>
      `);
    $projectsList.append($projectItem);
  });
}

// Handle form submission (create/update project)
$projectForm.on("submit", function (e) {
  e.preventDefault();

  const name = $projectNameInput.val().trim();
  const deadline = $deadlineInput.val();
  const studentId = $studentsSelect.val();

  // Validation
  if (!name || !deadline || !studentId) {
    alert("Please fill in all required fields.");
    return;
  }

  const projectId = $projectIdInput.val();

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
  $projectForm[0].reset();
  $projectIdInput.val("");
  $projectForm.find("button[type='submit']").text("Create Project");
});

// Handle edit project click using event delegation
$projectsList.on("click", ".edit-project", function () {
  const projectId = $(this).data("project-id");
  const project = getProjects().find((p) => p.id === projectId);
  if (!project) return;

  $projectNameInput.val(project.name);
  $deadlineInput.val(project.deadline);
  $projectIdInput.val(project.id);
  $studentsSelect.val(project.studentId);

  $projectForm.find("button[type='submit']").text("Update Project");
  $projectNameInput.focus();
});

// Handle delete project click using event delegation
$projectsList.on("click", ".delete-project", function () {
  if (!confirm("Are you sure you want to delete this project?")) return;

  const projectId = $(this).data("project-id");
  let projects = getProjects();
  projects = projects.filter((project) => project.id !== projectId);
  saveProjects(projects);
  renderProjects();
});

// Initialize the page
$(document).ready(function () {
  populateStudentsSelect();
  renderProjects();
});
