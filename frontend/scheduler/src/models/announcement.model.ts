export class Announcement{
  constructor(
    public adminId: number, // id
    public date: string, 
    public title?: string,
    public content?: string,
    public id?: number,
    ){}
  
}