import React, { Component } from 'react'

export default class schedulerContainer extends Component {

    state ={
        scedule : [],
    }

    addEvent = (newEvent) => {
        this.setState({
            schedule : newEvent,
        })
    }
    render() {
        return (
            <div>
                
            </div>
        )
    }
}
