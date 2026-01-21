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

      // pula as 4 primeiras linhas (antes do cabeçalho)
      linhas.slice(4).forEach(linha => {
        if (!linha.c[0]) return;

        const escola = linha.c[0].v;
        const card = document.createElement("div");
        card.className = "card";

        let html = `<h2>${escola}</h2>`;

        for (let i = 1; i < linha.c.length; i += 2) {
          const vagas = linha.c[i]?.v;
          if (vagas && vagas > 0) {
            html += `<p><strong>Vagas:</strong> ${vagas}</p>`;
          }
        }

        card.innerHTML = html;
        container.appendChild(card);
      });
    });
}

const select = document.getElementById("regiao");
select.addEventListener("change", () => carregarRegiao(select.value));

// carrega a primeira região automaticamente
carregarRegiao(select.value);
