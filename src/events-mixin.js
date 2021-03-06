
/**
 * Mixin for adding event binding to the shadow DOM
 */

const CompostEventsMixin = parent => (
  class extends parent {
    /**
     * a list of event types that can be bound
     */
    static get eventTypes() {
      return ['abort', 'blur', 'cancel', 'canplay', 'canplaythrough', 'change', 'click', 'close', 'contextmenu', 'cuechange', 'dblclick', 'drag', 'dragend', 'dragenter', 'dragleave', 'dragover', 'dragstart', 'drop', 'durationchange', 'emptied', 'ended', 'error', 'focus', 'input', 'invalid', 'keydown', 'keypress', 'keyup', 'load', 'loadeddata', 'loadedmetadata', 'loadstart', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'mousewheel', 'pause', 'play', 'playing', 'progress', 'ratechange', 'reset', 'resize', 'scroll', 'seeked', 'seeking', 'select', 'stalled', 'submit', 'suspend', 'timeupdate', 'toggle', 'volumechange', 'waiting', 'wheel', 'gotpointercapture', 'lostpointercapture', 'pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'pointerover', 'pointerout', 'pointerenter', 'pointerleave', 'beforecopy', 'beforecut', 'beforepaste', 'copy', 'cut', 'paste', 'search', 'selectstart'];
    }

    constructor() {
      super();

      // holds bound events so they can be unbound
      this._boundEvents = [];
    }

    connectedCallback() {
      if (super.connectedCallback) {
        super.connectedCallback();
      }

      if (this.shadowRoot) {
        this.constructor.eventTypes.forEach((eventType) => {
          const attr = `on-${eventType}`;

          this.shadowRoot.querySelectorAll(`[${attr}]`).forEach((el) => {
            const event = {
              el,
              eventType,
              fn: this[el.getAttribute(attr)].bind(this),
            };

            this.on(el, eventType, event.fn);

            this._boundEvents.push(event);
          });
        });
      }
    }

    disconnectedCallback() {
      if (super.disconnectedCallback) {
        super.disconnectedCallback();
      }

      this._boundEvents.forEach((boundEvent) => {
        this.off(boundEvent.el, boundEvent.eventType, boundEvent.fn);
      });
    }

    /**
     * bind a listener (func) to el
     */
    on(el, type, func) {
      el.addEventListener(type, func);
    }

    /**
     * unbind a listener (func) from el
     */
    off(el, type, func) {
      el.removeEventListener(type, func);
    }

    /**
     * fire a custom event
     */
    fire(type, detail, bubbles = true, composed = true) {
      this.dispatchEvent(new CustomEvent(type, {
        bubbles,
        composed,
        detail,
      }));
    }
  }
);

export default CompostEventsMixin;
