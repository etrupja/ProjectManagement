document.getElementById("studentForm").addEventListener("submit", (event) => {
  event.preventDefault();

  let _studentName = document.getElementById("studentName").value;

  console.log("Student name - ", _studentName);

  let newStudent = {
    id: 1,
    studentName: _studentName,
  };

  localStorage.setItem("student", JSON.stringify(newStudent));
});
