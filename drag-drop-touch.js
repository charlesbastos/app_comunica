/**
 * DragDropTouch Mobile v4 (Correção de Menu de Contexto e Sobreposição)
 * Remove menus de contexto e clones órfãos ao arrastar em dispositivos móveis.
 */
(function () {
    if (!('ontouchstart' in window)) return;

    var itemArrastadoMobile = null;
    var elementoEspelho = null;

    // Previne que o menu de contexto do sistema apareça nas miniaturas arrastáveis
    window.addEventListener('contextmenu', function (e) {
        var target = e.target;
        while (target && target !== document.body) {
            if (target.draggable || target.classList.contains('miniatura')) {
                e.preventDefault();
                return false;
            }
            target = target.parentElement;
        }
    }, true);

    window.addEventListener('touchstart', function (e) {
        if (e.touches.length !== 1) return;

        var target = e.target;
        while (target && !target.draggable) {
            target = target.parentElement;
        }

        if (target && target.draggable) {
            itemArrastadoMobile = target;

            // Remove qualquer espelho anterior órfão que possa ter ficado preso por segurança
            limparEspelhosOrfaos();

            // Cria o clone sob o dedo de forma limpa
            elementoEspelho = target.cloneNode(true);
            elementoEspelho.classList.add('mobile-drag-mirror'); // Classe para identificação fácil
            elementoEspelho.style.position = 'fixed';
            elementoEspelho.style.pointerEvents = 'none';
            elementoEspelho.style.opacity = '0.6';
            elementoEspelho.style.zIndex = '99999';
            elementoEspelho.style.width = target.offsetWidth + 'px';
            elementoEspelho.style.height = target.offsetHeight + 'px';
            document.body.appendChild(elementoEspelho);

            var touch = e.touches[0];
            elementoEspelho.style.left = (touch.clientX - (elementoEspelho.offsetWidth / 2)) + 'px';
            elementoEspelho.style.top = (touch.clientY - (elementoEspelho.offsetHeight / 2)) + 'px';

            var evtStart = document.createEvent('Event');
            evtStart.initEvent('dragstart', true, true);
            target.dispatchEvent(evtStart);
        }
    }, { passive: true });

    window.addEventListener('touchmove', function (e) {
        if (!itemArrastadoMobile || e.touches.length !== 1) return;

        var touch = e.touches[0];
        if (elementoEspelho) {
            elementoEspelho.style.left = (touch.clientX - (elementoEspelho.offsetWidth / 2)) + 'px';
            elementoEspelho.style.top = (touch.clientY - (elementoEspelho.offsetHeight / 2)) + 'px';
        }

        var elementoSobODedo = document.elementFromPoint(touch.clientX, touch.clientY);
        if (!elementoSobODedo) return;

        var cardTarget = elementoSobODedo;
        while (cardTarget && !cardTarget.classList.contains('card')) {
            cardTarget = cardTarget.parentElement;
        }

        if (cardTarget) {
            var evtOver = document.createEvent('Event');
            evtOver.initEvent('dragover', true, true);
            cardTarget.dispatchEvent(evtOver);
        }
    }, { passive: true });

    window.addEventListener('touchend', function (e) {
        if (!itemArrastadoMobile) return;

        var touch = e.changedTouches[0];
        var elementoSobODedo = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (elementoSobODedo) {
            var cardTarget = elementoSobODedo;
            while (cardTarget && !cardTarget.classList.contains('card')) {
                cardTarget = cardTarget.parentElement;
            }

            if (cardTarget) {
                cardTarget.classList.remove('drag-over');

                var evtDrop = document.createEvent('Event');
                evtDrop.initEvent('drop', true, true);
                cardTarget.dispatchEvent(evtDrop);
            }
        }

        var evtEnd = document.createEvent('Event');
        evtEnd.initEvent('dragend', true, true);
        itemArrastadoMobile.dispatchEvent(evtEnd);

        // Remove o clone visual imediatamente ao soltar o dedo
        limparEspelhosOrfaos();

        itemArrastadoMobile = null;
        elementoEspelho = null;
    }, { passive: true });

    function limparEspelhosOrfaos() {
        if (elementoEspelho && elementoEspelho.parentNode) {
            elementoEspelho.parentNode.removeChild(elementoEspelho);
        }
        // Varredura de segurança caso algum evento de toque tenha falhado e deixado clones soltos na tela
        var orfaos = document.querySelectorAll('.mobile-drag-mirror');
        orfaos.forEach(function (el) {
            if (el.parentNode) el.parentNode.removeChild(el);
        });
    }
})();
