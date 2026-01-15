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

  constructor() {
    super();
    this.formReady = false;
  }

  connectedCallback() {
    super.connectedCallback();
    // Wait for the form to be ready
    this.waitForForm();
  }

  async waitForForm() {
    // Retry until the form runtime exists
    let retries = 20;
    while (retries-- > 0) {
      this.form = document.querySelector('ntx-form-runtime');
      if (this.form) break;
      await new Promise(r => setTimeout(r, 250));
    }

    if (!this.form) {
      console.warn('SetValueAndSubmit: ntx-form-runtime not found');
      return;
    }

    this.form.addEventListener('ntx-form-ready', () => {
      this.formReady = true;
      console.log('Form is ready!');
    });

    // If the form is already ready
    if (this.form.__ngContext__) {
      this.formReady = true;
      console.log('Form already ready');
    }
  }

  render() {
    return html`
      <button @click=${() => this.onClick()}>
        Set Value & Submit
      </button>
    `;
  }

  onClick() {
    if (!this.formReady) {
      alert('Form not ready yet!');
      return;
    }

    alert('Butt
