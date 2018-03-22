export class User{
  constructor(
    public email: string,
    public password: string,
    public pillar?: string, // Administrator/ISTD/ESD/EPD/ASD 
    public name?: string,
    public phone?: number,
    public id?: number,
    public schedules?: string,
    public courses?: string,
  ) { }
}