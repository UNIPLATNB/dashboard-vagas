const url = "COLE_AQUI_O_LINK_DO_CSV";

fetch(url)
  .then(res => res.text())
  .then(text => {
    const linhas = text.split("\n");
    const cabecalho = linhas[3].split(",");

    const container = document.getElementById("cards");

    linhas.slice(4).forEach(linha => {
      if (!linha.trim()) return;

      const colunas = linha.split(",");
      const escola = colunas[0];

      if (!escola) return;

      const card = document.createElement("div");
      card.className = "card";

      let html = `<h2>${escola}</h2>`;

      for (let i = 1; i < cabecalho.length; i += 2) {
        const etapa = cabecalho[i];
        const vagas = colunas[i] || "0";
        html += `<p><strong>${etapa}:</strong> ${vagas}</p>`;
      }

      card.innerHTML = html;
      container.appendChild(card);
    });
  });
