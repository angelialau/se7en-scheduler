export class appealReply{
  constructor(
  	public date: string, 
    public title?: string,
    public content?: string,
    public instructor?: string, // id
    public instructorid?: number,
    public scheduleId?: number
    ){}
  
}