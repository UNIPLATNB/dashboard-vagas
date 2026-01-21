const url = "https://docs.google.com/spreadsheets/d/12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE/gviz/tq?tqx=out:json&sheet=dados_site";

let dados = [];
let grafico;

fetch(url)
  .then(res => res.text())
  .then(text => {
    const json = JSON.parse(text.substring(47).slice(0, -2));
    dados = json.table.rows.map(r => ({
      regiao: r.c[0]?.v,
      escola: r.c[1]?.v,
      serie: r.c[2]?.v,
      vagas: r.c[3]?.v
    }));

    carregarRegioes();
  });

function carregarRegioes() {
  const select = document.getElementById("regiaoSelect");
  const regioes = [...new Set(dados.map(d => d.regiao))];

  regioes.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    select.appendChild(opt);
  });

  select.addEventListener("change", () => atualizar(select.value));
  atualizar(regioes[0]);
}

function atualizar(regiao) {
  const filtrados = dados.filter(d => d.regiao === regiao);
  const tbody = document.getElementById("tabelaDados");
  tbody.innerHTML = "";

  filtrados.forEach(d => {
    tbody.innerHTML += `
      <tr>
        <td>${d.escola}</td>
        <td>${d.serie}</td>
        <td>${d.vagas}</td>
      </tr>
    `;
  });

  gerarGrafico(filtrados);
}

function gerarGrafico(dados) {
  const labels = dados.map(d => `${d.escola} - ${d.serie}`);
  const valores = dados.map(d => d.vagas);

  if (grafico) grafico.destroy();

  grafico = new Chart(document.getElementById("graficoVagas"), {
    type: "bar",
    data: {
      labels: labels,
      datasets: [{
        label: "Vagas disponíveis",
        data: valores
      }]
    }
  });
}
