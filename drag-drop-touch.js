/**
 * DragDropTouch Mobile v2 (Corrigido para evitar travamento de tela)
 * Traduz toques em eventos de Drag & Drop sem violar listeners passivos do navegador.
 */
(function () {
    if (!('ontouchstart' in window)) return;

    var itemArrastadoMobile = null;
    var elementoEspelho = null;

    window.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;

        var target = e.target;
        // Busca se o elemento ou algum pai dele é arrastável
        while (target && !target.draggable) {
            target = target.parentElement;
        }

        if (target && target.draggable) {
            itemArrastadoMobile = target;

            // Cria um clone visual da imagem sob o dedo para dar feedback ao usuário
            elementoEspelho = target.cloneNode(true);
            elementoEspelho.style.position = 'fixed';
            elementoEspelho.style.pointerEvents = 'none';
            elementoEspelho.style.opacity = '0.7';
            elementoEspelho.style.zIndex = '9999';
            elementoEspelho.style.width = target.offsetWidth + 'px';
            elementoEspelho.style.height = target.offsetHeight + 'px';
            document.body.appendChild(elementoEspelho);

            moverEspelho(e.touches[0]);

            // Dispara o evento dragstart que o seu app.js espera
            var evtStart = document.createEvent('Event');
            evtStart.initEvent('dragstart', true, true);
            target.dispatchEvent(evtStart);
        }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
        if (!itemArrastadoMobile || e.touches.length !== 1) return;

        var touch = e.touches[0];
        moverEspelho(touch);

        // Encontra qual elemento está embaixo do dedo no momento
        var elementoSobODedo = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!elementoSobODedo) return;

        // Procura se o elemento de baixo é um dos seus cards receptores
        var cardTarget = elementoSobODedo;
        while (cardTarget && !cardTarget.classList.contains('card')) {
            cardTarget = cardTarget.parentElement;
        }

        if (cardTarget) {
            // Dispara o dragover esperado pelo app.js para aplicar estilos/regras
            var evtOver = document.createEvent('Event');
            evtOver.initEvent('dragover', true, true);
            evtOver.preventDefault = function() {}; // Simula o preventDefault exigido no dragover
            cardTarget.dispatchEvent(evtOver);
        }
    }, { passive: true });

    window.addEventListener('touchend', function (e) {
        if (!itemArrastadoMobile) return;

        // Remove o clone visual da tela
        if (elementoEspelho && elementoEspelho.parentNode) {
            elementoEspelho.parentNode.removeChild(elementoEspelho);
        }

        var touch = e.changedTouches[0];
        var elementoSobODedo = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (elementoSobODedo) {
            var cardTarget = elementoSobODedo;
            while (cardTarget && !cardTarget.classList.contains('card')) {
                cardTarget = cardTarget.parentElement;
            }

            if (cardTarget) {
                // Remove a classe de destaque visual ao soltar
                cardTarget.classList.remove('drag-over');

                // Dispara o evento de drop esperado pela lógica do seu app.js
                var evtDrop = document.createEvent('Event');
                evtDrop.initEvent('drop', true, true);
                cardTarget.dispatchEvent(evtDrop);
            }
        }

        // Dispara o término do arrasto
        var evtEnd = document.createEvent('Event');
        evtEnd.initEvent('dragend', true, true);
        itemArrastadoMobile.dispatchEvent(evtEnd);

        // Limpa o estado global
        itemArrastadoMobile = null;
        elementoEspelho = null;
    });

    function moverEspelho(touch) {
        if (!elementoEspelho) return;
        // Centraliza a imagem clonada exatamente na ponta do dedo do usuário
        elementoEspelho.style.left = (touch.clientX - (elementoEspelho.offsetWidth / 2)) + 'px';
        elementoEspelho.style.top = (touch.clientY - (elementoEspelho.offsetHeight / 2)) + 'px';
    }
})();
