const SHEET_ID = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";
const ABA = "dados_site";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${ABA}`;

/* ORDEM OFICIAL DAS SÉRIES */
const ordemSeries = [
  "1º período",
  "2º período",
  "1º ano",
  "2º ano",
  "3º ano"
];

let dados = [];

/* ===== BUSCAR PLANILHA ===== */
fetch(URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));

    dados = json.table.rows.map(r => ({
      regiao: r.c[0]?.v || "",
      escola: r.c[1]?.v || "",
      serie: r.c[2]?.v || "",
      vagas: Number(r.c[3]?.v) || 0
    }));

    iniciar();
  })
  .catch(err => console.error("Erro ao carregar planilha:", err));

/* ===== INICIAR ===== */
function iniciar() {
  criarTagsRegioes();
}

/* ===== TAGS DE REGIÃO ===== */
function criarTagsRegioes() {
  const div = document.getElementById("tagsRegioes");
  div.innerHTML = "";

  const regioes = [...new Set(dados.map(d => d.regiao).filter(r => r))];

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

  if (regioes.length > 0) {
    renderizar(regioes[0]);
  }
}

/* ===== RENDERIZAR CARDS ===== */
function renderizar(regiaoSelecionada) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const filtrados = dados.filter(d => d.regiao === regiaoSelecionada);

  const escolas = {};
  let totalVagas = 0;

  filtrados.forEach(d => {
    totalVagas += d.vagas;

    if (!escolas[d.escola]) {
      escolas[d.escola] = [];
    }

    escolas[d.escola].push({
      serie: d.serie.toString().trim(),
      vagas: d.vagas
    });
  });

  /* ORDENA AS SÉRIES DENTRO DE CADA ESCOLA */
  Object.values(escolas).forEach(lista => {
    lista.sort((a, b) => {
      const ia = ordemSeries.indexOf(a.serie);
      const ib = ordemSeries.indexOf(b.serie);

      if (ia === -1 && ib === -1) return a.serie.localeCompare(b.serie);
      if (ia === -1) return 1;
      if (ib === -1) return -1;

      return ia - ib;
    });
  });

  document.getElementById("totalVagas").textContent =
    `Total de vagas: ${totalVagas}`;

  Object.keys(escolas).forEach(escola => {
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("h3");
    titulo.textContent = escola;
    card.appendChild(titulo);

    escolas[escola].forEach(item => {
      const linha = document.createElement("div");
      linha.className = "linha";
      linha.innerHTML = `
        <span>${item.serie}</span>
        <span>${item.vagas}</span>
      `;
      card.appendChild(linha);
    });

    container.appendChild(card);
  });
}
