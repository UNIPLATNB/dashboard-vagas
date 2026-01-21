const url =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vS_jN8kcgwKuyt0tzJrNaDbrYIWE24WLKwdLSW6TCgFIp7YvV0Nu7Hrhv6fZUBFtwJESKynP5HaaRCs/pub?output=csv"
  + "&nocache=" + Date.now();

fetch(url)
  .then(res => res.text())
  .then(text => {
    const linhas = text.split("\n");
    const container = document.getElementById("cards");
    container.innerHTML = "";

    // começa a ler a partir da linha 5 (índice 4)
    linhas.slice(4).forEach(linha => {
      if (!linha.trim()) return;

      const colunas = linha.split(",");
      const escola = colunas[0];

      if (!escola) return;

      const card = document.createElement("div");
      card.className = "card";

      let html = `<h2>${escola}</h2>`;

      // percorre etapas + va
