
const { html, LitElement } = window.ntx.lit;
class SetValueAndSubmit extends LitElement {

    static properties = {
        targetField: { type: String },
        valueToSet: { type: String },
        autoSubmit: { type: Boolean }
    };

    static getMetaConfig() {
        return {
            controlName: 'update-Value',   // MUST MATCH ELEMENT NAME
            fallbackDisableSubmit: false,
            version: '1.0',
            standardProperties: {
                visibility: true
            },
            properties: {
                targetField: {
                    type: 'string',
                    title: 'Target Field Internal Name',
                    required: true
                },
                valueToSet: {
                    type: 'string',
                    title: 'Value To Set',
                    required: true
                },
                autoSubmit: {
                    type: 'boolean',
                    title: 'Submit Form Automatically'
                }
            }
        };
    }

    // Nintex injects the form context here
    onFormReady(form) {
        console.log("SetValueAndSubmit: form ready");
        this.form = form;
    }

    setFieldValue() {
        console.log("SetValueAndSubmit: button clicked");

        if (!this.form) {
            console.warn("SetValueAndSubmit: form context not available");
            return;
        }

        try {
            this.form.setFieldValue(this.targetField, this.valueToSet);
            console.log(`SetValueAndSubmit: set ${this.targetField} = ${this.valueToSet}`);
        } catch (err) {
            console.error("Error setting field value:", err);
        }

        if (this.autoSubmit) {
            try {
                this.form.submit();
                console.log("SetValueAndSubmit: form submitted");
            } catch (err) {
                console.error("Error submitting form:", err);
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


customElements.define('update-Value', SetValueAndSubmit);

