export class NewUser{
  constructor(
    public admin: number, // 1 or 0 
    public name: string,
    public email: string,
    public phone: number,
    public password: string,
    public id?: number
  ) { }
}