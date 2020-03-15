function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React, { Component, Fragment } from 'react';
import Modal from 'react-modal';
import EventTime from './eventTime';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import '../style/modal.css';
const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    width: '410px',
    height: '400px'
  }
};
export default class EventModificationModal extends Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "changeEventTime", (type, event) => {
      const {
        eventStart
      } = this.state;

      if (type === "eventStop" && event.isBefore(eventStart)) {
        alert("종료 시간은 시작 시간을 넘길수 없습니다.");
        return;
      }

      this.setState({
        [type]: event,
        title: this.state.title,
        eventMemo: this.state.eventMemo
      });
    });

    _defineProperty(this, "changeEventText", e => {
      this.setState({
        [e.target.name]: e.target.value
      });
    });

    _defineProperty(this, "saveButtonClick", () => {
      const {
        eventStart,
        eventStop,
        eventTitle,
        eventMemo
      } = this.state;
      const event = Object.assign({}, this.props.schedule, {
        eventStart: eventStart.format("YYYY-MM-DD HH:mm"),
        eventStop: eventStop.format("YYYY-MM-DD HH:mm"),
        eventTitle: eventTitle,
        eventMemo: eventMemo
      });
      this.props.save(this.props.schedule.newEvent, event);
    });

    _defineProperty(this, "deleteButtonClick", () => {
      const {
        schedule
      } = this.props;
      this.props.delete(schedule.index);
    });

    const {
      eventStart: _eventStart,
      eventStop: _eventStop,
      eventTitle: _eventTitle,
      eventMemo: _eventMemo
    } = props.schedule;
    this.state = {
      eventStart: _eventStart,
      eventStop: _eventStop,
      eventTitle: _eventTitle,
      eventMemo: _eventMemo
    };
  }

  render() {
    const {
      eventTitle,
      eventMemo
    } = this.state;
    const {
      modifyCancel
    } = this.props;
    return React.createElement(Fragment, null, React.createElement(Modal, {
      isOpen: true,
      ariaHideApp: false,
      style: customStyles
    }, React.createElement(EventTime, {
      key: "eventStartTime",
      placeHolder: this.props.placeholder.start,
      changeEventTime: this.changeEventTime,
      type: "eventStart",
      today: this.props.today,
      event: this.state.eventStart.clone()
    }), React.createElement(EventTime, {
      key: "eventStopTime",
      placeHolder: this.props.placeholder.stop,
      changeEventTime: this.changeEventTime,
      type: "eventStop",
      today: this.props.today,
      event: this.state.eventStop.clone()
    }), React.createElement("div", {
      id: "eventTitleBox"
    }, React.createElement(TextField, {
      id: "titleModify",
      name: "eventTitle",
      onChange: this.changeEventText,
      placeholder: "Title",
      value: eventTitle
    })), React.createElement(TextField, {
      name: "eventMemo",
      value: eventMemo,
      onChange: this.changeEventText,
      id: "eventMemoTextArea",
      multiline: true,
      rows: "8",
      variant: "outlined"
    }), React.createElement("div", {
      className: "modalButtonContainer"
    }, React.createElement(Button, {
      color: "secondary",
      onClick: this.deleteButtonClick
    }, "Delete"), React.createElement("div", {
      className: "mainModalButtonContainer"
    }, React.createElement(Button, {
      onClick: modifyCancel
    }, "cancel"), React.createElement(Button, {
      onClick: this.saveButtonClick,
      variant: "contained",
      color: "primary"
    }, "SAVE")))));
  }

}

_defineProperty(EventModificationModal, "defaultProps", {
  placeholder: {
    start: "Event start at :",
    stop: "Event stop at :"
  }
});