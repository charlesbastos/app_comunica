// Configuração das imagens (Substitua pelos seus arquivos reais se necessário)
const imagensAcao = ['quero.jpg','escolhe.jpg', 'sim.jpg', 'não.jpg']; 
const imagensObjetos = ['almoçar.jpg', 'tomar café.jpg', 'biscoito piraque morango.jpg', 'batata frita palito.jpg', 'chocolate nestle.jpg', 'macarrão.jpg', 'pizza.jpg'];

// Configuração das imagens

// Estado global do item atualmente arrastado
let itemArrastado = null;
let textoDigitadoUsuario = "";

// Elementos da Interface
const containerSuperior = document.getElementById('container-superior');
const containerInferior = document.getElementById('container-inferior');
const caixaFrase = document.getElementById('caixa-frase');
const btnAudio = document.getElementById('btn-audio');
const btnLimpar = document.getElementById('btn-limpar');
const chkDigitar = document.getElementById('chk-digitar');
const chkAuto = document.getElementById('chk-auto');

const cards = [
    { id: 2, element: document.getElementById('card-2'), nomeElement: document.getElementById('nome-card-2'), btnLimparCard: document.getElementById('btn-limpar-card-2'), file: null },
    { id: 3, element: document.getElementById('card-3'), nomeElement: document.getElementById('nome-card-3'), btnLimparCard: document.getElementById('btn-limpar-card-3'), file: null },
    { id: 4, element: document.getElementById('card-4'), nomeElement: document.getElementById('nome-card-4'), btnLimparCard: document.getElementById('btn-limpar-card-4'), file: null },
    { id: 5, element: document.getElementById('card-5'), nomeElement: document.getElementById('nome-card-5'), btnLimparCard: document.getElementById('btn-limpar-card-5'), file: null }
];

// Inicialização segura da aplicação
function init() {
    renderMiniaturas(imagensAcao, 'imagens/acao/', containerSuperior, 'acao');
    renderMiniaturas(imagensObjetos, 'imagens/objetos/', containerInferior, 'objetos');
    configurarDragAndDrop();
    configurarBotoesLimparCard();
    limparAplicativo();
}

function renderMiniaturas(lista, path, container, origem) {
    container.innerHTML = '';
    lista.forEach(arquivo => {
        // Criar elemento wrapper estruturado para segurar imagem + texto embaixo
        const wrapper = document.createElement('div');
        wrapper.classList.add('miniatura-wrapper');

        const img = document.createElement('img');
        img.src = path + arquivo;
        img.classList.add('miniatura');
        img.draggable = true;
        
        const nomeSemJpg = arquivo.toLowerCase().replace('.jpg', '');
        
        const txt = document.createElement('span');
        txt.classList.add('miniatura-nome');
        txt.textContent = nomeSemJpg;

        img.addEventListener('dragstart', () => {
            itemArrastado = {
                filename: nomeSemJpg,
                origem: origem,
                src: path + arquivo
            };
        });

        img.addEventListener('dragend', () => {
            itemArrastado = null;
        });

        wrapper.appendChild(img);
        wrapper.appendChild(txt);
        container.appendChild(wrapper);
    });
}

function configurarDragAndDrop() {
    cards.forEach(cardObj => {
        const card = cardObj.element;

        card.addEventListener('dragover', (e) => {
            e.preventDefault();
            if (itemArrastado && card.dataset.origem === itemArrastado.origem) {
                card.classList.add('drag-over');
            }
        });

        card.addEventListener('dragleave', () => {
            card.classList.remove('drag-over');
        });

        card.addEventListener('drop', (e) => {
            e.preventDefault();
            card.classList.remove('drag-over');
            
            if (!itemArrastado) return;
            if (card.dataset.origem !== itemArrastado.origem) return;

            const filename = itemArrastado.filename;
            const src = itemArrastado.src;

            if (cardObj.id === 2) {
                atualizarCard(cardObj, filename, src);
            } else if (cardObj.id === 3) {
                atualizarCard(cardObj, filename, src);
            } else if (cardObj.id === 4) {
                const card3 = cards.find(c => c.id === 3).file;
                if (card3 && card3 !== filename) {
                    atualizarCard(cardObj, filename, src);
                }
            } else if (cardObj.id === 5) {
                const card3 = cards.find(c => c.id === 3).file;
                const card4 = cards.find(c => c.id === 4).file;
                if (card3 && card4 && filename !== card3 && filename !== card4) {
                    atualizarCard(cardObj, filename, src);
                }
            }
            
            atualizarFraseEControles();
        });
    });
}

