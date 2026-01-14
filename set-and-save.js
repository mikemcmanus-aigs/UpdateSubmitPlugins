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
      standardProperties: {
        visibility: true
      },
      properties: {
        targetField: { type: 'string', required: true, title: 'Target Field' },
        valueToSet: { type: 'string', required: true,  title: 'Value to Set' },
        autoSubmit: { type: 'boolean',  title: 'Auto Submit on Click' }
      }
    };
  }

  connectedCallback() {
  super.connectedCallback();

  // try several locations where Nintex hosts the form
  const root = this.getRootNode();

  this.form =
    this.closest('ntx-form-runtime') ||
    root.host?.closest?.('ntx-form-runtime') ||
    root.querySelector?.('ntx-form-runtime') ||
    document.querySelector('ntx-form-runtime');

  console.log("Resolved form reference:", this.form);

  if (!this.form) {
    console.warn('SetValueAndSubmit: Still no ntx-form-runtime found');
    return;
  }

  this.form.addEventListener('ntx-form-ready', () => {
    console.log('🔥 ntx-form-ready FIRED');
    this.formReady = true;
  });
}


  async setFieldValue() {
    console.log("Available methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(this.form)));
    console.log("Form object:", this.form);

alert("Button clicked");

    if (!this.form || !this.formReady) {
      console.warn('SetValueAndSubmit: form not ready yet');
      return;
    }

    try {
      // safest API name across versions
      await this.form.setValue(this.targetField, this.valueToSet);
      console.log(`Set ${this.targetField} = ${this.valueToSet}`);
    } catch (e) {
      console.error('Error setting value', e);
    }

    if (this.autoSubmit) {
      try {
        // most reliable submit entrypoint
        await this.form.requestSubmit();
        console.log('Form submitted');
      } catch (e) {
        console.error('Error submitting form', e);
      }
    }
  }

  render() {
    return html`
      <button @click="${() => this.setFieldValue()}">
        Set Value & Submit
      </button>
    `;
  }
}

customElements.define('set-text-save', SetValueAndSubmit);
