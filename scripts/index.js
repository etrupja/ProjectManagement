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

$("#translateBtn").on("click", () => {
  let fromLanguage = $("#fromLanguage").val();
  console.log("fromLanguage - ", fromLanguage);
  let toLanguage = $("#toLanguage").val();
  console.log("toLanguage - ", toLanguage);

  let textToBeTranslated = $("#translateInput").val();

  const settings = {
    async: true,
    crossDomain: true,
    url: "https://google-translate113.p.rapidapi.com/api/v1/translator/html",
    method: "POST",
    headers: {
      "x-rapidapi-key": "6605cb8369msh171a9fccea13ac0p174da2jsn4ad279364885",
      "x-rapidapi-host": "google-translate113.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    processData: false,
    data:
      '{"from":"' +
      fromLanguage +
      '","to":"' +
      toLanguage +
      '","html":"<div>' +
      textToBeTranslated +
      '</div>"}',
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
    $("#translationPlaceholder").html(response.trans);
  });
});
