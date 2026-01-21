const planilhaId = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";

const abas = {
  "Núcleo Bandeirante": "Núcleo Bandeirante",
  "Candangolândia": "Candangolândia",
  "Riacho Fundo I": "Riacho Fundo I"
  "Riacho Fundo II": "Riacho Fundo II"
};

function carregarRegiao(nomeAba) {
  const url = `https://docs.google.com/spreadsheets/d/${planilhaId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(nomeAba)}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substr(47).slice(0, -2));
      const linhas = json.table.rows;

      const container = document.getElementById("cards");
      container.innerHTML = "";

      linhas.slice(4).forEach(linha => {
        if (!linha.c[0]) return;

        const escola = linha.c[0].v;
        const card = document.createElement("div");
        card.className = "card";

        let html = `<h2>${escola}</h2>`;

        for (let i = 1; i < linha.c.length; i += 2) {
          const vagas = linha.c[i]?.v;
          if (vagas && vagas > 0) {
            html += `<p>Vagas: ${vagas}</p>`;
          }
        }

        card.innerHTML = html;
        container.appendChild(card);
      });
    });
}

const select = document.getElementById("regiao");
select.addEventListener("change", () => carregarRegiao(select.value));

carregarRegiao(select.value);
