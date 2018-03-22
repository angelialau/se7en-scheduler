export class Event{
  constructor(
    public date: Date, // new Date(year,month,day,hours,minutes)
    public day: string, // getDay
    public time: string, // toTimeString
    public capacity: number,
    public id?: number,
    public eventName?: string,
    ){}
}

export const timeslots=[
  {
    date: new Date(2018, 4, 2, 15),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 2, 15,30),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 2, 16),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 20,
  },
  {
    date: new Date(2018, 4, 2, 16,30),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 15,
  },
  {
    date: new Date(2018, 4, 3, 15),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 3, 15,30),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 3, 16),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 20,
  },
  {
    date: new Date(2018, 4, 3, 16,30),
    day: this.date.getDay(),
    time: this.date.toTimeString(),
    capacity: 20,
  },
]