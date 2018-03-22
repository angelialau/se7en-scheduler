export class Schedule{
  constructor(
    public trimester: number,
    public year: number, 
    public courses?: string,
    public id?: number,
  ) { }
}