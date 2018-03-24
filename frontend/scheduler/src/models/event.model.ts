export class Event{
  constructor(
    public schedule_id: number,
    public day: string, 
    public time: string, // HH:MM
    public capacity: number,
    public id?: number,
    public eventName?: string,
    public startDate?: Date, // YYYY-MM-DD
    public endDate?: Date, // YYYY-MM-DD
    ){}
}

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export const timeslots=[
  {
    date: new Date(2018, 4, 2, 15),
    day: days[0],
    time: "15:00",
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 2, 15,30),
    day: days[0],
    time: "15:30",
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 2, 16),
    day: days[0],
    time: "16:00",
    capacity: 20,
  },
  {
    date: new Date(2018, 4, 2, 16,30),
    day: days[0],
    time: "16:30",
    capacity: 15,
  },
  {
    date: new Date(2018, 4, 3, 15),
    day: days[1],
    time: "15:00",
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 3, 15,30),
    day: days[1],
    time: "15:30",
    capacity: 50,
  },
  {
    date: new Date(2018, 4, 3, 16),
    day: days[1],
    time: "16:00",
    capacity: 20,
  },
  {
    date: new Date(2018, 4, 3, 16,30),
    day: days[1],
    time: "16:30",
    capacity: 20,
  },
]