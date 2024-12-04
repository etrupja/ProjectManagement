// setTimeout(() => {
//   document.getElementById("dateTimeNow").innerHTML = new Date();
// }, 10000);

let dateTimeNowP = document.getElementById("dateTimeNow");

const intervalId = setInterval(() => {
  dateTimeNowP.innerHTML = new Date();
}, 1000);

setTimeout(() => {
  clearInterval(intervalId);
  document.getElementById("dateTimeNow").innerHTML = ""; //.remove();
}, 10000);

document.getElementById("appH1").addEventListener("click", () => {
  document.getElementById("dateTimeNow").innerHTML =
    "H1 u klikua: " + new Date();
});

document.getElementById("appP").addEventListener("click", () => {
  document.getElementById("dateTimeNow").innerHTML =
    "P u klikua: " + new Date();
});
