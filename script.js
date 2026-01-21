const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_jN8kcgwKuyt0tzJrNaDbrYIWE24WLKwdLSW6TCgFIp7YvV0Nu7Hrhv6fZUBFtwJESKynP5HaaRCs/pub?gid=1126119889&single=true&output=csv";

const regiaoSelect = document.getElementById("regiaoSelect");
const cardsContainer = document.getElementById("cardsContainer");

let dados = [];

// =======================
// CARREGAR CSV
// =======================
fetch(CSV_URL)
  .then(r => r.text())
  .then(csv => {
    dados = parseCSV(csv);
    carregarRegioes();
    montarCards(dados);
  })
  .catch(err => {
    console.error(err);
    cardsContainer.innerHTML = "<p>Erro ao carregar dados.</p>";
  });

// =======================
// PARSER CSV (AUTO ; ou ,)
// =======================
function parseCSV(csv) {
  const linhas = csv.trim().split("\n");
  const separador = linhas[0].includes(";") ? ";" : ",";

  linhas.shift(); // remove cabeçalho

  return linhas.map(l => {
    const cols = l
      .split(separador)
      .map(c => c.replace(/^"|"$/g, "").trim());

    return {
      regiao: cols[0] || "",
      escola: cols[1] || "",
      serie: cols[2] || "",
      vagas: N
