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
      version: '1.1',
      standardProperties: {
        visibility: true
      },
      properties: {
        targetField: {
          type: 'string',
          required: true,
          title: 'Target Field (formControlId)'
        },
        valueToSet: {
          type: 'string',
          required: true,
          title: 'Value to Set'
        },
        autoSubmit: {
          type: 'boolean',
          title: 'Auto Submit on Click'
        }
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

    console.log('[SetValueAndSubmit] Resolved form:', this.form);

    if (!this.form) {
      console.warn('[SetValueAndSubmit] ntx-form-runtime not found');
      return;
    }

    // Case 1: form already ready
    if (this.form.formReady === true) {
      console.log('[SetValueAndSubmit] Form already ready');
      this.formReady = true;
      return;
    }

    // Case 2: wait for readiness
    this.form.addEventListener(
      'ntx-form-ready',
      () => {
        console.log('[SetValueAndSubmit] ntx-form-ready fired');
        this.formReady = true;
      },
      { once: true }
    );
  }

  async waitForFormReady(timeout = 3000) {
    const start = Date.now();
    while (!this.formReady) {
      if (Date.now() - start > timeout) {
        return false;
      }
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    return true;
  }

  async setFieldValue() {
    console.log('[SetValueAndSubmit] Button clicked');

    if (!(await this.waitForFormReady())) {
      console.warn('[SetValueAndSubmit] Form never became ready');
      return;
    }

    const formRuntime =
      this.form || document.querySelector('ntx-form-runtime');

    if (!formRuntime) {
      console.warn('[SetValueAndSubmit] Form runtime not found');
      return;
    }

    const ngFormCmp = formRuntime.__ngContext__?.find?.(
      x => x?.controls && Array.isArray(x.controls)
    );

    console.log('[SetValueAndSubmit] Angular form component:', ngFormCmp);

    if (!ngFormCmp) {
      console.warn('[SetValueAndSubmit] Angular form component not found');
      return;
    }

    const control = ngFormCmp.controls.find(
      c => c?.formControlId === this.targetField
    );

    console.log('[SetValueAndSubmit] Resolved control:', control);

    if (!control) {
      console.warn(
        `[SetValueAndSubmit] Control not found: ${this.targetField}`
      );
      console.log(
        '[SetValueAndSubmit] Available controls:',
        ngFormCmp.controls.map(c => c.formControlId)
      );
      return;
    }

    try {
      control.setValue(this.valueToSet);
      console.log('[SetValueAndSubmit] ✅ Value set');
    } catch (e) {
      console.error('[SetValueAndSubmit] Failed to set value', e);
      return;
    }

    if (this.autoSubmit) {
      const htmlForm =
        this.form?.querySelector?.('form[name="ntxForm"]') ||
        document.querySelector('form[name="ntxForm"]');

      if (htmlForm) {
        htmlForm.requestSubmit();
        console.log('[SetValueAndSubmit] 🚀 Form submitted');
      } else {
        console.warn('[SetValueAndSubmit] HTML form not found');
      }
    }
  }

  render() {
    return html`
      <button @click=${this.setFieldValue}>
        Set Value & Submit
      </button>
    `;
  }
}

customElements.define('set-text-save', SetValueAndSubmit);
