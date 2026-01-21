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

      // começa após o cabeçalho (linha 5)
      for (let i = 4; i < rows.length; i++) {
        const c = rows[i].c;

        if (!c || !c[1] || !c[1].v) continue; // coluna B

        const escola = c[1].v;
        const card = document.createElement("div");
        card.cla
