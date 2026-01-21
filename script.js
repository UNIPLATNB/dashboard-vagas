const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_jN8kcgwKuyt0tzJrNaDbrYIWE24WLKwdLSW6TCgFIp7YvV0Nu7Hrhv6fZUBFtwJESKynP5HaaRCs/pub?gid=1126119889&single=true&output=csv";

const regiaoSelect = document.getElementById("regiaoSelect");
const cardsContainer = document.getElementById("cardsContainer");

let dadosGlobais = [];

// =======================
// CARREGAR CSV
// =======================
fetch(CSV_URL)
  .then(r => r.text())
  .then(csv => {
    dadosGlobais = parseCSVComCabecalho(csv);
    preencherFiltro(dadosGlobais);
    montarCards(dadosGlobais);
  })
  .catch(err => {
    console.error(err);
    cardsContainer.innerHTML = "<p>Erro ao carregar os dados.</p>";
  });

// =======================
// CSV → OBJETOS
// =======================
function parseCSVCo

