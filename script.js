const planilhaId = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";

// pares fixos de colunas (série -> vaga)
const seriesMap = [
  { serie: 3, vaga: 4 },    // D / E
  { serie: 6, vaga: 7 },    // G / H
  { serie: 9, vaga: 10 },   // J / K
  { serie: 12, vaga: 13 },  // M / N
  { serie: 15, vaga: 16 },  // P / Q
  { serie: 18, vaga: 19 },  // S / T
  { serie: 21, vaga: 22 },  // V / W
  { serie: 24, vaga: 25 },  // Y / Z
  { serie: 27, vaga: 28 },  // AB / AC
  { serie: 30, vaga: 31 },  // AE / AF
  { serie: 33, vaga: 34 },  // AH / AI
  { serie: 36, vaga: 37 }   // AK / AL
];

function carregarRegiao(aba) {
  const url = `https://docs.google.com/spreadsheets/d/${planilhaId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(aba)}`;

  fetch(url)
    .then(r => r.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;
      const cards = document.getElementById("cards");
      cards.innerHTML = "";

      let cardAtual = null;
      let htmlAtual = "";

      for (let i = 4; i < rows.length; i++) {
        const c = rows[i].c;
        if (!c) continue;

        // se tem escola na coluna B, começa novo card
        if (typeof c[1]?.v === "string" && c[1].v.trim() !== "") {
          if (cardAtual) {
            cardAtual.innerHTML = htmlAtual;
            cards.appendChild(cardAtual);
          }

          cardAtual = document.createElement("div");
          cardAtual.className = "card";
          htmlAtual = `<h2>${c[1].v}</h2>`;
        }

        if (!cardAtual) continue;

        // lê séries dessa linha
        seriesMap.forEach(m => {
          const nomeSerie =
            typeof c[m.serie]?.v === "string"
              ? c[m.serie].v
              : null;

          const vagas = c[m.vaga]?.v ?? 0;

          if (nomeSerie) {
            htmlAtual += `<p><strong>${nomeSerie}:</strong> ${vagas} vaga(s)</p>`;
          }
        });
      }

      // adiciona o último card
      if (cardAtual) {
        cardAtual.innerHTML = htmlAtual;
        cards.appendChild(cardAtual);
      }
    });
}

const select = document.getElementById("regiao");
select.onchange = () => carregarRegiao(select.value);
carregarRegiao(select.value);
