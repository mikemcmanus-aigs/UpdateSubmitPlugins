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


  setFieldValue() {

  alert("Button clicked");

  // send value change event into Nintex
  const evt = new CustomEvent("ntx-value-change", {
    bubbles: true,
    composed: true,
    detail: {
      name: this.targetField,
      value: this.valueToSet
    }
  });

  this.dispatchEvent(evt);

  console.log("🚀 dispatched ntx-value-change", this.targetField, this.valueToSet);

  if (this.autoSubmit) {
    // trigger submit on the real HTML form element
    const htmlForm = document.querySelector('form[name="ntxForm"]');

    if (htmlForm) {
      htmlForm.requestSubmit();
      console.log("📝 submit requested");
    } else {
      console.warn("HTML form element not found");
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
