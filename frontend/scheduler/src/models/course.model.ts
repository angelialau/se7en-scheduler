export class Course{
  constructor(
    public schedule_id: number,
    public course_name: string, // according to istdCourses.txt
    public core: number, // either 1 or 0 
    public no_sessions: number,
    public sessions_hrs: string,
    public locations: string,
    public term: number, 
    public instructors: string,
    ) { }
}