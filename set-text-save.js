import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class SetValueAndSubmit extends LitElement {

  static properties = {
    targetField: { type: String },
    valueToSet: { type: String },
    autoSubmit: { type: Boolean }
  };

  static styles = css`
    button {
      padding: 8px 16px;
      background-color: #0078d4;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }
    button:hover {
      background-color: #005a9e;
    }
  `;

  constructor() {
    super();
    this.targetField = '';
    this.valueToSet = '';
    this.autoSubmit = false;
    this.form = null;
  }

  // Nintex injects the form context here
  onFormReady(form) {
    this.form = form;
  }

  setFieldValue() {
    if (!this.form) {
      console.warn("SetValueAndSubmit: form context unavailable");
      return;
    }

    try {
      this.form.setFieldValue(this.targetField, this.valueToSet);
      console.log(`SetValueAndSubmit: set ${this.targetField} = ${this.valueToSet}`);
    } catch (err) {
      console.error("SetValueAndSubmit: error setting field value", err);
    }

    if (this.autoSubmit) {
      try {
        this.form.submit();
        console.log("SetValueAndSubmit: form submitted");
      } catch (err) {
        console.error("SetValueAndSubmit: error submitting form", err);
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

  static getMetaConfig() {
    return {
      controlName: 'set-value-save',
      fallbackDisableSubmit: false,
      version: '1.0',
      standardProperties: {
        visibility: true
      },
      properties: {
        targetField: {
          type: 'string',
          title: 'Target Field Internal Name',
          description: 'Internal name of the field to set',
          required: true
        },
        valueToSet: {
          type: 'string',
          title: 'Value To Set',
          description: 'The value that will be written to the field',
          required: true
        },
        autoSubmit: {
          type: 'boolean',
          title: 'Submit Form Automatically',
          description: 'If true, the form will submit immediately after setting the value'
        }
      },
      events: ["ntx-value-change"]
    };
  }
}

customElements.define('set-value-save', SetValueAndSubmit);
