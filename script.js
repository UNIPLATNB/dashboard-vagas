const url =
  "https://docs.google.com/spreadsheets/d/12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE/gviz/tq?tqx=out:json&sheet=dados_site";

let dados = [];
let grafico;

// ====== CARREGAMENTO SEGURO DOS DADOS ======
fetch(url)
  .then(res => res.text())
  .then(text => {
    const inicio = text.indexOf("{");
    const fim = text.lastIndexOf("}");
    const json = JSON.parse(text.substring(inicio, fim + 1));

    dados = json.table.rows
      .map(r => ({
        regiao: r.c[0]?.v?.toString().trim(),
        escola: r.c[1]?.v?.toString().trim(),
        serie: r.c[2]?.v?.toString().trim(),
        vagas: Number(r.c[3]?.v || 0)
      }))
      .filter(d => d.regiao && d.escola && d.serie);

    criarTags();
  })
  .catch(err => {
    document.body.innerHTML =
      "<h2>Erro ao carregar dados da planilha</h2><pre>" + err + "</pre>";
  });

// ====== TAGS DE REGIÃO ======
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

// ====== ATUALIZA CARDS, TOTAL E GRÁFICO ======
function atualizar(regiao) {
  const filtrados = dados.filter(d => d.regiao === regiao);
  const container = document.getElementById("cardsContainer");
  container.innerHTML = "";

  const escolas = {};
  let totalVagas = 0;

  filtrados.forEach(d => {
    if (!escolas[d.escola]) escolas[d.escola] = [];
    escolas[d.escola].push({ serie: d.serie, vagas: d.vagas });
    totalVagas += d.vagas;
  });

  document.getElementById("totalVagas").textContent =
    `Total de vagas na região: ${totalVagas}`;

  Object.keys(escolas).forEach(escola => {
    const card = document.createElement("div");
    card.className = "card";

    let seriesHTML = "";
    escolas[escola].forEach(s => {
      seriesHTML += `
        <div class="serie">
          <span>${s.serie}</span>
          <strong>${s.vagas}</strong>
        </div>
      `;
    });

    card.innerHTML = `
      <h3>${escola}</h3>
      ${seriesHTML}
    `;

    container.appendChild(card);
  });

  gerarGrafico(filtrados);
}

// ====== GRÁFICO ======
function gerarGrafico(dadosFiltrados) {
  const labels = dadosFiltrados.map(d => `${d.escola} - ${d.serie}`);
  const valores = dadosFiltrados.map(d => d.vagas);

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
          ticks: { stepSize: 1 }
        }
      }
    }
  });
}
