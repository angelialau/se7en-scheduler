export class Schedule{
  constructor(
    public trimester: number,
    public year: number, 
    public courses?: string,
    public id?: number,
    public generated?: number, // 0 or 1
    public finalized?: number, // 0 or 1
    public startDate?: Date,
    public endDate?: Date,
  ) { }
}