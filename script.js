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

      let escolaAtual = null;

      // começa após o cabeçalho (linha 5)
      for (let i = 4; i < rows.length; i++) {
        const c = rows[i].c;
        if (!c) continue;

        // coluna B – escola
        if (c[1] && c[1].v) {
          escolaAtual = c[1].v;
        }

        // se ainda não tem escola, ignora
        if (!escolaAtual) continue;

        const dados = [
          { serie: c[3]?.v, vagas: c[4]?.v },   // D / E
          { serie: c[6]?.v, vagas: c[7]?.v },   // G / H
          { serie: c[9]?.v, vagas: c[10]?.v },  // J / K
          { serie: c[12]?.v, vagas: c[13]?.v }  // M / N
        ];

        // cria card se ainda não existir
        let card = document.querySelector(`[data-escola="${escolaAtual}"]`);

        if (!card) {
          card = document.createElement("div");
          card.className = "card";
          card.dataset.escola = escolaAtual;
          card.innerHTML = `<h2>${escolaAtual}</h2>`;
          container.appendChild(card);
        }

        dados.forEach(item => {
          if (item.serie) {
            const vagas = item.vagas ?? 0;
            const p = document.createElement("p");
            p.innerHTML = `<strong>${item.serie}:</strong> ${vagas} vaga(s)`;
            card.appendChild(p);
          }
        });
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
