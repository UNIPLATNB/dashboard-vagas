const planilhaId = "12Ou7DzGLBmYIxUDJqvgRnVUejheSMTSoD0dtkC_50BE";

// índices das colunas (começando do zero)
const COL_ESCOLA = 1; // coluna B

const SERIES = [
  { nome: 3, vagas: 4 },   // D / E
  { nome: 6, vagas: 7 },   // G / H
  { nome: 9, vagas: 10 },  // J / K
  { nome: 12, vagas: 13 }  // M / N
];

function carregarRegiao(nomeAba) {
  const url = `https://docs.google.com/spreadsheets/d/${planilhaId}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(nomeAba)}`;

  fetch(url)
    .then(res => res.text())
    .then(text => {
      const json = JSON.parse(text.substring(47, text.length - 2));
      const linhas = json.table.rows;

      const container = document.getElementById("cards");
      container.innerHTML = "";

      // começa a partir da linha 5 (índice 4)
      linhas.slice(4).forEach(linha => {
        if (!linha.c[COL_ESCOLA]) return;

        const escola = linha.c[COL_ESCOLA].v;

        const card = document.createElement("div");
        card.className = "card";

        let html = `<h2>${escola}</h2>`;

        SERIES.forEach(serie => {
          const nomeSerie = linha.c[serie.nome]?.v || "—";
          const vagas = linha.c[serie.vagas]?.v ?? 0;

          html += `<p><strong>${nomeSerie}:</strong> ${vagas} vaga(s)</p>`;
        });

        card.in
