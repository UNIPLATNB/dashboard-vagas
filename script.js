const planilhaId = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";

function carregarRegiao(nomeAba) {
  const url = `https://docs.google.com/spreadsheets/d/${planilhaId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(nomeAba)}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const linhas = json.table.rows;

      const container = document.getElementById("cards");
      container.innerHTML = "";

      // começa na linha 5 (índice 4) – depois do cabeçalho
      linhas.slice(4).forEach(linha => {
        if (!linha.c[1]) return; // coluna B (escola)

        const escola = linha.c[1].v;
        const card = document.createElement("div");
        card.className = "card";

        let html = `<h2>${escola}</h2>`;

        const etapas = [
          { nome: linha.c[3]?.v, vagas: linha.c[4]?.v },   // D / E
          { nome: linha.c[6]?.v, vagas: linha.c[7]?.v },   // G / H
          { nome: linha.c[9]?.v, vagas: linha.c[10]?.v },  // J / K
          { nome: linha.c[12]?.v, vagas: linha.c[13]?.v }  // M / N
        ];

        etapas.forEach(etapa => {
          if (etapa.nome) {
            const vagas = etapa.vagas ?? 0;
            html += `<p><strong>${etapa.nome}:</strong> ${vagas} vaga(s)</p>`;
          }
        });

        card.innerHTML = html;
        container.appendChild(card);
      });
    })
    .catch(err => {
      console.error("Erro ao carregar dados:", err);
    });
}

const select = document.getElementById("regiao");
select.addEventListener("change", () => carregarRegiao(select.value));

// carrega a primeira região ao abrir
carregarRegiao(select.value);
