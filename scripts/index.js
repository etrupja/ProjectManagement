let $dateTimeNow = $("#dateTimeNow");
let $appH1 = $("#appH1");
let $appP = $("#appP");

const intervalId = setInterval(() => {
  $dateTimeNow.html(new Date());
}, 1000);

setTimeout(() => {
  clearInterval(intervalId);
  $dateTimeNow.html("");
}, 10000);

$appH1.on("click", () => {
  $dateTimeNow.html("H1 u klikua: " + new Date());
});

$appP.on("click", () => {
  $dateTimeNow.html("P u klikua: " + new Date());
});
