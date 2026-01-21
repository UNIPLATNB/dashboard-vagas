const planilhaId = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";

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
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const rows = json.table.rows;
      const cards = document.getElementById("cards");
      cards.innerHTML = "";

      for (let i = 4; i < rows.length; i++) {
        const c = rows[i].c;
        if (!c || !c[1]?.v) continue;

        let html = `<h2>${c[1].v}</h2>`;

        seriesMap.forEach(m => {
          const nomeSerie =
            typeof c[m.serie]?.v === "string"
              ? c[m.serie].v
              : null;

          const vagas = c[m.vaga]?.v ?? 0;

          if (nomeSerie) {
            html += `<p><strong>${nomeSerie}:</strong> ${vagas} vaga(s)</p>`;
          }
        });

        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = html;
        cards.appendChild(card);
      }
    });
}

const select = document.getElementById("regiao");
select.onchange = () => carregarRegiao(select.value);
carregarRegiao(select.value);
