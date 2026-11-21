/**
 * DragDropTouch - Polyfill para habilitar suporte a Drag and Drop nativo em dispositivos móveis.
 * Traduz Touch Events em Drag Events automaticamente.
 */
(function () {
    // Detecta se o dispositivo suporta toque
    if (!('ontouchstart' in window)) return;

    var DragDropTouch = (function () {
        function DragDropTouch() {
            this._lastClick = 0;
            window.addEventListener('touchstart', this._touchstart.bind(this), { passive: false });
            window.addEventListener('touchmove', this._touchmove.bind(this), { passive: false });
            window.addEventListener('touchend', this._touchend.bind(this));
            window.addEventListener('touchcancel', this._touchend.bind(this));
        }

        DragDropTouch.prototype._touchstart = function (e) {
            if (this._shouldHandle(e)) {
                e.preventDefault(); // Previne rolagem da tela ao arrastar a imagem
                var src = e.target;
                while (src && !src.draggable) {
                    src = src.parentElement;
                }
                if (src && src.draggable) {
                    this._dragSource = src;
                    this._ptDown = e.touches[0];
                    this._lastTouch = e.touches[0];
                    
                    // Dispara o evento de DragStart simulado
                    var evt = document.createEvent('CustomEvent');
                    evt.initCustomEvent('dragstart', true, true, null);
                    evt.dataTransfer = new DataTransferSimulated();
                    this._dataTransfer = evt.dataTransfer;
                    
                    // Executa o listener original do app.js
                    src.dispatchEvent(evt);
                }
            }
        };

        DragDropTouch.prototype._touchmove = function (e) {
            if (this._dragSource && e.touches.length > 0) {
                e.preventDefault();
                var touch = e.touches[0];
                this._lastTouch = touch;
                
                var target = document.elementFromPoint(touch.clientX, touch.clientY);
                while (target && target.parentElement && !target.dispatchEvent) {
                    target = target.parentElement;
                }

                if (target) {
                    var evt = document.createEvent('CustomEvent');
                    evt.initCustomEvent('dragover', true, true, null);
                    evt.dataTransfer = this._dataTransfer;
                    target.dispatchEvent(evt);
                }
            }
        };

        DragDropTouch.prototype._touchend = function (e) {
            if (this._dragSource) {
                var touch = this._lastTouch;
                var target = document.elementFromPoint(touch.clientX, touch.clientY);
                while (target && target.parentElement && !target.dispatchEvent) {
                    target = target.parentElement;
                }

                if (target) {
                    var evt = document.createEvent('CustomEvent');
                    evt.initCustomEvent('drop', true, true, null);
                    evt.dataTransfer = this._dataTransfer;
                    target.dispatchEvent(evt);
                }

                var evtEnd = document.createEvent('CustomEvent');
                evtEnd.initCustomEvent('dragend', true, true, null);
                this._dragSource.dispatchEvent(evtEnd);

                this._dragSource = null;
            }
        };

        DragDropTouch.prototype._shouldHandle = function (e) {
            return e.touches && e.touches.length === 1;
        };

        return DragDropTouch;
    }());

    // Classe simulada simplificada para carregar o estado do dataTransfer
    var DataTransferSimulated = (function () {
        function DataTransferSimulated() {
            this._data = {};
            this.dropEffect = 'move';
            this.effectAllowed = 'all';
            this.types = [];
        }
        DataTransferSimulated.prototype.setData = function (format, val) {
            this._data[format] = val;
        };
        DataTransferSimulated.prototype.getData = function (format) {
            return this._data[format] || '';
        };
        return DataTransferSimulated;
    }());

    // Inicializa o tradutor de toques automaticamente
    new DragDropTouch();
}());
