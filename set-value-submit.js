import { html, LitElement } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';

export class SetValueAndSubmit extends LitElement {

    static properties = {
        targetField: { type: String },
        valueToSet: { type: String },
        autoSubmit: { type: Boolean }
    };

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

    connectedCallback() {
        super.connectedCallback();
        // Nintex Apps form context
        this.form = this.closest('ntx-form');
        if (!this.form) {
            console.warn("SetValueAndSubmit: form context not found");
        }
    }

    setFieldValue() {
        console.log("SetValueAndSubmit: setting field value");

        if (!this.form) {
            console.warn("SetValueAndSubmit: form context unavailable");
            return;
        }

        // Set the field value using Nintex API
        try {
            this.form.setFieldValue(this.targetField, this.valueToSet);
            console.log(`SetValueAndSubmit: set ${this.targetField} = ${this.valueToSet}`);
        } catch (err) {
            console.error("SetValueAndSubmit: error setting field value", err);
        }

        // Submit if enabled
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
            <button
                style="padding:8px 16px;background:#0078d4;color:#fff;border:none;border-radius:4px;cursor:pointer;"
                @click="${() => this.setFieldValue()}"
            >
                Set Value & Submit
            </button>
        `;
    }
}

const elementName = 'set-value-submit';
customElements.define(elementName, SetValueAndSubmit);
