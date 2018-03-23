import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";

class InputForm extends Component {
  renderDateField(field) {
    return (
      <div>
        <input type="date" {...field.input} />
      </div>
    );
  }
  renderLengthField(field) {
    return (
      <div>
        <input type="number" {...field.input} />
      </div>
    );
  }
  renderCountryField(field) {
    return (
      <div>
        <input type="text" {...field.input} />
      </div>
    );
  }

  render() {
    return (
      <form>
        <Field name="Date" component={this.renderDateField} />
        <Field name="Length" component={this.renderLengthField} />
        <Field name="Country" component={this.renderCountryField} />
      </form>
    );
  }
}

export default reduxForm({ form: "dateForm" })(InputForm);
