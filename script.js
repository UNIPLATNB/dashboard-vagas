const SHEET_ID = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";
const ABA = "dados_site";

const URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${ABA}`;

/* ORDEM PADRÃO */
const ordemSeries = [
  "1º período",
  "2º período",
  "1º ano",
  "2º ano",
  "3º ano",
  "4º ano",
  "5º ano",
  "6º ano",
  "7º ano",
  "8º ano",
  "9º ano"
];

let dados = [];

/* ===== NORMALIZA TEXTO ===== */
function normalizarSerie(texto) {
  return texto
    .toLowerCase()
    .replace("°", "º")
    .replace("periodo", "período")
    .replace(/\s+/g, " ")
    .trim();
}

/* ===== BUSCAR PLANILHA ===== */
fetch(URL)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));

    dados = json.table.rows.map(r => ({
      regiao: r.c[0]?.v || "",
      escola: r.c[1]?.v || "",
      serieOriginal: r.c[2]?.v || "",
      serie: normalizarSerie(r.c[2]?.v || ""),
      vagas: Number(r.c[3]?.v) || 0
    }));

    iniciar();
  });

/* ===== INICIAR ===== */
function iniciar() {
  criarTagsRegioes();
}

/* ===== TAGS ===== */
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

  if (regioes.length > 0) renderizar(regioes[0]);
}

/* ===== RENDER ===== */
function renderizar(regiaoSelecionada) {
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const filtrados = dados.filter(d => d.regiao === regiaoSelecionada);

  const escolas = {};
  let totalVagas = 0;

  filtrados.forEach(d => {
    totalVagas += d.vagas;

    if (!escolas[d.escola]) escolas[d.escola] = [];

    escolas[d.escola].push(d);
  });

  document.getElementById("totalVagas").textContent =
    `Total de vagas: ${totalVagas}`;

  Object.keys(escolas).forEach(escola => {
    const card = document.createElement("div");
    card.className = "card";

    const titulo = document.createElement("h3");
    titulo.textContent = escola;
    card.appendChild(titulo);

    escolas[escola]
      .sort((a, b) => {
        const ia = ordemSeries.indexOf(a.serie);
        const ib = ordemSeries.indexOf(b.serie);
        if (ia === -1 && ib === -1) return a.serie.localeCompare(b.serie);
        if (ia === -1) return 1;
        if (ib === -1) return -1;
        return ia - ib;
      })
      .forEach(item => {
        const linha = document.createElement("div");
        linha.className = "linha";
        linha.innerHTML = `
          <span>${item.serieOriginal}</span>
          <span>${item.vagas}</span>
        `;
        card.appendChild(linha);
      });

    container.appendChild(card);
  });
}
