export class Event{
  constructor(
    public schedule_id: number,
    public term?: string,
    public pillar?: string,
    public course?: string, 
    public prof?: string, // get from prof_id
    public prof_id?: string, 
    public cohort?: string,
    public location?: string, // get from slot
    public day?: number, // get from slot
    public date?: string, // get from slot
    public start?: string, 
    public end?: string,
  ){}
}

export class Slot{
  constructor(
    public venue: string, // eg Cohort Classroom 1
    public date: string, // eg Fri Apr 06 2018 
    public time: string, // HH:MM
  ){}
}

export class Search{
  constructor(
    public schedule_id: number,
    public startDate: string, // YYYY-MM-DD
    public endDate: string, // YYYY-MM-DD
    public startTime: string, // HH:MM
    public endTime: string, // HH:MM
    public day: string, 
  ){}
}

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

