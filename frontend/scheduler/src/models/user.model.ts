export class User{
  id: number;
  name: string;
  email: string;
  phone: number;
  employee_id: number;
  passwordHash: string; // to be deprecated
  salt: string; // to be deprecated
  admin: number;
}