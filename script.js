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
// PARSER CSV (POR POSIÇÃO)
// =======================
function parseCSV(csv) {
  const linhas = csv.trim().split("\n");
  linhas.shift(); // remove cabeçalho

  return linhas.map(l => {
    const cols = l.split(",").map(c => c.replace(/^"|"$/g, "").trim());
    return {
      regiao: cols[0],
      escola: cols[1],
      serie: cols[2],
      vagas: Number(cols[3])
    };
  });
}

// =======================
// FILTRO REGIÕES
// =======================
function carregarRegioes() {
  const regioes = [...new Set(dados.map(d => d.regiao))];

  regiaoSelect.innerHTML = `<option value="">Todas as regiões</option>`;

  regioes.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    regiaoSelect.appendChild(opt);
  });

  regiaoSelect.addEventListener("change", () => {
    const r = regiaoSelect.value;
    const filtrado = r ? dados.filter(d => d.regiao === r) : dados;
    montarCards(filtrado);
  });
}

// =======================
// MONTAR CARDS
// =======================
function montarCards(lista) {
  cardsContainer.innerHTML = "";

  const escolas = {};

  lista.forEach(d => {
    if (!escolas[d.escola]) {
      escolas[d.escola] = [];
    }
    escolas[d.escola].push({
      serie: d.serie,
      vagas: d.vagas
    });
  });

  Object.keys(escolas).forEach(nome => {
    const card = document.createElement("div");
    card.className = "card";

    const h2 = document.createElement("h2");
    h2.textContent = nome;
    card.appendChild(h2);

    escolas[nome].forEach(s => {
      const linha = document.createElement("div");
      linha.className = "vaga";
      if (s.vagas === 0) linha.classList.add("zero");

      linha.innerHTML = `<span>${s.serie}</span><strong>${s.vagas}</strong>`;
      card.appendChild(linha);
    });

    cardsContainer.appendChild(card);
  });
}
