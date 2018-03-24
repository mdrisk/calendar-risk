import React, { Component } from "react";
import { Field, reduxForm } from "redux-form";
import Calendar from "react-calendar";
import datejs from "datejs";

class InputForm extends Component {
  constructor(props) {
    super(props);
    var date = Date.parse("01-01-2018");
    var endDate = Date.parse("01-02-2018");
    this.state = {
      date: date,
      duration: [date, endDate],
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
    end.addDays(values.length);
    console.log("start" + start);
    this.setState(
      {
        date: start,
        length: values.length,
        duration: [start, end],
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
      return (
        (date.isAfter(duration[0]) || date.equals(duration[0])) &&
        (date.isBefore(duration[1]) || date.equals(duration[1])) &&
        (date.getDay() == 0 || date.getDay() == 6)
      );
    }
    function holiday(date, view, duration) {
      const janHoli = Date.parse("01-01");
      const febHoli = Date.parse("02-01");
      const aprHoli = Date.parse("04-01");
      const mayHoli = Date.parse("05-01");
      const sepHoli = Date.parse("09-01");
      const octHoli = Date.parse("10-01");
      const novHoli1 = Date.parse("11-01");
      const novHoli2 = Date.parse("11-01");
      const decHoli = Date.parse("12-01");
      const bank_holidays = [
        Date.parse("01-01"),
        janHoli.moveToNthOccurrence(1, 3),
        febHoli.moveToNthOccurrence(1, 3),
        aprHoli.moveToNthOccurrence(0, 1),
        mayHoli.moveToNthOccurrence(1, -1),
        Date.parse("07-04"),
        sepHoli.moveToNthOccurrence(1, 1),
        octHoli.moveToNthOccurrence(1, 2),
        novHoli1.moveToNthOccurrence(1, 2),
        novHoli2.moveToNthOccurrence(4, 4),
        Date.parse("12-25"),
        Date.parse("12-31")
      ];
      var filtered = bank_holidays.filter(function(bank_holiday) {
        return (
          Date.equals(bank_holiday, date) &&
          ((date.isAfter(duration[0]) || date.equals(duration[0])) &&
            (date.isBefore(duration[1]) || date.equals(duration[1])))
        );
      });
      return filtered.length > 0;
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
          onClickDay={null}
          tileDisabled={({ date, view }) => {
            return (
              date.isAfter(this.state.duration[1]) &&
              date.isBefore(this.state.duration[0])
            );
          }}
          tileClassName={({ date, view }) => {
            return holiday(date, view, this.state.duration)
              ? "purpleBack"
              : redHelper(date, view, this.state.duration) ? "redBack" : null;
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
