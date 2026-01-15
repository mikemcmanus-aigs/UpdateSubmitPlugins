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

  async onClick() {
    alert('Button clicked!');

    // Wait until the form runtime is ready
    const form = await this.waitForForm();
    if (!form) return;

    // Try to get Angular component from form runtime
    const ngFormCmp = form.__ngContext__ && form.__ngContext__[8];
    if (!ngFormCmp) {
      console.warn('Angular form component not found');
      return;
    }

    // Find the target control by formControlId
    const control = ngFormCmp.controls.find(c => c.formControlId === this.targetField);
    if (!control) {
      console.warn('Target control not found:', this.targetField);
      return;
    }

    // Set value using Nintex control API
    control.setValue(this.valueToSet);
    console.log('Value set for', this.targetField, 'to', this.valueToSet);

    // Auto-submit if enabled
    if (this.autoSubmit) {
      const htmlForm = form.querySelector('form[name="ntxForm"]');
      if (htmlForm) {
        htmlForm.requestSubmit();
        console.log('Form submitted');
      }
    }
  }

  waitForForm() {
    return new Promise(resolve => {
      const existingForm = document.querySelector('ntx-form-runtime');
      if (existingForm) {
        // Check if form is ready
        existingForm.addEventListener('ntx-form-ready', () => resolve(existingForm), { once: true });
        // If already fired, resolve immediately
        if (existingForm.formReady) resolve(existingForm);
        return;
      }

      // Otherwise, watch for it
      const observer = new MutationObserver(() => {
        const form = document.querySelector('ntx-form-runtime');
        if (form) {
          observer.disconnect();
          form.addEventListener('ntx-form-ready', () => resolve(form), { once: true });
        }
      });
      observer.observe(document.body, { childList: true, subtree: true });
    });
  }
}

customElements.define('set-text-save', SetValueAndSubmit);

// ==== Upgrade pre-rendered templates ====
const observer = new MutationObserver(() => {
  document.querySelectorAll('set-text-save').forEach(el => {
    if (!el.shadowRoot) {
      const newEl = document.createElement('set-text-save');
      // Copy attributes
      [...el.attributes].forEach(attr => newEl.setAttribute(attr.name, attr.value));
      el.replaceWith(newEl);
    }
  });
});

observer.observe(document.body, { childList: true, subtree: true });
