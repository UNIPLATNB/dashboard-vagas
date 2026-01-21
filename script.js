const url = "https://docs.google.com/spreadsheets/d/12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE/gviz/tq?tqx=out:json&sheet=dados_site";

let dados = [];
let grafico;

// Carrega dados
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
      .filter(d => d.regiao && d.escola);

    criarTags();
  });

// TAGS
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

// Atualiza cards + gráfico
function atualizar(regiao) {
  const filtrados = dados.filter(d => d.regiao === regiao);
  const container = document.getElementById("cardsContai
