document.addEventListener('DOMContentLoaded', async () => {
  const resultPesquisa = document.getElementById("resultPesquisa");
  const bttPesquisa = document.getElementById("bttPesquisa");
  const listaFuncionarios = document.getElementById("listaFuncionarios");
  const cargosButton = document.getElementById('cargos');
  const allButton = document.getElementById("all");
  const mediaProventos = document.getElementById("mediaProventos");
  const mediaDescontos = document.getElementById("mediaDescontos");
  const mediaLiquido = document.getElementById("mediaLiquido");

  async function fetchData() {
    const response = await fetch("https://raw.githubusercontent.com/Maiquinhocodigos/Projeto-final-web/main/funcionarios.json");
    const json = await response.json();
    return json.data;
  }

  function parseCurrency(valor) {
    if (typeof valor === 'number') {
      return valor;
    }
    if (typeof valor === 'string') {
      return parseFloat(valor.replace(/\./g, '').replace(',', '.').replace('R$ ', '')) || 0;
    }
    return 0;
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function calcularProventos(item) {
    let valor = parseCurrency(item.Proventos);
    if (valor < 100) {
      valor *= 1000;
    }
    return valor;
  }

  function calcularLiquido(item) {
    return parseCurrency(item["Líquido"]);
  }

  function calcularDescontos(proventos, liquido) {
    return proventos - liquido;
  }

  function mostraJson(data) {
    listaFuncionarios.innerHTML = '';
    let totalProventos = 0, totalLiquido = 0, totalDescontos = 0, count = 0;

    data.forEach(item => {
      const proventos = calcularProventos(item);
      const liquido = calcularLiquido(item);
      const descontos = calcularDescontos(proventos, liquido);

      totalProventos += proventos;
      totalLiquido += liquido;
      totalDescontos += descontos;
      count++;

      const div = document.createElement('div');
      div.className = 'result-item';
      div.innerHTML = `
        <div class="result-detalhes">
          <div><span>Nome:</span> ${item["Nome do funcionário"]}</div>
          <div><span>Cargo:</span> ${item.Cargo}</div>
          <div><span>Matrícula:</span> ${item.Matricula}</div>
          <div><span>Setor:</span> ${item.Setor}</div>
        </div>
        <div class="result-salarios">
          <div><span>Proventos:</span> ${formatarMoeda(proventos)}</div>
          <div><span>Descontos:</span> ${formatarMoeda(descontos)}</div>
          <div><span>Líquido:</span> ${formatarMoeda(liquido)}</div>
        </div>
      `;
      listaFuncionarios.appendChild(div);
    });

    if (count > 0) {
      mediaProventos.textContent = formatarMoeda(totalProventos / count);
      mediaDescontos.textContent = formatarMoeda(totalDescontos / count);
      mediaLiquido.textContent = formatarMoeda(totalLiquido / count);
    }
  }

  bttPesquisa.addEventListener('click', async () => {
    const query = resultPesquisa.value.toLowerCase();
    const data = await fetchData();
    const filteredData = data.filter(item =>
      item["Nome do funcionário"].toLowerCase().includes(query) ||
      item.Cargo.toLowerCase().includes(query) ||
      item.Matricula.toString().toLowerCase().includes(query)
    );
    mostraJson(filteredData);
  });

  allButton.addEventListener('click', async () => {
    const data = await fetchData();
    mostraJson(data);
  });

  cargosButton.addEventListener('click', async () => {
    const data = await fetchData();
    const cargos = [...new Set(data.map(item => item.Cargo))];

    let dropdown = document.querySelector('.dropdown');
    if (dropdown) {
        dropdown.remove();
    }

    dropdown = document.createElement('div');
    dropdown.className = 'dropdown';

    cargos.forEach(cargo => {
        const a = document.createElement('a');
        a.textContent = cargo;
        a.addEventListener('click', () => {
            const filteredData = data.filter(item => item.Cargo === cargo);
            mostraJson(filteredData);
            dropdown.classList.remove('show');
        });
        dropdown.appendChild(a);
    });

    cargosButton.appendChild(dropdown);
    dropdown.classList.toggle('show');
  });

  document.addEventListener('click', (event) => {
    const dropdown = document.querySelector('.dropdown');
    if (dropdown && !dropdown.contains(event.target) && !cargosButton.contains(event.target)) {
      dropdown.classList.remove('show');
    }
  });

  const data = await fetchData();
  mostraJson(data);
});

