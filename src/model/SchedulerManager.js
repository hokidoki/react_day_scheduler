import moment from 'moment';

export default class SchedulerManager{  
    
    static async calculate(schedules,today,callback){

        const unSortedSchedules = schedules.slice().map((event,index)=>{
            return Object.assign({},event,{
                eventStart : moment(event.eventStart),
                eventStop : moment(event.eventStop),
                index : index
            })
        });

        const sortededByEventStopSchedules = this.sortByEventStop(unSortedSchedules);        
        const sortededByEventStartSchedules = this.sortByEventStart(sortededByEventStopSchedules);
        const partitionMatrix = await this.makePartitionMatrix(sortededByEventStartSchedules.slice());
        const linierMatrix = await this.makeLiniermatrix(partitionMatrix.slice());
        const calculatedDivisionMatrix = await this.calculateMaxDivision(linierMatrix.slice());
        const calculateWidthMatrix = await this.calculateWidth(calculatedDivisionMatrix.slice(),100,partitionMatrix.length);
        const calculatedTopMatrix = await this.calculateTop(calculateWidthMatrix.slice(),100,today);
        const calculatedHeightMatrix = await this.calculateHeight(calculatedTopMatrix.slice(),100,today);
        callback(calculatedHeightMatrix,partitionMatrix.length);
    }

    static calculateHeight(calculatedTopMatrix,height,today){
        return new Promise((resolve,reject)=>{
            const hour = height/24;
            const min = hour/60;
            const tomorrow = today.clone().add(1,'d');
        
            for(let i = 0; i < calculatedTopMatrix.length; i++){
                if(calculatedTopMatrix[i].eventStop.isBefore(tomorrow)){
                    const eventStopHour = calculatedTopMatrix[i].eventStop.hour();
                    const eventStopMin = calculatedTopMatrix[i].eventStop.minutes();
        
                    const eventStopPosition = min * ((eventStopHour * 60) + eventStopMin);
                    const newHeight = eventStopPosition - calculatedTopMatrix[i].top;
                    calculatedTopMatrix[i].height = newHeight;
                }else{
                    const newHeight = calculatedTopMatrix[i].top - height;
                    calculatedTopMatrix[i].height = newHeight;
                }
                // console.log("title :" + calculatedTopMatrix[i].title);
                // console.log("top :" +calculatedTopMatrix[i].top);
                // console.log("height :" + calculatedTopMatrix[i].height);
                // console.log("width :" + calculatedTopMatrix[i].width);
                // console.log();
            }
            resolve(calculatedTopMatrix);
        })
    }

    static calculateTop(calculateWidthMatrix,height,today){
        return new Promise((resolve,reject)=>{
            const hour = height/24;
            const min = hour/60;
            for(let i = 0; i< calculateWidthMatrix.length; i++){
                if(calculateWidthMatrix[i].eventStart.isBefore(today)){
                    calculateWidthMatrix[i].top = 0;
                }else{
                    const eventStartHour = calculateWidthMatrix[i].eventStart.hour();
                    const eventStartMin = calculateWidthMatrix[i].eventStart.minutes();
                    calculateWidthMatrix[i].top = min * ((eventStartHour * 60) + eventStartMin)
                }
            }
            resolve(calculateWidthMatrix);
        })
    }

    static calculateWidth(calculatedDivisionMatrix,width,maxDivide){
        return new Promise((resolve,reject)=>{
            for(let i = 0; i < calculatedDivisionMatrix.length; i++){
                calculatedDivisionMatrix[i].width = width * (maxDivide - (calculatedDivisionMatrix[i].maxDivision - 1)) / maxDivide;
            }
        
            resolve(calculatedDivisionMatrix);
        })
    }

