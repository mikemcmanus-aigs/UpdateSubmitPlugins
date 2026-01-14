import { html, css, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class UpdateStatusControl extends LitElement {
  static properties = {
    statusField: { type: String },
    statusValue: { type: String },
    autoSubmit: { type: Boolean }
  };

  static styles = css`
    button {
      padding: 10px 20px;
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
    this.statusField = '';
    this.statusValue = '';
    this.autoSubmit = false;
    this.form = null;
  }

  // Nintex Apps injects the form context here
  onFormReady(form) {
    this.form = form;
  }

  handleClick() {
    if (!this.form) {
      console.warn("Form context not available");
      return;
    }

    this.form.setFieldValue(this.statusField, this.statusValue);

    if (this.autoSubmit) {
      this.form.submit();
    }
  }

  render() {
    return html`
      <button @click="${this.handleClick}">
        Update Status
      </button>
    `;
  }
}

customElements.define('update-status-control2', UpdateStatusControl);

export const MetaConfig = {
  controlName: 'update-status-control2',
  fallbackDisableSubmit: false,
  description: 'Updates a status field and optionally submits the form.',
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/545/545682.png',
  groupName: 'Custom Controls',
  version: '1.0',
  properties: {
    statusField: {
      type: 'string',
      title: 'Status Field Name',
      description: 'The internal name of the field to update.'
    },
    statusValue: {
      type: 'string',
      title: 'Status Value',
      description: 'The value to assign to the status field.'
    },
    autoSubmit: {
      type: 'boolean',
      title: 'Auto Submit',
      description: 'Submit the form immediately after updating the status.'
    }
  }
};