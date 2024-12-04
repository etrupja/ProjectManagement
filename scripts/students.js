// Get references to the DOM elements
const studentNameInput = document.getElementById("studentName");
const studentIdInput = document.getElementById("studentId");
const addStudentButton = document.getElementById("addStudentButton");
const updateStudentButton = document.getElementById("updateStudentButton");
const searchStudentInput = document.getElementById("searchStudent");
const studentsList = document.getElementById("studentsList");

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
  studentsList.innerHTML = ""; // Clear the list
  if (students.length === 0) {
    studentsList.innerHTML =
      '<p class="text-muted">No students found. Add a student to get started!</p>';
    return;
  }
  students.forEach((student) => {
    const studentCard = document.createElement("div");
    studentCard.classList.add("col-md-4", "mb-3");
    studentCard.innerHTML = `
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">${student.name}</h5>
          <button class="btn btn-warning btn-sm" onclick="loadStudentForUpdate('${student.id}')">Edit</button>
          <button class="btn btn-danger btn-sm" onclick="deleteStudent('${student.id}')">Delete</button>
        </div>
      </div>
    `;
    studentsList.appendChild(studentCard);
  });
}

// Function to add a student
function addStudent() {
  const name = studentNameInput.value.trim();
  if (!name) return alert("Student name is required.");

  const students = getStudents();
  const newStudent = {
    id: generateId(),
    name: name,
  };

  students.push(newStudent);
  saveStudents(students);
  renderStudents();
  studentForm.reset();
}

// Function to load a student into the form for updating
function loadStudentForUpdate(id) {
  const students = getStudents();
  const student = students.find((student) => student.id === id);

  if (!student) return alert("Student not found.");

  // Populate the form with the student's data
  studentNameInput.value = student.name;
  studentIdInput.value = student.id;

  // Show the Update button and hide the Add button
  addStudentButton.classList.add("d-none");
  updateStudentButton.classList.remove("d-none");
}

// Function to update a student
function updateStudent() {
  const name = studentNameInput.value.trim();
  const id = studentIdInput.value;

  if (!name || !id) return alert("Student name and valid ID are required.");

  const students = getStudents();
  const studentIndex = students.findIndex((student) => student.id === id);

  if (studentIndex === -1) return alert("Student not found.");

  students[studentIndex].name = name;
  saveStudents(students);
  renderStudents();

  // Reset form and buttons
  studentForm.reset();
  studentIdInput.value = "";
  addStudentButton.classList.remove("d-none");
  updateStudentButton.classList.add("d-none");
}

// Function to delete a student
function deleteStudent(id) {
  let students = getStudents();
  students = students.filter((student) => student.id !== id);
  saveStudents(students);
  renderStudents();
}

// Function to search students
searchStudentInput.addEventListener("input", () => {
  const searchText = searchStudentInput.value.toLowerCase();
  const students = getStudents().filter((student) =>
    student.name.toLowerCase().includes(searchText)
  );
  renderStudents(students);
});

// Event listeners for the buttons
addStudentButton.addEventListener("click", addStudent);
updateStudentButton.addEventListener("click", updateStudent);

// Initial render
renderStudents();
