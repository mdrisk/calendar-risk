import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import Calendar from "react-calendar";

class InputForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: new Date(),
      endDate: new Date(),
      duration: [new Date(), new Date()],
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

  advance(time, length) {
    time = Date.parse(time);
    console.log(time);
    var endDay = new Date(
      new Date(time).getTime() + 1000 * 60 * 60 * 24 * length
    );
    return endDay;
  }

  onSubmit(values) {
    const end = this.advance(values.date, values.length);
    console.log(end);
    this.setState(
      {
        date: new Date(values.date),
        length: values.length,
        endDate: end,
        duration: [
          new Date(new Date(values.date).getTime() + 1000 * 60 * 60 * 24),
          end
        ],
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
      if (
        date.getDate() < duration[0].getDate() &&
        date.getDate() > duration[1].getDate() &&
        (date.getDay() === 0 || date.getDay() === 6)
      ) {
        return true;
      } else {
        return false;
      }
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
            console.log(view);
            return !(
              date.getDate() > this.state.duration[0].getDate() &&
              date.getDate() < this.state.duration[1].getDate()
            );
          }}
          tileClassName={({ date, view }) => {
            redHelper(date, view, this.state.duration) ? "redBack" : null;
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
