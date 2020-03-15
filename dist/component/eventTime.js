function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';

function isOverDate(month, date) {
  const lastDate = moment().set({
    'month': month,
    'date': 1
  }).endOf('month').date();
  return lastDate < date ? lastDate : date;
}

export default class EventTime extends Component {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "timeMenuItems", isHourMinute => {
      const timer = isHourMinute ? 23 : 59;
      const keyPlus = isHourMinute ? "hour" : "minutes";
      const menuItems = [];

      for (let i = 0; i <= timer; i++) {
        const time = i < 10 ? `0${i}` : `${i}`;
        menuItems.push(React.createElement(MenuItem, {
          key: `${keyPlus}_i`,
          value: i
        }, time));
      }

      return menuItems;
    });

    _defineProperty(this, "yearItmes", () => {
      const {
        today
      } = this.props;
      const items = [];
      let yearStart = today.year() - 5;

      for (let i = 0; i < 11; i++) {
        items.push(React.createElement(MenuItem, {
          key: `eventYearItem_${i}`,
          value: yearStart + i
        }, yearStart + i));
      }

      return items;
    });

    _defineProperty(this, "monthItmes", () => {
      const items = [];

      for (let i = 1; i <= 12; i++) {
        const month = i < 10 ? `0${i}` : `${i}`;
        items.push(React.createElement(MenuItem, {
          key: `eventMonthItem_${i}`,
          value: i - 1
        }, month));
      }

      return items;
    });

    _defineProperty(this, "dateItmes", () => {
      const {
        event
      } = this.props; // let start = event.startOf('month').date();

      const end = event.endOf('month').date();
      const items = [];

      for (let i = 1; i <= end; i++) {
        const date = i < 10 ? `0${i}` : `${i}`;
        items.push(React.createElement(MenuItem, {
          key: `date_${i}`,
          value: i
        }, date));
      }

      return items;
    });

    _defineProperty(this, "onChange", (e, momentFormat) => {
      const {
        type,
        changeEventTime
      } = this.props;
      const dummyEventTime = moment(momentFormat);
      const newEventTime = dummyEventTime.clone().set({
        'year': e.target.name === "year" ? e.target.value : dummyEventTime.year(),
        'month': e.target.name === "month" ? e.target.value : dummyEventTime.month(),
        'dates': e.target.name === "date" ? e.target.value : e.target.name === "month" ? isOverDate(e.target.value, dummyEventTime.date()) : dummyEventTime.date(),
        'hour': e.target.name === "hour" ? e.target.value : dummyEventTime.hour(),
        'minutes': e.target.name === "minute" ? e.target.value : dummyEventTime.minute()
      });
      changeEventTime(type, newEventTime);
    });
  }

  render() {
    const {
      event,
      placeHolder
    } = this.props;
    const format = event.format("YYYY-MM-DD HH:mm");
    const year = event.year();
    const month = event.month();
    const date = event.date();
    const hours = event.hours();
    const minutes = event.minutes();
    return React.createElement("div", null, React.createElement("label", {
      className: "eventTimePlaceHolder"
    }, placeHolder), React.createElement(Select, {
      name: "year",
      onChange: e => this.onChange(e, format),
      value: `${year}`
    }, this.yearItmes()), React.createElement("label", {
      className: "boundary"
    }, "-"), React.createElement(Select, {
      name: "month",
      onChange: e => this.onChange(e, format),
      value: `${month}`
    }, this.monthItmes()), React.createElement("label", {
      className: "boundary"
    }, "-"), React.createElement(Select, {
      name: "date",
      onChange: e => this.onChange(e, format),
      value: `${date}`
    }, this.dateItmes()), React.createElement(Select, {
      className: "eventTime",
      name: "hour",
      onChange: e => this.onChange(e, format),
      value: `${hours}`
    }, this.timeMenuItems(true)), React.createElement("label", {
      className: "boundary"
    }, ":"), React.createElement(Select, {
      name: "minute",
      onChange: e => this.onChange(e, format),
      value: `${minutes}`
    }, this.timeMenuItems(false)));
  }

}