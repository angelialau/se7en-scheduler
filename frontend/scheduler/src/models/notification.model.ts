export class Notification{
  constructor(
    public adminId: number, // id
    public title?: string,
    public content?: string,
    public date?: Date,
    public id?: number,
    ){}
  
}