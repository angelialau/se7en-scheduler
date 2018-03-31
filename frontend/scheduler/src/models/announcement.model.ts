export class Announcement{
  constructor(
    public date: string, 
    public senderId?: number, // id
    public sender?: string, // id
    public title?: string,
    public content?: string,
    public id?: number,
    ){}
  
}