    static calculateMaxDivision(linierMatrix){
        return new Promise((resolve,reject)=>{
            for(let i = linierMatrix.length-1; i > 0; i-- ){
                let higherOrderEvent = linierMatrix[i];
                for(let u = i -1; u >= 0; u--){
                    let lowerOrderEvent = linierMatrix[u];
                    if(higherOrderEvent.eventStop.isBetween(lowerOrderEvent.eventStart,lowerOrderEvent.eventStop) || lowerOrderEvent.eventStart.isBetween(higherOrderEvent.eventStart,higherOrderEvent.eventStop)){
                        if(higherOrderEvent.maxDivision > lowerOrderEvent.maxDivision){
                            lowerOrderEvent.maxDivision = higherOrderEvent.maxDivision;
                        }
                    }else if(higherOrderEvent.eventStart.isBetween(lowerOrderEvent.eventStart,lowerOrderEvent.eventStop) || lowerOrderEvent.eventStop.isBetween(higherOrderEvent.eventStart,higherOrderEvent.eventStop)){
                        if(higherOrderEvent.maxDivision > lowerOrderEvent.maxDivision){
                            lowerOrderEvent.maxDivision = higherOrderEvent.maxDivision;
                        }
                    }
                }
            }
            for(let i = 0 ; i < linierMatrix.length; i++ ){
                let lowerOrderEvent = linierMatrix[i];
                for(let u = i + 1; linierMatrix.length > u; u++){
                    let higherOrderEvent = linierMatrix[u];
                    if(higherOrderEvent.eventStop.isBetween(lowerOrderEvent.eventStart,lowerOrderEvent.eventStop) || lowerOrderEvent.eventStart.isBetween(higherOrderEvent.eventStart,higherOrderEvent.eventStop)){
                        if(higherOrderEvent.maxDivision > lowerOrderEvent.maxDivision){
                            lowerOrderEvent.maxDivision = higherOrderEvent.maxDivision;
                        }
                    }else if(higherOrderEvent.eventStart.isBetween(lowerOrderEvent.eventStart,lowerOrderEvent.eventStop) || lowerOrderEvent.eventStop.isBetween(higherOrderEvent.eventStart,higherOrderEvent.eventStop)){
                        if(higherOrderEvent.maxDivision > lowerOrderEvent.maxDivision){
                            lowerOrderEvent.maxDivision = higherOrderEvent.maxDivision;
                        }
                    }
                }
            }
            resolve(linierMatrix)
        })
    }

    static makeLiniermatrix(partitionMatrix){
        return new Promise((resolve,reject)=>{
            const linierMatrix = [];
            for(let i = 0; i < partitionMatrix.length; i++){
                partitionMatrix[i].map((event)=>{
                    linierMatrix.push(event);
                    return event;
                });
            }
            resolve(linierMatrix);
        })
    }
    static sortByEventStop(schedules){
        return schedules.sort((a, b) => a.eventStop.diff(b.eventStop));
    }
    static sortByEventStart(schedules){
        return schedules.sort((a, b) => a.eventStart.diff(b.eventStart));
    }

    static makePartitionMatrix(sortedArray){

        return new Promise((resolve,reject)=>{

            if(sortedArray.length === 0 ){
                resolve([[]]);
            }else{
                const partitionMatrix = [];
                sortedArray[0].orderd = 0;
                sortedArray[0].maxDivision = 1;
                partitionMatrix[0] = [sortedArray[0]];
            
                for(let i = 1; i < sortedArray.length; i++){
                    const inputSchedule = sortedArray[i];
                    let plage = false;
            
                    for(let j = 0; j<partitionMatrix.length; j++){
                        const lastScheduleIndex = partitionMatrix[j].length-1;
                        const lastSchedule = partitionMatrix[j][lastScheduleIndex];
            
                        if(!inputSchedule.eventStart.isBetween(lastSchedule.eventStart,lastSchedule.eventStop)){
                            if(inputSchedule.eventStart.format("YYYY-MM-DD HH:mm") === lastSchedule.eventStart.format("YYYY-MM-DD HH:mm")){
                                continue;
                            }
                            inputSchedule.orderd = j;
                            inputSchedule.maxDivision = j + 1;
                            partitionMatrix[j].push(inputSchedule);
                            plage = true;
                            break;
                        }
                    }
            
                    if(plage === false){
                        inputSchedule.orderd = partitionMatrix.length;
                        inputSchedule.maxDivision = partitionMatrix.length + 1;
                        partitionMatrix.push([inputSchedule]);
                    }
                }
                resolve(partitionMatrix);
            }
        })
    }
}