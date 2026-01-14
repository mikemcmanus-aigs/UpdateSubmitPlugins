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

  // locate the actual input for the target control id
  const input = document.querySelector(`input[name="${this.targetField}"]`)
    || document.getElementById(this.targetField);

  console.log("Resolved input element:", input);

  if (!input) {
    console.warn("Target input not found");
    return;
  }

  // set value directly
  input.value = this.valueToSet;

  // dispatch events so Nintex/Angular picks it up
  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));

  console.log("Value set and events dispatched");

  if (this.autoSubmit) {
    const htmlForm = document.querySelector('form[name="ntxForm"]');
    if (htmlForm) htmlForm.requestSubmit();
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
