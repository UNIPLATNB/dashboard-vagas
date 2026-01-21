const planilhaId = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";

function carregarRegiao(nomeAba) {
  const url = `https://docs.google.com/spreadsheets/d/${planilhaId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(nomeAba)}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;

      const cabecalho = rows[3].c; // linha 4
      const container = document.getElementById("cards");
      container.innerHTML = "";

      for (let i = 4; i < rows.length; i++) {
        const linha = rows[i].c;
        if (!linha || !linha[1]?.v) continue;

        const escola = linha[1].v;
        const card = document.createElement("div");
        card.className = "card";

        let html = `<h2>${escola}</h2>`;

        // percorre TODAS as colunas procurando séries
        for (let col = 3; col < cabecalho.length; col++) {
          const nomeSerie = cabecalho[col]?.v;

          if (nomeSerie) {
            const vagas = linha[col + 1]?.v ?? 0;
            html += `<p><strong>${nomeSerie}:</strong> ${vagas} vaga(s)</p>`;
          }
        }

        card.innerHTML = html;
        container.appendChild(card);
      }
    })
    .catch(err => console.error("Erro:", err));
}

const select = document.getElementById("regiao");
select.addEventListener("change", () => carregarRegiao(select.value));

carregarRegiao(select.value);
