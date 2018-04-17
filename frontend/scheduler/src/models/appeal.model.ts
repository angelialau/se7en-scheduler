export class Appeal{
  constructor(
  	public date: string, 
    public title?: string,
    public content?: string,
    public instructor?: string, // id
    public instructorId?: number,
    public scheduleId?: number,
    public id?: number
    ){}
  
}