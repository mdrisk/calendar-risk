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
        <label>Start Date</label>
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
    this.setState({
      date: start,
      length: values.length,
      duration: [start, end],
      country: values.country
    });
  }

  render() {
    const { handleSubmit } = this.props;
    const calendarArr = [];
    let month1 = this.state.duration[0].getMonth() + 1;
    let month2 = this.state.duration[1].getMonth() + 1;
    let year1 = this.state.duration[0].getFullYear();
    let year2 = this.state.duration[1].getFullYear();

    while (year1 < year2) {
      for (var i = month1; i < 13; i++) {
        calendarArr.push({
          month: i,
          year: year1
        });
      }
      year1++;
      month1 = 1;
    }
    while (year1 === year2 && month1 <= month2) {
      calendarArr.push({
        month: month1,
        year: year1
      });
      month1++;
    }

    const duration = this.state.duration;
    const calendarList = calendarArr.map(function(map_date) {
      if (
        calendarArr[0].month !== map_date.month ||
        calendarArr[0].year !== map_date.year
      ) {
        var updatedDate = [
          Date.parse(`${map_date.month}-01-${map_date.year}`),
          duration[1]
        ];
        return (
          <div
            key={`${map_date.month} + ${map_date.year}`}
            style={{ display: "inline" }}
          >
            <Calendar
              value={updatedDate}
              onClickDay={null}
              tileClassName={({ date, view }) => {
                return holiday(date, view, updatedDate)
                  ? "purpleBack"
                  : yellowHelper(date, view, updatedDate)
                    ? "yellowBack"
                    : (date.isAfter(duration[0]) &&
                        date.isBefore(duration[1])) ||
                      date.equals(duration[0]) ||
                      date.equals(duration[1])
                      ? "greenBack"
                      : "grayBack";
              }}
              tileDisabled={({ date, view }) => {
                return date.isAfter(Date.parse(duration[1]));
              }}
              nextLabel={""}
              next2Label={""}
              prevLabel={""}
              prev2Label={""}
              showNeighboringMonth={false}
            />
          </div>
        );
      } else {
        return (
          <div
            key={`${map_date.month} + ${map_date.year}`}
            style={{ display: "inline" }}
          >
            <Calendar
              value={duration}
              onClickDay={null}
              tileClassName={({ date, view }) => {
                return holiday(date, view, duration)
                  ? "purpleBack"
                  : yellowHelper(date, view, duration)
                    ? "yellowBack"
                    : (date.isAfter(duration[0]) &&
                        date.isBefore(duration[1])) ||
                      date.equals(duration[0]) ||
                      date.equals(duration[1])
                      ? "greenBack"
                      : "grayBack";
              }}
              tileDisabled={({ date, view }) => {
                return date.isBefore(duration[0]) || date.isAfter(duration[1]);
              }}
              nextLabel={""}
              nextLabel2={""}
              prevLabel={""}
              prevLabel2={""}
              showNeighboringMonth={false}
            />
          </div>
        );
      }
    });

    function yellowHelper(date, view, duration) {
      return (
        (date.isAfter(duration[0]) || date.equals(duration[0])) &&
        (date.isBefore(duration[1]) || date.equals(duration[1])) &&
        (date.getDay() == 0 || date.getDay() == 6)
      );
    }
    function holiday(date, view, duration) {
      const year = duration[0].getFullYear();
      console.log(year);
      const janHoli = Date.parse(`01-01-${year}`);
      const febHoli = Date.parse(`02-01-${year}`);
      const aprHoli = Date.parse(`04-01-${year}`);
      const mayHoli = Date.parse(`05-01-${year}`);
      const sepHoli = Date.parse(`09-01-${year}`);
      const octHoli = Date.parse(`10-01-${year}`);
      const novHoli1 = Date.parse(`11-01-${year}`);
      const novHoli2 = Date.parse(`11-01-${year}`);
      const decHoli = Date.parse(`12-01-${year}`);
      const bank_holidays = [
        Date.parse(`01-01-${year}`),
        janHoli.moveToNthOccurrence(1, 3),
        febHoli.moveToNthOccurrence(1, 3),
        aprHoli.moveToNthOccurrence(0, 1),
        mayHoli.moveToNthOccurrence(1, -1),
        Date.parse(`07-04-${year}`),
        sepHoli.moveToNthOccurrence(1, 1),
        octHoli.moveToNthOccurrence(1, 2),
        novHoli1.moveToNthOccurrence(1, 2),
        novHoli2.moveToNthOccurrence(4, 4),
        Date.parse(`12-25-${year}`),
        Date.parse(`12-31-${year}`)
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
        <div>{calendarList}</div>
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
