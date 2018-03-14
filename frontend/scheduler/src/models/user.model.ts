export class User{
  constructor(
    public email: string,
    public password: string,
    public admin?: number, // 1 or 0 
    public name?: string,
    public phone?: number,
    public id?: number
  ) { }
}