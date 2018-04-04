export class Course{
  constructor(
    public schedule_id: number,
    public term: number, 
    public course_no: string,
    public course_name: string, 
    public core: number, // either 1 or 0 
    public no_classes: number,
    public class_size: number,
    public no_sessions: number,
    public sessions_hrs: string,
    public class_types: string,
    public venue_types: string,
    public instructors: string, // names    
    public instructor_ids: string, // ids    
    public split: string,   
    public id?: number, 
    ) { }
}

export class Session {
  sessions_hrs = ''; // sessions_hrs
  class_types = ''; // class_types
  instructors = ''; // instructors
  split = ''; 
}

export class CourseDetail {
  course_no = '';
  course_name = '';
  term = '';
  pillar = '';
}

export const courseDetails = [
  {
    course_no: "01.112",
    course_name: "Machine Learning", 
    term : 6,
    pillar: "ISTD"
  },
  {
    course_no: "50.008",
    course_name: "Database Management Systems", 
    term : 6,
    pillar: "ISTD"
  },
  {
    course_no: "50.012",
    course_name: "Networks", 
    term : 6,
    pillar: "ISTD"
  },
  // {
  //   course_no: "50.001",
  //   course_name: "Introduction to Information Systems & Programming", 
  //   term : 4,
  //   pillar: "ISTD"
  // },
  // {
  //   course_no: "50.002",
  //   course_name: "Computation Structures", 
  //   term : 4,
  //   pillar: "ISTD"
  // },
  // {
  //   course_no: "50.004",
  //   course_name: "Introduction to Algorithms", 
  //   term : 4,
  //   pillar: "ISTD"
  // },
  // {
  //   course_no: "01.110",
  //   course_name: "Computational Fabrication", 
  //   term : 8,
  //   pillar: "ISTD"
  // },
  // {
  //   course_no: "50.021",
  //   course_name: "Artificial Intelligence", 
  //   term : 8,
  //   pillar: "ISTD"
  // },
  {
    course_no: "50.006",
    course_name: "User Interface Design and Implementation", 
    term : 7,
    pillar: "ISTD"
  },
  {
    course_no: "50.017",
    course_name: "Graphics and Visualisation", 
    term : 7,
    pillar: "ISTD"
  },
  {
    course_no: "50.020",
    course_name: "Security", 
    term : 7,
    pillar: "ISTD"
  },
  {
    course_no: "50.035",
    course_name: "Computer Vision", 
    term : 7,
    pillar: "ISTD"
  },
  // {
  //   course_no: "50.003",
  //   course_name: "Elements of Software Construction", 
  //   term : 5,
  //   pillar: "ISTD"
  // },
  // {
  //   course_no: "50.005",
  //   course_name: "Computer System Engineering", 
  //   term : 5,
  //   pillar: "ISTD"
  // },
  // {
  //   course_no: "50.034",
  //   course_name: "Introduction to Probability and Statistics", 
  //   term : 5,
  //   pillar: "ISTD"
  // }, 
  {
    course_no: "30.104",
    course_name: "Dynamics", 
    term : 6,
    pillar: "EPD"
  }, 
  {
    course_no: "30.108",
    course_name: "Material Science", 
    term : 6,
    pillar: "EPD"
  },
  {
    course_no: "30.203",
    course_name: "Topics in Biomedical and Healthcare Engineering", 
    term : 6,
    pillar: "EPD"
  },  
  {
    course_no: "30.113",
    course_name: "Design and Fabrication Microelectromechanical Systems (MEMS)", 
    term : 7,
    pillar: "EPD"
  }, 
  {
    course_no: "30.114",
    course_name: "Advanced Feedback and Control", 
    term : 7,
    pillar: "EPD"
  }, 
  {
    course_no: "40.001",
    course_name: "Probability", 
    term : 6,
    pillar: "ESD"
  }, 
  {
    course_no: "40.002",
    course_name: "Optimisation", 
    term : 6,
    pillar: "ESD"
  }, 
  {
    course_no: "40.011",
    course_name: "Data and Business Analytics", 
    term : 6,
    pillar: "ESD"
  }, 
  {
    course_no: "01.104",
    course_name: "Networked Life", 
    term : 7,
    pillar: "ESD"
  }, 
  {
    course_no: "40.004",
    course_name: "Statistics", 
    term : 7,
    pillar: "ESD"
  }, 
  {
    course_no: "40.012",
    course_name: "Manufacturing and Service Operations", 
    term : 7,
    pillar: "ESD"
  }, 
]

courseDetails.sort((a,b) => parseFloat(a.course_no)-parseFloat(b.course_no));

export const class_type = ["Cohort Based Learning", "Lecture", "Lab"]
class_type.sort((a,b) => a.localeCompare(b));

export const venue_type = [ "No preference", "Cohort Classroom", "Think Tank", "Tiered Think Tank", "Lecture Theatre"]
class_type.sort((a,b) => a.localeCompare(b));

export const durations = [1,1.5,2,2.5,3]
