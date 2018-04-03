export class Event{
  constructor(
    public schedule_id: number,
    // for actual event:
    public id?: number,
    public eventName?: string,
    public instructorId?: number, // id of prof in charge of event
    public location?: string, // assigned venue for event
    // for both search and actual event:
    public startDate?: Date, // YYYY-MM-DD
    public endDate?: Date, // YYYY-MM-DD
    public startTime?: string, // HH:MM
    public endTime?: string, // HH:MM
    public day?: string, 
    public capacity?: number,
  ){}
}

export const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

