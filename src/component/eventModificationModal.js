import React, { Component, Fragment } from 'react'
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
        height: '400px',
    }
};

export default class EventModificationModal extends Component {

    static defaultProps = {
        placeHolder: {
            eventStart: "Event start at :",
            eventStop: "Event stop at :",
            eventTitle: "Title",
            eventMemo: "Memo"
        }
    }

    constructor(props) {
        super(props);
        const { eventStart, eventStop, eventTitle, eventMemo } = props.schedule;
        this.state = {
            eventStart: eventStart,
            eventStop: eventStop,
            eventTitle: eventTitle,
            eventMemo: eventMemo
        }
    }

    changeEventTime = (type, event) => {
        const { eventStart } = this.state
        if (type === "eventStop" && event.isBefore(eventStart)) {
            alert("종료 시간은 시작 시간을 넘길수 없습니다.");
            return;
        }

        this.setState({
            [type]: event,
            title: this.state.title,
            eventMemo: this.state.eventMemo
        })
    }

    changeEventText = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    saveButtonClick = () => {
        const { eventStart, eventStop, eventTitle, eventMemo } = this.state;
        const event = Object.assign({},this.props.schedule,{
            eventStart : eventStart.format("YYYY-MM-DD HH:mm"),
            eventStop : eventStop.format("YYYY-MM-DD HH:mm"),
            eventTitle : eventTitle,
            eventMemo : eventMemo
        });
        this.props.save(event,this.props.schedule.newEvent)
    }

    deleteButtonClick = ()=>{
        const {schedule} = this.props;
        this.props.delete(schedule);
    }


    render() {
        const { eventTitle, eventMemo } = this.state;
        const { modifyCancel } = this.props;
        return (
            <Fragment>
                <Modal isOpen={true}
                    style={customStyles}
                >
                    <EventTime
                        placeHolder={this.props.placeHolder.eventStart}
                        changeEventTime={this.changeEventTime}
                        type="eventStart"
                        today={this.props.today}
                        event={this.state.eventStart.clone()}
                    />
                    <EventTime
                        placeHolder={this.props.placeHolder.eventStop}
                        changeEventTime={this.changeEventTime}
                        type="eventStop"
                        today={this.props.today}
                        event={this.state.eventStop.clone()}
                    />
                    <div id="eventTitleBox">
                        {/* <label className="eventTimePlaceHolder">Event title :</label> */}
                        <TextField id="titleModify" name="eventTitle" onChange={this.changeEventText} placeholder="Title" value={eventTitle} />
                    </div>
                    <TextField
                        name="eventMemo"
                        value={eventMemo}
                        onChange={this.changeEventText}
                        id="eventMemoTextArea"
                        multiline
                        rows="8"
                        variant="outlined"
                    />
                    <div className="modalButtonContainer">
                        <Button color="secondary" onClick={this.deleteButtonClick}>Delete</Button>
                        <div className="mainModalButtonContainer">
                            <Button onClick={modifyCancel}>cancel</Button>
                            <Button onClick={this.saveButtonClick}variant="contained" color="primary">SAVE</Button>
                        </div>
                    </div>
                </Modal>
            </Fragment>
        )
    }
}



