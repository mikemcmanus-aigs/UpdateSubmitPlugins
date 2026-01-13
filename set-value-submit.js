import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

// define the component
export class SetValueAndSubmit extends LitElement {

    static properties = {
        targetField: { type: String },
        valueToSet: { type: String },
        autoSubmit: { type: Boolean }
    };

    // return a promise for contract changes.
    static getMetaConfig() {
        return {
            controlName: 'Set Value And Submit',
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

    onChange(e) {
        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: e.target.values
        };
        const event = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(event);
    }

    setFieldValue() {
        console.log('SetValueAndSubmit: setting field value');

        // Find the target field control
        const field = document.querySelector(`ntx-form-control[name="${this.targetField}"]`);

        if (field) {
            field.value = this.valueToSet;

            // Trigger Nintex change event
            field.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            console.warn(`SetValueAndSubmit: field "${this.targetField}" not found`);
        }

        // Submit if enabled
        if (this.autoSubmit) {
            const submitBtn = document.querySelector('[data-e2e="btn-submit"]');
            if (submitBtn) {
                submitBtn.click();
            }
        }
    }

    render() {
        return html`
            <button
                style="padding:8px 16px;background:#0078d4;color:#fff;border:none;border-radius:4px;cursor:pointer;"
                @click="${() => this.setFieldValue()}"
            >
                Set Value & Submit
            </button>
        `;
    }
}

// registering the web component
const elementName = 'set-value-submit';
customElements.define(elementName, SetValueAndSubmit);