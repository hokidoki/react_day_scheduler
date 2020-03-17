# react-day-scheduler

hello it's react-day-scheduler component 

## warning 

This is my first deployment module and my current beta version. Please be careful of the use.

## what is it ? 

This is a component that automatically specifies the size and height position of the event div using schedule information

Create new events with one drag !

## install 

npm : npm install react-day-scheduler

## Usage

import DayScheduleContainer from 'react-day-scheduler/dist';

## 8 different Props 

* scheuldes
  * Schedules props is where events that need to be output on the screen are delivered. The props are delivered in an array, and what you must keep is that the objects in the array have the following properties: For example, the following: [{eventStart : "20-02-03 08:02",EventStop :"20-02-03 09:00",EventTitle : "", eventMemo : ""}] 

If the eventStart Property and EventStop Property of an object in an array are earlier or later than the date delivered to Today Props at the same time, be careful, they will not be output on the screen.

Additional color properties exist. This Property specifies the color in which the schedule will be displayed on the screen. The default is specified in gray. Color: "Blue"

* oneHourHeight 
  * By default, react-day-scheduler specifies the time of the new event, which is the size of the component divided by 24 hours. So this props is used to specify the px interval of one hour. (The default size specified is 50px. So, we only support the number type 1200 px in size.

* today
  *This props selects the date when the current schedule data should be shown (must be delivered in the form "2020-02-03" when used). ) The default is based on today's date
  
* modalPlaceholder 
  *This props is used to change the start and end of events in modal when creating new events. Use {start : ","stop :"""} as follows You can deliver it in form. The default is Event start at , Event stop at 

* save
  *This props is used to receive newly created events as call back. You receive objects for new events as the first forward parameter. (newEvent)=>{}
  
* delete
  *This props is used to receive deleted events as call back. You receive objects for events deleted by the first forward parameter.(deleteEvent)=>{}

*modify
  *This props is used to receive modified events as call back. The modified event is delivered to the first parameter and the second parameter is before modified. (modifiedEvent, beforeModifiedEvent)=>{}
  
* schedulePlaceholder
  *This props is used to specify the properties that you want to display as a label in the event division displayed on the screen. For example, if you pass to ["eventStart"], the event will show values for eventStart.

## contact

email : substantiation@naver.com.  
blog : http://hokeydokey.tistory.com.  
  
 
