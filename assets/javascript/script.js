document.addEventListener('DOMContentLoaded', async () => {
  const resultPesquisa = document.getElementById("resultPesquisa");
  const bttPesquisa = document.getElementById("bttPesquisa");
  const listaFuncionarios = document.getElementById("listaFuncionarios");
  const allButton = document.getElementById("all");
  const cargosButton = document.getElementById('cargos');
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
      return parseFloat(valor.replace('R$ ', '').replace(/\./g, '').replace(',', '.')) || 0;
    }
    return 0;
  }

  function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  function mostraJson(data) {
    listaFuncionarios.innerHTML = '';

    data.forEach(item => {
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
          <div><span>Proventos:</span> ${item.Proventos}</div>
          <div><span>Descontos:</span> ${item.Descontos}</div>
          <div><span>Líquido:</span> ${item["Líquido"]}</div>
        </div>
      `;
      listaFuncionarios.appendChild(div);
    });

    if (data.length > 0) {
      let totalProventos = 0, totalDescontos = 0, totalLiquido = 0, count = 0;
      data.forEach(item => {
        const proventos = parseCurrency(item.Proventos);
        const descontos = parseCurrency(item.Descontos);
        const liquido = parseCurrency(item["Líquido"]);
        if (!isNaN(proventos) && !isNaN(descontos) && !isNaN(liquido)) {
          totalProventos += proventos;
          totalDescontos += descontos;
          totalLiquido += liquido;
          count++;
        }
      });
      if (count > 0) {
        mediaProventos.textContent = formatarMoeda(totalProventos / count);
        mediaDescontos.textContent = formatarMoeda(totalDescontos / count);
        mediaLiquido.textContent = formatarMoeda(totalLiquido / count);
      }
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
    const cargos = [...new Set(data.map(item => item.Cargo.split(' - ')[1]))]; // Obter cargos únicos

    
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
            const filteredData = data.filter(item => item.Cargo.split(' - ')[1] === cargo);
            displayResults(filteredData);
            dropdown.classList.remove('show'); // Fechar dropdown ao selecionar um cargo
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

