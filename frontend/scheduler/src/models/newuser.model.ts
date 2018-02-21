export class NewUser{
  
  constructor(
    public admin: number,
    public name: string,
    public email: string,
    public phone: number,
    public employee_id: number,
    public password: string
  ) { }
}