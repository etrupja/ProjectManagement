// Get references to the DOM elements
const $studentNameInput = $("#studentName");
const $studentIdInput = $("#studentId");
const $addStudentButton = $("#addStudentButton");
const $updateStudentButton = $("#updateStudentButton");
const $searchStudentInput = $("#searchStudent");
const $studentsList = $("#studentsList");
const $studentForm = $("#studentForm"); // Added form reference

// Function to generate a random ID
function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

// Function to get students from localStorage
function getStudents() {
  return JSON.parse(localStorage.getItem("students")) || [];
}

// Function to save students to localStorage
function saveStudents(students) {
  localStorage.setItem("students", JSON.stringify(students));
}

// Function to render the student list
function renderStudents(students = getStudents()) {
  // Properly clear the list using jQuery
  $studentsList.empty();

  if (students.length === 0) {
    $studentsList.html(
      '<p class="text-muted">No students found. Add a student to get started!</p>'
    );
    return;
  }

  students.forEach((student) => {
    const $studentCard = $("<div>").addClass("col-md-4 mb-3").html(`
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">${student.name}</h5>
            <button class="btn btn-warning btn-sm edit-student" data-id="${student.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-student" data-id="${student.id}">Delete</button>
          </div>
        </div>
      `);
    $studentsList.append($studentCard);
  });
}

// Function to add a student
function addStudent(e) {
  e.preventDefault();
  const name = $studentNameInput.val().trim();
  if (!name) {
    alert("Student name is required.");
    return;
  }

  const students = getStudents();
  const newStudent = {
    id: generateId(),
    name: name,
  };

  students.push(newStudent);
  saveStudents(students);
  renderStudents();
  $studentForm[0].reset();
}

// Function to load a student into the form for updating
function loadStudentForUpdate(id) {
  const students = getStudents();
  const student = students.find((student) => student.id === id);

  if (!student) {
    alert("Student not found.");
    return;
  }

  $studentNameInput.val(student.name);
  $studentIdInput.val(student.id);

  $addStudentButton.addClass("d-none");
  $updateStudentButton.removeClass("d-none");
}

// Function to update a student
function updateStudent(e) {
  e.preventDefault();
  const name = $studentNameInput.val().trim();
  const id = $studentIdInput.val();

  if (!name || !id) {
    alert("Student name and valid ID are required.");
    return;
  }

  const students = getStudents();
  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) {
    alert("Student not found.");
    return;
  }

  students[studentIndex].name = name;
  saveStudents(students);
  renderStudents();

  // Reset form and buttons
  $studentForm[0].reset();
  $studentIdInput.val("");
  $addStudentButton.removeClass("d-none");
  $updateStudentButton.addClass("d-none");
}

// Function to delete a student
function deleteStudent(id) {
  if (!confirm("Are you sure you want to delete this student?")) {
    return;
  }

  let students = getStudents();
  students = students.filter((student) => student.id !== id);
  saveStudents(students);
  renderStudents();
}

// Event Delegation for dynamically created buttons
$studentsList.on("click", ".edit-student", function () {
  const id = $(this).data("id");
  loadStudentForUpdate(id);
});

$studentsList.on("click", ".delete-student", function () {
  const id = $(this).data("id");
  deleteStudent(id);
});

// Search functionality
$searchStudentInput.on("input", function () {
  const searchText = $(this).val().toLowerCase();
  const students = getStudents().filter((student) =>
    student.name.toLowerCase().includes(searchText)
  );
  renderStudents(students);
});

// Event listeners for the buttons
$addStudentButton.on("click", addStudent);
$updateStudentButton.on("click", updateStudent);

// Initial render
$(document).ready(function () {
  renderStudents();
});
