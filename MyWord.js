document.addEventListener("DOMContentLoaded", function() {
    const botNova = document.getElementById("botnova");
    const botVelha = document.getElementById("botvelha");
    const botFreq = document.getElementById("botfreq");
    const texto = document.getElementById("texto");
    const botpares = document.getElementById("botpares");
    const procurarpar = document.getElementById("procurarpar");
    const suggestedWordElement = document.getElementById("suggestedWord");

    if (botNova && botVelha && botFreq && texto && botpares) {
        botNova.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                FuncaoCompleta();
                mostrarpares();
                LimparCampos();
                frequentes();
                setTimeout(() => botVelha.focus(), 0);
                procurarNoCluster(botNova.value); 
            }
        });
        botNova.addEventListener("input", function(event) {
            const palavraNova = event.target.value.trim(); 
            if (palavraNova) {
                procurarNoCluster(palavraNova);
            }
        });
        

        botVelha.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                botNova.focus();
            }
        });

        botFreq.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                frequentes();
            }
        });

        texto.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                FuncaoCompleta();
                mostrarpares();
                LimparCampos();
                frequentes();
            }
        });

        botpares.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                excluirinverter();
                apagarnumero();
                const textocom = document.getElementById("texto");
                const textoAtualizado = substituirTexto(textocom.value, palavrasoriginais, palavrasnovas);
                textocom.value = textoAtualizado;
            }
        });

        procurarpar.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                event.preventDefault();
                procurarPar();
            }
        });
    } else {
        console.error("Elementos não encontrados no DOM.");
    }
});



const palavrasoriginais = [];
const palavrasnovas = [];

function CapturarValores() {
    const word = document.querySelector("#botvelha");
    if (word && word.value.trim() && !palavrasoriginais.includes(word.value.trim())) {
        palavrasoriginais.push(word.value.trim());
    } else {
        console.warn("Palavra já adicionada ou inválida.");
    }
}

function CapturarValores2() {
    const word2 = document.querySelector("#botnova");
    if (word2 && word2.value.trim() && !palavrasnovas.includes(word2.value.trim())) {
        palavrasnovas.push(word2.value.trim());
    } else {
        console.warn("Palavra já adicionada ou inválida.");
    }
}


function substituirTexto(texto, palavrasoriginais, palavrasnovas) {
    let textoSubstituido = texto;
    for (let i = 0; i < palavrasoriginais.length; i++) {
        const regex = new RegExp('\\b' + palavrasoriginais[i] + '\\b', 'g');
        textoSubstituido = textoSubstituido.replace(regex, palavrasnovas[i] || '');
    }
    return textoSubstituido;
}


function FuncaoCompleta() {
    CapturarValores();
    CapturarValores2();
    const textocom = document.getElementById("texto");
    const textoOriginal = textocom.value;
    const textoSubstituido = substituirTexto(textoOriginal, palavrasoriginais, palavrasnovas);
    textocom.value = textoSubstituido;
}


function mostrarpares() {
    const ul = document.getElementById("listapares");
    ul.innerHTML = "";
    for (let i = 0; i < palavrasoriginais.length; i++) {
        const li = document.createElement("li");
        li.textContent = palavrasoriginais[i] + ':' + palavrasnovas[i] + ' código: ' + i;
        ul.appendChild(li);
    }
}


function LimparCampos() {
    document.getElementById("botvelha").value = "";
    document.getElementById("botnova").value = "";
}


function excluirinverter() {
    const excluir = document.getElementById("botpares");
    const indice = parseInt(excluir.value);
    if (!isNaN(indice) && indice >= 0 && indice < palavrasoriginais.length) {
        const palavraVelha = palavrasoriginais[indice];
        const palavraNova = palavrasnovas[indice];
        palavrasoriginais.splice(indice, 1);
        palavrasnovas.splice(indice, 1);
        const textocom = document.getElementById("texto");
        textocom.value = substituirTexto(textocom.value, [palavraNova], [palavraVelha]);
        mostrarpares();
    } else {
        console.warn("Índice inválido ou fora do alcance.");
    }
}


function apagarnumero() {
    const excluir = document.getElementById("botpares");
    excluir.value = "";
}


function procurarPar() {
    const parProcurado = document.getElementById("procurarpar").value.trim().toLowerCase();
    if (!parProcurado) {
        mostrarpares(); 
        return;
    }

    const ul = document.getElementById("listapares");
    ul.innerHTML = ""; 

    for (let i = 0; i < palavrasoriginais.length; i++) {
        const original = palavrasoriginais[i].toLowerCase();
        const nova = palavrasnovas[i].toLowerCase();
        
        if (original.includes(parProcurado) || nova.includes(parProcurado)) {
            const li = document.createElement("li");
            li.textContent = palavrasoriginais[i] + ':' + palavrasnovas[i] + ' código: ' + i;
            ul.appendChild(li);
        }
    }
}


