document.addEventListener('DOMContentLoaded', async () => {
    const resultPesquisa = document.getElementById("resultPesquisa");
    const bttPesquisa = document.getElementById("bttPesquisa");
    const listaFuncionarios = document.getElementById("listaFuncionarios");
    const allButton = document.getElementById("all");

    async function fetchData() {
        const response = await fetch("https://raw.githubusercontent.com/Maiquinhocodigos/Projeto-final-web/refs/heads/main/funcionarios.json"); // Substitua 'dados.json' pelo caminho do seu arquivo JSON
        const json = await response.json();
        return json.data;
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
                    <div><span>Líquido:</span> ${item.Líquido}</div>
                </div>
            `;
            listaFuncionarios.appendChild(div);
        });
    }

    function filterData(data, query) {
        return data.filter(item => 
            item["Nome do funcionário"].toLowerCase().includes(query) ||
            item.Cargo.toLowerCase().includes(query) ||
            item.Matricula.toString().toLowerCase().includes(query)
        );
    }

        bttPesquisa.addEventListener('click', async () => {
        const query = resultPesquisa.value.toLowerCase();
        const data = await fetchData();
        const filteredData = filterData(data, query);
        mostraJson(filteredData);
    });


    allButton.addEventListener('click', async () => {
        resultPesquisa.value = '';
        const data = await fetchData();
        mostraJson(data);
    });

    // Buscar e exibir dados ao carregar a página
    const data = await fetchData();
    mostraJson(data);
});
