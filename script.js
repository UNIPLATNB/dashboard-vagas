const SHEET_ID = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";
const ABA = "dados_site";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${ABA}`;

let dados = [];

fetch(URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));

    const colunas = json.table.cols.map(c => c.label);
    console.log("COLUNAS:", colunas);

    dados = json.table.rows.map(linha => {
      const obj = {};
      linha.c.forEach((cel, i) => {
        obj[colunas[i]] = cel && cel.v !== null ? cel.v : 0;
      });
      return obj;
    });

    console.log("DADOS:", dados);
    iniciar();
  })
  .catch(err => console.error("Erro ao carregar planilha:", err));

function iniciar() {
  criarTagsRegioes();
}

function criarTagsRegioes() {
  const div = document.getElementById("tagsRegioes");
  div.innerHTML = "";

  const regioes = [...new Set(dados.map(d => d["Região"]))];
  console.log("REGIÕES:", regioes);

  regioes.forEach((regiao, i) => {
    const btn = document.createElement("button");
    btn.className = "tag" + (i === 0 ? " ativa" : "");
    btn.textContent = regiao;

    btn.onclick = () => {
      document.querySelectorAll(".tag").forEach(t => t.classList.remove("ativa"));
      btn.classList.add("ativa");
      renderizar(regiao);
    };

    div.appendChild(btn);
  });

  renderizar(regioes[0]);
}

function renderizar(regiao) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const filtrados = dados.filter(d => d["Região"] === regiao);
  console.log("FILTRADOS:", filtrados);

  const escolas = {};
  let total = 0;

  filtrados.forEach(d => {
    const escola = d["Escola"];
    const serie = d["Série"];
    const vagas = Number(d["Vagas"]) || 0;

    total += vagas;

    if (!escolas[escola]) escolas[escola] = [];
    escolas[escola].push({ serie, vagas });
  });

  document.getElementById("totalVagas").textContent =
    `Total de vagas: ${total}`;

  Object.keys(escolas).forEach(escola => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `<h3>${escola}</h3>`;

    escolas[escola].forEach(item => {
      const linha = document.createElement("div");
      linha.className = "linha";
      linha.innerHTML = `<span>${item.serie}</span><span>${item.vagas}</span>`;
      card.appendChild(linha);
    });

    container.appendChild(card);
  });
}
