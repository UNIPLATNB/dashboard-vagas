const url = "https://docs.google.com/spreadsheets/d/12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE/gviz/tq?tqx=out:json&sheet=dados_site";

let dados = [];
let grafico;

// Carrega dados da planilha
fetch(url)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));

    dados = json.table.rows
      .map(r => ({
        regiao: r.c[0]?.v?.trim(),
        escola: r.c[1]?.v?.trim(),
        serie: r.c[2]?.v?.trim(),
        vagas: Number(r.c[3]?.v || 0)
      }))
      .filter(d => d.regiao && d.escola && d.serie);

    criarTags();
  });

// Cria TAGS de região
function criarTags() {
  const container = document.getElementById("tagsRegioes");
  const regioes = [...new Set(dados.map(d => d.regiao))];

  container.innerHTML = "";

  regioes.forEach((regiao, index) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = regiao;

    tag.onclick = () => {
      document.querySelectorAll(".tag").forEach(t => t.classList.remove("active"));
      tag.classList.add("active");
      atualizar(regiao);
    };

    container.appendChild(tag);

    if (index === 0) {
      tag.classList.add("active");
      atualizar(regiao);
    }
  });
}

// Atualiza cards, total e gráfico
function atualizar(regiao) {
  const filtrados = dados.filter(d => d.regiao === regiao);
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  // AGRUPA POR ESCOLA
  const escolas = {};
  let totalVagas = 0;

  filtrados.forEach(d => {
    if (!escolas[d.escola]) {
      escolas[d.escola] = [];
    }
    escolas[d.escola].push({ serie: d.serie, vagas: d.vagas });
    totalVagas += d.vagas;
  });

  // Atualiza total
  document.getElementById("totalVagas").textContent =
    `Total de vagas na região: ${totalVagas}`;

  // Cria cards
  Object.keys(escolas).forEach(escola => {
    const card = document.createElement("div");
    card.className = "card";

    let htmlSeries = "";
    escolas[escola].forEach(s => {
      htmlSeries += `
        <div class="serie">
          <span>${s.serie}</span>
          <strong>${s.vagas}</strong>
        </div>
      `;
    });

    card.innerHTML = `
      <h3>${escola}</h3>
      ${htmlSeries}
    `;

    container.appendChild(card);
  });

  gerarGrafico(filtrados);
}

// Gráfico
function gerarGrafico(dadosFiltrados) {
  const labels = [];
  const valores = [];

  dadosFiltrados.forEach(d => {
    labels.push(`${d.escola} - ${d.serie}`);
    valores.push(d.vagas);
  });

  if (grafico) grafico.destroy();

  grafico = new Chart(document.getElementById("graficoVagas"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Vagas disponíveis",
        data: valores
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          ticks
