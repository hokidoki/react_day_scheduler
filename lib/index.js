import React, { Component } from 'react'
import moment from 'moment'
import styled from 'styled-components';

import './style/scheduler.css';

import EventModiModal from './component/eventModificationModal';

import SchedulerManager from './model/SchedulerManager';

const DrawingSchedule = styled.div.attrs(props => ({
    style: {
        height: props.heigth
    }
}))`
    position : absolute;
    top : ${props => props.top}px;
    box-sizing : border-box;
    width : 100%;
`

const Schedule = styled.div.attrs(props => ({
    style: {
        zIndex: props.zIndex,
    }
}))`
    position : absolute;
    box-sizing: border-box;
    z-index : 1;
`

export default class SchedulerDrawContainer extends Component {

    constructor(props) {
        super(props);
        this.DrawingBoard = React.createRef();
        this.SchedulerContainer = React.createRef();
        
    }

    componentDidMount(){
        const { schedules } = this.props; 
        SchedulerManager.calculate(schedules,this.state.today,this.updateSchedules);
    }
    getSnapshotBeforeUpdate(prevProps, prevState) {
        if(prevProps.schedules !== this.props.schedules || prevProps.today !== this.props.today){
            return true
        }
        return false;
      }

      componentDidUpdate(prevProps, prevState, snapshot) {
        if (snapshot === true) {
          const {today, schedules } = this.props; 
        SchedulerManager.calculate(schedules,moment(today),this.updateSchedules);
        this.setState({
            today : moment(this.props.today)
        })
        }
      }

    static defaultProps = {
        today : moment().clone(),
        schedules: [],
        modalPlaceholder : {
            start : "Event start at :",
            stop : "Event stop at :",
        },
        save : ()=>{},
        delete : ()=>{},
        modify : ()=>{},
        schedulePlaceholder: []
    }

    state = {
        today : moment(this.props.today),
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
            const {today} = this.state;
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
            const {today} = this.state;
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
            const {today} = this.state;
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
                key={event.index}
                className="schedule"
                onClick={()=> this.showEventDetail(event)}
                zIndex={drawNewSchedule !== null || modifyEvent !==null ? 0 : 1}
                style={{'backgroundColor' : `${event.color ? event.color : "gray"}`,'maxWidth' : `${event.maxWidth}%`,'top' : `${event.top}%`, 'width' : `${event.width}%`,'height' : `${event.height}%`,'left' : `${left}%`}}
            >
                {this.props.schedulePlaceholder.map((item)=>{
                    return <label className={`schedulePlaceHolder_${item}`}>{this.props.schedules[event.index][item]}</label>
                })}
            </Schedule>
        })

        return (
            <div className="SchedulerContainer" ref={this.SchedulerContainer}>
                { modifyEvent != null ? 
                <EventModiModal today={this.state.today}
                    modifyCancel = {this.modifyCancel}
                    save={this.saveNewEvent}
                    delete={this.deleteEvent}
                    schedule={modifyEvent}
                    placeholder={this.props.modalPlaceholder}
                /> : null}
                <div className="timeJoneContainer">
                    <div className="scheduleJone">
                            {schedules}
                        <div
                            ref={this.DrawingBoard}
                            className="DrawingSchedulBoard"
                            onMouseDown={this.drawNewEventStart}
                            onMouseMove={this.drawing}
                            onMouseUp={this.drawNewEventStop}
                            style={{"height" : `${this.props.oneHourHeight ? `${this.props.oneHourHeight *24}px`:"1200px" }`,"zIndex" : `${drawNewSchedule !== null ? (modifyEvent !== null ? 0 : 2 ): 0}`}}>
                            {drawNewSchedule !== null ? <DrawingSchedule heigth={drawNewSchedule.heigth} top={drawNewSchedule.mouseDownPosition} className="drawSchedule"> 
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

