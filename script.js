const planilhaId = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";

function carregarRegiao(nomeAba) {
  const url = `https://docs.google.com/spreadsheets/d/${planilhaId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(nomeAba)}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;

      const container = document.getElementById("cards");
      container.innerHTML = "";

      // começa APÓS o cabeçalho (linha 5)
      for (let i = 4; i < rows.length; i++) {
        const c = rows[i].c;

        if (!c || !c[1] || !c[1].v) continue; // coluna B – escola

        const escola = c[1].v;
        const card = document.createElement("div");
        card.className = "card";

        let html = `<h2>${escola}</h2>`;

        const dados = [
          { serie: c[3]?.v, vagas: c[4]?.v },   // D / E
          { serie: c[6]?.v, vagas: c[7]?.v },   // G / H
          { serie: c[9]?.v, vagas: c[10]?.v },  // J / K
          { serie: c[12]?.v, vagas: c[13]?.v }  // M / N
        ];

        dados.forEach(item => {
          if (item.serie) {
            const vagas = item.vagas !== null && item.vagas !== undefined
              ? item.vagas
              : 0;

            html += `<p><strong>${item.serie}:</strong> ${vagas} vaga(s)</p>`;
          }
        });

        card.innerHTML = html;
        container.appendChild(card);
      }
    })
    .catch(err => {
      console.error("Erro ao carregar dados:", err);
    });
}

const select = document.getElementById("regiao");
select.addEventListener("change", () => carregarRegiao(select.value));

// carrega ao abrir
carregarRegiao(select.value);
