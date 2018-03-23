import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import Calendar from "react-calendar";
import datejs from "datejs";

class InputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: Date.today(),
      endDate: Date.today(),
      duration: [Date.today(), Date.today()],
      length: 1,
      country: "us"
    };
  }

  renderDateField(field) {
    return (
      <div>
        <label>Date</label>
        <input type="date" {...field.input} />
        <div className="text-help">
          {field.meta.touched ? field.meta.error : ""}
        </div>
      </div>
    );
  }
  renderLengthField(field) {
    return (
      <div>
        <label>Number of days</label>
        <input type="number" {...field.input} />
        <div className="text-help">
          {field.meta.touched ? field.meta.error : ""}
        </div>
      </div>
    );
  }
  renderCountryField(field) {
    return (
      <div>
        <label>Country Code</label>
        <input type="text" {...field.input} />
        <div className="text-help">
          {field.meta.touched ? field.meta.error : ""}
        </div>
      </div>
    );
  }

  onSubmit(values) {
    const start = Date.parse(values.date);
    const end = Date.parse(values.date);
    console.log("start" + start);
    this.setState(
      {
        date: start,
        length: values.length,
        duration: [start, end.add({ days: values.length })],
        country: values.country
      },
      () => {
        console.log(this.state.duration);
      }
    );
  }

  render() {
    const { handleSubmit } = this.props;

    function redHelper(date, view, duration) {
      // console.log(
      //   date.getDay(),
      //   date.getDate(),
      //   duration[0].getDay(),
      //   duration[0].getDate()
      // );
      return (
        date.getDate() > duration[0].getDate() &&
        date.getDate() < duration[1].getDate() &&
        (date.getDay() == 0 || date.getDay() == 6)
      );
    }

    return (
      <div>
        <form>
          <Field name="date" component={this.renderDateField} />
          <Field name="length" component={this.renderLengthField} />
          <Field name="country" component={this.renderCountryField} />
          <button
            type="button"
            onClick={handleSubmit(this.onSubmit.bind(this))}
          >
            Submit
          </button>
        </form>
        <Calendar
          value={this.state.duration}
          tileDisabled={({ date, view }) => {
            return !(
              date.getDate() > this.state.duration[0].getDate() &&
              date.getDate() < this.state.duration[1].getDate()
            );
          }}
          tileClassName={({ date, view }) => {
            return redHelper(date, view, this.state.duration)
              ? "redBack"
              : null;
          }}
        />
      </div>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.date) {
    errors.date = "Enter a date";
  }
  if (!values.length || values.length < 1) {
    errors.length = "Enter a valid length";
  }
  if (!values.country || values.country.toLowerCase() !== "us") {
    errors.country = "Enter US as country";
  }
  return errors;
}

export default reduxForm({ validate, form: "formDate" })(InputForm);
