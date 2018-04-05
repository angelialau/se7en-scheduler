export class Appeal{
  constructor(
  	public date: string, 
    public title?: string,
    public content?: string,
    public instructor?: string, // id
    public instructorid?: number,
    public id?: number
    ){}
  
}