function configurarBotoesLimparCard() {
    cards.forEach(cardObj => {
        cardObj.btnLimparCard.addEventListener('click', () => {
            cardObj.element.innerHTML = '';
            cardObj.nomeElement.textContent = '';
            cardObj.file = null;
            cardObj.btnLimparCard.disabled = true;
            atualizarFraseEControles();
        });
    });
}

function atualizarCard(cardObj, filename, src) {
    cardObj.element.innerHTML = `<img src="${src}" alt="${filename}">`;
    cardObj.nomeElement.textContent = filename;
    cardObj.file = filename;
    cardObj.btnLimparCard.disabled = false; // Habilita o botão ao receber figura
}

function atualizarFraseEControles() {
    const c2 = cards.find(c => c.id === 2).file;
    const c3 = cards.find(c => c.id === 3).file;
    const c4 = cards.find(c => c.id === 4).file;
    const c5 = cards.find(c => c.id === 5).file;

    // Atualiza dinamicamente o estado de cada botão individual
    cards.forEach(cardObj => {
        cardObj.btnLimparCard.disabled = !cardObj.file;
    });

    const tresPrimeirosProntos = !!(c2 && c3);

    if (tresPrimeirosProntos) {
        let termos = ['gabriel', c2, c3];
        if (c4) termos.push(c4);
        if (c5) termos.push(c5);

        let fraseFinal = termos.join(' ');
        
        if (chkDigitar.checked && textoDigitadoUsuario) {
            fraseFinal += ' ' + textoDigitadoUsuario;
        }

        caixaFrase.value = fraseFinal;
        caixaFrase.style.visibility = 'visible';
        
        btnAudio.disabled = false;
        chkDigitar.disabled = false;
        chkAuto.disabled = false;

        caixaFrase.disabled = !chkDigitar.checked;

        if (chkAuto.checked) {
            falarFrase(fraseFinal);
        }
    } else {
        caixaFrase.value = '';
        caixaFrase.style.visibility = 'hidden';
        caixaFrase.disabled = true;
        btnAudio.disabled = true;
        chkDigitar.disabled = true;
        chkDigitar.checked = false;
        //chkAuto.disabled = true;
        //chkAuto.checked = false;
    }
}

function falarFrase(texto) {
    if ('speechSynthesis' in window && texto) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(texto);
        utterance.lang = 'pt-BR';
        window.speechSynthesis.speak(utterance);
    }
}

chkDigitar.addEventListener('change', () => {
    if (!chkDigitar.checked) {
        textoDigitadoUsuario = "";
    }
    atualizarFraseEControles();
});

chkAuto.addEventListener('change', () => {
    atualizarFraseEControles();
});

caixaFrase.addEventListener('input', () => {
    if (chkDigitar.checked) {
        const c2 = cards.find(c => c.id === 2).file;
        const c3 = cards.find(c => c.id === 3).file;
        const c4 = cards.find(c => c.id === 4).file;
        const c5 = cards.find(c => c.id === 5).file;

        let termosBase = ['gabriel', c2, c3];
        if (c4) termosBase.push(c4);
        if (c5) termosBase.push(c5);
        const fraseBase = termosBase.join(' ');

        if (caixaFrase.value.startsWith(fraseBase)) {
            textoDigitadoUsuario = caixaFrase.value.substring(fraseBase.length).trim();
        } else {
            caixaFrase.value = fraseBase + (textoDigitadoUsuario ? ' ' + textoDigitadoUsuario : '');
        }
    }
});

btnAudio.addEventListener('click', () => {
    falarFrase(caixaFrase.value);
});

function limparAplicativo() {
    cards.forEach(cardObj => {
        cardObj.element.innerHTML = '';
        cardObj.nomeElement.textContent = '';
        cardObj.file = null;
        cardObj.btnLimparCard.disabled = true;
    });
    textoDigitadoUsuario = "";
    atualizarFraseEControles();
}

btnLimpar.addEventListener('click', limparAplicativo);

window.onload = init;