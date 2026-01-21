function normalizar(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/[^a-z]/g, "");
}

function parseCSVComCabecalho(csv) {
  const linhas = csv.trim().split("\n");

  const cabecalhoOriginal = linhas.shift().split(",");
  const cabecalho = cabecalhoOriginal.map(h => normalizar(h));

  return linhas.map(linha => {
    const valores = [];
    let atual = "";
    let aspas = false;

    for (let c of linha) {
      if (c === '"') aspas = !aspas;
      else if (c === "," && !aspas) {
        valores.push(atual);
        atual = "";
      } else atual += c;
    }
    valores.push(atual);

    const obj = {};
    cabecalho.forEach((col, i) => {
      obj[col] = (valores[i] || "").replace(/^"|"$/g, "").trim();
    });

    return obj;
  });
}
