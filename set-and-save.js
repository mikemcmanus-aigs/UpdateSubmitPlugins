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

  const root = this.getRootNode();
  this.form =
    this.closest('ntx-form-runtime') ||
    root.host?.closest?.('ntx-form-runtime') ||
    root.querySelector?.('ntx-form-runtime') ||
    document.querySelector('ntx-form-runtime');

  if (!this.form) return;

  // handle both already-ready and future-ready cases
  if (this.form.formReady) {
    this.formReady = true;
  } else {
    this.form.addEventListener('ntx-form-ready', () => {
      this.formReady = true;
    });
  }
}



 async setFieldValue() {
  alert("Button clicked");

  // wait until Nintex form is ready
  if (!this.formReady) {
    console.warn("Form not ready yet");
    return;
  }

  const formRuntime = this.form || document.querySelector('ntx-form-runtime');
  if (!formRuntime) {
    console.warn("Form runtime not found");
    return;
  }

  const ngFormCmp = formRuntime.__ngContext__?.find?.(
    x => x?.controls && Array.isArray(x.controls)
  );

  console.log("Resolved Angular form component:", ngFormCmp);

  if (!ngFormCmp) {
    console.warn("Angular form component not found");
    return;
  }

  const control = ngFormCmp.controls.find(
    c => c?.formControlId === this.targetField
  );

  console.log("Resolved Nintex control:", control);

  if (!control) {
    console.warn("Control not found:", this.targetField);
    return;
  }

  control.setValue(this.valueToSet);
  console.log("✅ Value set");

  if (this.autoSubmit) {
    const htmlForm =
      this.form?.querySelector?.('form[name="ntxForm"]') ||
      document.querySelector('form[name="ntxForm"]');

    if (htmlForm) {
      htmlForm.requestSubmit();
      console.log("🚀 Form submitted");
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
