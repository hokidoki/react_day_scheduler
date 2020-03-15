import React, { Component } from 'react'
// import ScheduleContainer from './schedulerPage/schedulerContainer';
import SchedulerDrawContainer from './schedulerPage/schedulerDrawContainer'

export default class App extends Component {

  state = {
    schedules : [{
      eventStart : "2020-02-01 00:00",
      eventStop : "2020-02-01 07:00",
      eventTitle : "a",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 11:30",
      eventStop : "2020-02-01 12:30",
      eventTitle : "b",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 08:20",
      eventStop : "2020-02-01 08:50",
      eventTitle : "c",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 17:00",
      eventStop : "2020-02-01 17:20",
      eventTitle : "d",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 12:40",
      eventStop : "2020-02-01 16:20",
      eventTitle : "e",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 11:30",
      eventStop : "2020-02-01 13:21",
      eventTitle : "f",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 16:00",
      eventStop : "2020-02-01 18:21",
      eventTitle : "g",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 10:40",
      eventStop : "2020-02-01 10:41",
      eventTitle : "h",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 13:31",
      eventStop : "2020-02-01 14:50",
      eventTitle : "i",
      eventMemo : "hello"
  },{
      eventStart : "2020-02-01 09:00",
      eventStop : "2020-02-01 18:00",
      eventTitle : "j",
      eventMemo : "hello"
  }],
  modalPlaceholder : {
    start : "Event start at :",
    stop : "Event stop at :"
  }
  }

  // state ={
  //   schedules : []
  // }

  save = (newEvent) => {
    const prevState = this.state.schedules;
    const newSchedules = [...prevState,newEvent];
    this.setState({
      schedules : newSchedules,
    })
  }

  modify = (newEvent,oldEvent)=>{
    // console.log(newEvent);
    // console.log(oldEvent);
    const newSchedules = this.state.schedules.filter((schedule)=>{
      return schedule !== oldEvent;
    })
    this.setState({
      schedules : [...newSchedules,newEvent]
    })
  }

  delete = (removedEvent)=>{
    this.setState({
      schedules : this.state.schedules.filter((event)=>{
        return removedEvent !== event
      })
    })
  }

  render() {
    
    return (
      <div>
        <SchedulerDrawContainer schedules={this.state.schedules}
          today = {"2020-02-01"}
          save = {this.save}
          modify = {this.modify}
          delete = {this.delete}
          modalPlaceholder = {this.state.modalPlaceholder}
        ></SchedulerDrawContainer>
        {/* <ScheduleContainer></ScheduleContainer> */}
      </div>
    )
  }
}
