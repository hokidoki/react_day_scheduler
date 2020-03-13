import React, { Component } from 'react'
// import ScheduleContainer from './schedulerPage/schedulerContainer';
import SchedulerDrawContainer from './schedulerPage/schedulerDrawContainer'

export default class App extends Component {

  // state = {
  //   schedules : [{
  //     eventStart : "2020-02-01 00:00",
  //     eventStop : "2020-02-01 07:00",
  //     eventTitle : "a"
  // },{
  //     eventStart : "2020-02-01 11:30",
  //     eventStop : "2020-02-01 12:30",
  //     eventTitle : "b"
  // },{
  //     eventStart : "2020-02-01 08:20",
  //     eventStop : "2020-02-01 08:50",
  //     eventTitle : "c"
  // },{
  //     eventStart : "2020-02-01 17:00",
  //     eventStop : "2020-02-01 17:20",
  //     eventTitle : "d"
  // },{
  //     eventStart : "2020-02-01 12:40",
  //     eventStop : "2020-02-01 16:20",
  //     eventTitle : "e"
  // },{
  //     eventStart : "2020-02-01 11:30",
  //     eventStop : "2020-02-01 13:21",
  //     eventTitle : "f"
  // },{
  //     eventStart : "2020-02-01 16:00",
  //     eventStop : "2020-02-01 18:21",
  //     eventTitle : "g"
  // },{
  //     eventStart : "2020-02-01 10:40",
  //     eventStop : "2020-02-01 10:41",
  //     eventTitle : "h"
  // },{
  //     eventStart : "2020-02-01 13:31",
  //     eventStop : "2020-02-01 14:50",
  //     eventTitle : "i"
  // },{
  //     eventStart : "2020-02-01 09:00",
  //     eventStop : "2020-02-01 18:00",
  //     eventTitle : "j"
  // }]
  // }

  state ={
    schedules : []
  }
  delete = ()=>{

  }

  save = (newEvent) => {
    const prevState = this.state.schedules;
    const newSchedules = [...prevState,newEvent];
    this.setState({
      schedules : newSchedules,
    })
  }

  modify = ()=>{

  }
  render() {
    
    return (
      <div>
        <SchedulerDrawContainer schedules={this.state.schedules}
          save = {this.save}
        ></SchedulerDrawContainer>
        {/* <ScheduleContainer></ScheduleContainer> */}
      </div>
    )
  }
}
