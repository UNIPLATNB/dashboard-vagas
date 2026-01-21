// 🔗 LINK CSV DA ABA Dados_Site
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_jN8kcgwKuyt0tzJrNaDbrYIWE24WLKwdLSW6TCgFIp7YvV0Nu7Hrhv6fZUBFtwJESKynP5HaaRCs/pub?gid=1126119889&single=true&output=csv";

const regiaoSelect = document.getElementById("regiaoSelect");
const cardsContainer = document.getElementById("cardsContainer");

let dadosGlobais = [];

// =======================
// CARREGAR CSV
// =======================
fetch(CSV_URL)
  .then(response => response.text())
  .then(csv => {
    dadosGlobais = parseCSV(csv);
    preencherFiltro(dadosGlobais);
    montarCards(dadosGlobais);
  })
  .catch(error => {
    cardsContainer.innerHTML = "<p>Erro ao carregar os dados.</p>";
    console.error(error);
  });

// =======================
// PARSER CSV SIMPLES
// =======================
function parseCSV(csv) {
  const linhas = csv.trim().split("\n");
  linhas.shift(); // remove cabeçalho

  return linhas.map(linha => {
    // trata vírgulas dentro de aspas
    const valores = [];
    let atual = "";
    let dentroAspas = false;

    for (let char of linha) {
      if (char === '"') {
        dentroAspas = !dentroAspas;
      } else if (char === "," && !dentroAspas) {
        valores.push(atual);
        atual = "";
      } else {
        atual += char;
      }
    }
    valores.push(atual);

    return valores.map(v => v.replace(/^"|"$/g, "").trim());
  });
}

// =======================
// FILTRO DE REGIÃO
// =======================
function preencherFiltro(dados) {
  const regioes = [...new Set(dados.map(d => d[0]))].filter(Boolean);

  regioes.forEach(regiao => {
    const option = document.createElement("option");
    option.value = regiao;
    option.textContent = regiao;
    regiaoSelect.appendChild(option);
  });

  regiaoSelect.addEventListener("change", () => {
    const selecionada = regiaoSelect.value;
    const filtrados = selecionada
      ? dadosGlobais.filter(d => d[0] === selecionada)
      : dadosGlobais;

    montarCards(filtrados);
  });
}

// =======================
// MONTAR CARDS
// =======================
function montarCards(dados) {
  cardsContainer.innerHTML = "";

  if (dados.length === 0) {
    cardsContainer.innerHTML = "<p>Nenhum dado encontrado.</p>";
    return;
  }

  const escolas = {};

  dados.forEach(([regiao, escola, serie, vagas]) => {
    if (!escolas[escola]) {
      escolas[escola] = [];
    }

    escolas[escola].push({
      serie,
      vagas: Number(vagas)
    });
  });

  Object.entries(escolas).forEach(([escola, series]) => {
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("h2");
    titulo.textContent = escola;
    card.appendChild(titulo);

    series.forEach(item => {
      const linha = document.createElement("div");
      linha.className = "vaga";

      if (item.vagas === 0) {
        linha.classList.add("zero");
      }

      const serieSpan = document.createElement("span");
      serieSpan.textContent = item.serie;

      const vagaStrong = document.createElement("strong");
      vagaStrong.textContent = item.vagas;

      linha.appendChild(serieSpan);
      linha.appendChild(vagaStrong);
      card.appendChild(linha);
    });

    cardsContainer.appendChild(card);
  });
}