function frequentes() {
    const texto = document.getElementById("texto").value;
    const palavras = texto.match(/[\p{L}\p{N}]+/gu);
    if (!palavras) return;
    const contagemPalavras = {};
    palavras.forEach(palavra => {
        palavra = palavra.toLowerCase();
        contagemPalavras[palavra] = (contagemPalavras[palavra] || 0) + 1;
    });
    const palavrasOrdenadas = Object.entries(contagemPalavras)
        .sort((a, b) => b[1] - a[1]);
    const limite = parseInt(document.querySelector("#botfreq").value, 10) || 10;
    if (isNaN(limite) || limite <= 0) {
        return;
    }
    const listaPalavras = palavrasOrdenadas.slice(0, limite);
    const ul = document.getElementById("listafreq");
    ul.innerHTML = "";
    listaPalavras.forEach(([palavra, contagem]) => {
        const li = document.createElement("li");
        li.textContent = `${palavra}: ${contagem}`;
        ul.appendChild(li);
    });
}


function importarParesTXT(event) {
    const file = event.target.files[0]; 
    if (!file) {
        console.warn("Nenhum arquivo selecionado.");
        return;
    }

    const reader = new FileReader(); 

    reader.onload = function(e) {
        const conteudo = e.target.result; 
        const linhas = conteudo.split('\n'); 

        linhas.forEach(linha => {
            const [original, nova] = linha.split(':');
            if (original && original.trim()) {
                palavrasoriginais.push(original.trim());
                palavrasnovas.push(nova ? nova.trim() : ""); 
            }
        });

        console.log("Pares importados com sucesso.");
        mostrarpares(); 
    };

    reader.onerror = function() {
        console.error("Erro ao ler o arquivo.");
    };

    reader.readAsText(file);
}
document.getElementById("importarTXT").addEventListener("change", importarParesTXT);

document.getElementById('info').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'flex';
});

document.getElementById('close-modal').addEventListener('click', () => {
    document.getElementById('modal').style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('modal')) {
        document.getElementById('modal').style.display = 'none';
    }
});


function exportarParesParaTXT() {
    const listaParesElement = document.getElementById("listapares");
    const itens = listaParesElement.getElementsByTagName("li");

    const pares = Array.from(itens).map(item => {
        const texto = item.textContent.trim();
        const indexCodigo = texto.lastIndexOf(" código: ");
        return indexCodigo !== -1 ? texto.slice(0, indexCodigo) : texto;
    });

    if (pares.length === 0) {
        alert("A lista de pares está vazia. Não há nada para exportar.");
        return;
    }

    const conteudo = pares.join("\n");
    const blob = new Blob([conteudo], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "lista_pares.txt"; 
    link.click(); 
    URL.revokeObjectURL(url);
}



function procurarNoCluster(palavraNova) {
    if (!palavraNova) {
        console.log("Palavra vazia, não há o que procurar.");
        return;
    }

    console.log("Carregando clusters...");
    console.log(`Palavra recebida: "${palavraNova}"`);

    fetch('clusters.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo de clusters.');
            }
            return response.json();
        })
        .then(clusters => {
            let suggestedWord = "nenhuma"; 

            // Normaliza a palavra
            palavraNova = palavraNova.trim().normalize("NFC"); 

            console.log(`Procurando pela palavra: "${palavraNova}"`);

            let palavraEncontrada = false;

          
            for (const clusterKey in clusters) {
                if (Array.isArray(clusters[clusterKey])) {
                    if (clusters[clusterKey].some(word => word.trim().normalize("NFC") === palavraNova)) {
                        // Escolhe uma palavra aleatória do cluster
                        const palavrasDoCluster = clusters[clusterKey];
                        const indiceAleatorio = Math.floor(Math.random() * palavrasDoCluster.length);
                        suggestedWord = palavrasDoCluster[indiceAleatorio];
                        palavraEncontrada = true;
                        break;
                    }
                }
            }

            if (palavraEncontrada) {
                console.log(`Palavra encontrada no cluster! Palavra aleatória do cluster: ${suggestedWord}`);
            } else {
                console.log("Palavra não encontrada no cluster.");
            }

          
            const suggestedWordElement = document.getElementById("suggestedWord");
            if (suggestedWordElement) {
                suggestedWordElement.textContent = suggestedWord;
            }
        })
        .catch(error => {
            console.error("Erro ao buscar os clusters:", error);
        });
}
