import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class SetValueAndSubmit extends LitElement {
  static properties = {
    targetField: { type: String },
    valueToSet: { type: String },
    autoSubmit: { type: Boolean }
  };

  static getMetaConfig() {
    return {
      controlName: 'set-text-save',
      fallbackDisableSubmit: false,
      version: '1.0',
      standardProperties: { visibility: true },
      properties: {
        targetField: { type: 'string', required: true, title: 'Target Field' },
        valueToSet: { type: 'string', required: true, title: 'Value to Set' },
        autoSubmit: { type: 'boolean', title: 'Auto Submit on Click' }
      }
    };
  }

  render() {
    return html`
      <button @click=${this.onClick}>Set Value & Submit</button>
    `;
  }

  onClick() {
    alert('Button clicked!');
    // Here you can later call this.setFieldValue();
  }
}

customElements.define('set-text-save', SetValueAndSubmit);

// ==== Upgrade pre-rendered templates ====
const observer = new MutationObserver(() => {
  document.querySelectorAll('set-text-save').forEach(el => {
    if (!el.shadowRoot) {
      const newEl = document.createElement('set-text-save');
      el.replaceWith(newEl);
    }
  });
});

// Watch the entire document body for plugins being added
observer.observe(document.body, { childList: true, subtree: true });
