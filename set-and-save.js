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

  // 1) Find the form runtime host
  const formRuntime = document.querySelector("ntx-form-runtime");

  if (!formRuntime) {
    console.warn("Form runtime not found");
    return;
  }

  // 2) Get the Angular component instance
  const ngFormCmp = formRuntime.__ngContext__ && formRuntime.__ngContext__[8];

  console.log("Angular form component:", ngFormCmp);

  if (!ngFormCmp) {
    console.warn("Angular form component not found");
    return;
  }

  // 3) Find the control by formcontrolid
  const control = ngFormCmp?.controls?.find?.(
    c => c?.formControlId === this.targetField
  );

  console.log("Resolved Nintex control:", control);

  if (!control) {
    console.warn("Control not found by formControlId");
    return;
  }

  // 4) Set value via Nintex/Angular API
  control.setValue(this.valueToSet);

  console.log("Value set through Nintex control API");

  // 5) Auto-submit if enabled
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
