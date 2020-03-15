import React, { Component, Fragment } from 'react'
import moment from 'moment'
import styled from 'styled-components';

import '../style/scheduler.css';

import EventModiModal from '../component/eventModificationModal';

import SchedulerManager from '../model/SchedulerManager';

const DrawingSchedule = styled.div.attrs(props => ({
    style: {
        height: props.heigth
    }
}))`
    position : absolute;
    top : ${props => props.top}px;
    box-sizing : border-box;
    width : 100%;
    border : 1px solid black;
    background-color: rgba(155, 155, 155, 0.603);
    min-height : 20px;
`

const Schedule = styled.div.attrs(props => ({
    style: {
        zIndex: props.zIndex,
    }
}))`
    position : absolute;
    box-sizing: border-box;
    min-height : 20px;
    background-color: rgba(155, 155, 155, 0.603);
    border : 1px solid black;
    z-index : 1;
    &:hover{
        background-color: green;
    }

`

export default class SchedulerDrawContainer extends Component {

    constructor(props) {
        super(props);
        this.DrawingBoard = React.createRef();
        this.SchedulerContainer = React.createRef();
    }

    componentDidMount(){
        const {today, schedules } = this.props; 
        SchedulerManager.calculate(schedules,today,this.updateSchedules);
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if(prevProps.schedules !== this.props.schedules){
            return true
        }
        return false;
      }

      componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot === true) {
          const {today, schedules } = this.props; 
        SchedulerManager.calculate(schedules,today,this.updateSchedules);
        }
      }
    static defaultProps = {
        today : moment("2020-02-01,00:00:00","YYYY-MM-DD,HH:mm:ss").clone(),
        schedule: [{
            eventStart: moment('2020-02-02 13:00:',"YYYY-MM-DD HH:mm"),
            eventStop: moment('2020-02-02 15:00',"YYYY-MM-DD HH:mm"),
            eventTitle: "dummyTitle",
            eventMemo: "dummyEventMemo"
        }],
        modalPlaceholder : {
            start : "Event start at :",
            stop : "Event stop at :",
        },
        save : ()=>{},
        delete : ()=>{},
        modify : ()=>{}
    }

    state = {
        modifyEvent: null,
        drawNewSchedule: null,
        schedules: [],
        maxDivision : 0,
        calculating : true,
    }

    updateSchedules = (calculatedSchedules,maxDivision)=>{
        this.setState({
            calculating : false,
            maxDivision : maxDivision,
            schedules : calculatedSchedules
        })
    }

    getTimePartitionHeight = (partitionTime) =>{
        const rectHeight = this.DrawingBoard.current.getBoundingClientRect().height;
        const hours = rectHeight / 24;
        const min = hours / partitionTime;
        return min;
    }

    drawNewEventStart = (e) => {
        if (this.state.drawNewSchedule === null) {
            const {today} = this.props;
            const min = this.getTimePartitionHeight(60);
           
            const mouseDownPosition = e.nativeEvent.clientY - this.DrawingBoard.current.getBoundingClientRect().top;
            const time = mouseDownPosition / min;
            const eventStart = today.clone().add(time,'m');
            const eventStop = eventStart.clone().add(5,'m');
            
            this.setState({
                drawNewSchedule: {
                    eventStart: eventStart,
                    eventStop: eventStop,
                    eventTitle: "New Event",
                    eventMemo: "",
                    mouseDownPosition: mouseDownPosition,
                    heigth: min *5,
                }
            })
        } else {
            console.log("no")
        }
    }

    drawNewEventStop = (e) => {
        if (this.state.drawNewSchedule !== null) {
            const {today} = this.props;
            const min = this.getTimePartitionHeight(60);
            const mouseMovePosition = e.nativeEvent.clientY - this.DrawingBoard.current.getBoundingClientRect().top;
            const time = (mouseMovePosition/min); 
            const eventStop = today.clone().add(time,'m');

            if(!this.state.drawNewSchedule.eventStart.isBefore(eventStop)){
                this.setState({
                    modifyEvent : this.state.drawNewSchedule
                })
            }else{
                const heigth = (mouseMovePosition - this.state.drawNewSchedule.mouseDownPosition)-2;

                const newHeightSchedule = Object.assign({}, this.state.drawNewSchedule, { heigth: heigth, eventStop : eventStop, newEvent : true});
                
                this.setState({
                    drawNewSchedule: newHeightSchedule,
                    modifyEvent : newHeightSchedule,
                })
            }
        }
    }

    drawing = (e) => {
        if (this.state.drawNewSchedule !== null) {
            const {today} = this.props;
            const min = this.getTimePartitionHeight(60);
            const mouseMovePosition = e.nativeEvent.clientY - this.DrawingBoard.current.getBoundingClientRect().top;
            const time = (mouseMovePosition/min); 
            const eventStop = today.clone().add(time,'m');

            if(!this.state.drawNewSchedule.eventStart.isBefore(eventStop)){
                return ; 
            }
            const heigth = (mouseMovePosition - this.state.drawNewSchedule.mouseDownPosition)-2;
            
            const newHeightSchedule = Object.assign({}, this.state.drawNewSchedule, { heigth: heigth, eventStop : eventStop, newEvent : true });
            this.setState({
                drawNewSchedule: newHeightSchedule,
            })
        }
    }

    drawTimeJone = () => {
        const TimeJones = [];
        for (let i = 0; i < 24; i++) {
            TimeJones.push(<Time
                time={i}></Time>)
        }
        return TimeJones;
    }

    modifyCancel = ()=>{
        const { modifyEvent} = this.state;
        if( modifyEvent !== null){
            this.closeModifyModal();
        }
    }

    showEventDetail = (event) =>{
        this.setState({
            modifyEvent : event
        })
    }

    saveNewEvent = (isNewEvent,event) =>{
        if(isNewEvent === true){
            this.props.save(event);            
        }else{
            this.props.modify(event,this.props.schedules[event.index]);
        }
        this.closeModifyModal();
    }

    deleteEvent = (deletedEventIndex) =>{
        this.closeModifyModal()
        const deletedEvent = this.props.schedules[deletedEventIndex];
        this.props.delete(deletedEvent);
    }

    closeModifyModal = ()=>{
        this.setState({
            modifyEvent : null,
            drawNewSchedule : null
        })
    }

    render() {
        const { drawNewSchedule,modifyEvent,maxDivision} = this.state;
        const schedules = this.state.schedules.map((event)=>{
            const left = 100 * (event.orderd / maxDivision);
            return <Schedule 
                onClick={()=> this.showEventDetail(event)}
                zIndex={drawNewSchedule !== null || modifyEvent !==null ? 0 : 1}
                style={{'maxWidth' : `${event.maxWidth}%`,'top' : `${event.top}%`, 'width' : `${event.width}%`,'height' : `${event.height}%`,'left' : `${left}%`}}
            >
                <label>{event.title}</label>
                <label>{event.eventStart.format("YYYY-MM-DD HH:mm")}</label>
            </Schedule>
        })

        return (
            <div className="SchedulerContainer" ref={this.SchedulerContainer}>
                { modifyEvent != null ? 
                <EventModiModal today={this.props.today}
                    modifyCancel = {this.modifyCancel}
                    save={this.saveNewEvent}
                    delete={this.deleteEvent}
                    schedule={modifyEvent}
                    placeholder={this.props.modalPlaceholder}
                /> : null}
                <div className="timeJoneContainer">
                    <div className="timeJone">
                        {this.drawTimeJone()}
                    </div>
                    <div className="scheduleJone">
                            {schedules}
                        <div
                            ref={this.DrawingBoard}
                            className="DrawingSchedulBoard"
                            onMouseDown={this.drawNewEventStart}
                            onMouseMove={this.drawing}
                            onMouseUp={this.drawNewEventStop}
                            style={{"zIndex" : `${drawNewSchedule !== null ? (modifyEvent !== null ? 0 : 2 ): 0}`}}>
                            {drawNewSchedule !== null ? <DrawingSchedule heigth={drawNewSchedule.heigth} top={drawNewSchedule.mouseDownPosition}> 
                                <label>{drawNewSchedule.eventTitle}</label>
                                <label id="newEventTime">{drawNewSchedule.eventStart.format("HH:mm")}-{drawNewSchedule.eventStop.format("HH:mm")}</label>
                            </DrawingSchedule>
                            : null}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


class Time extends Component {

    render() {
        // const hour = this.props.midnight === true ? 24 : this.props.time.hours();
        const hour = ()=>{
            const time = this.props.time < 10 ? `0${this.props.time}:00` : `${this.props.time}:00` 
            return time;
        }
        return (
            <Fragment>
                <div className="time">
                    {hour()}
                </div>
            </Fragment>
        )
    }
}