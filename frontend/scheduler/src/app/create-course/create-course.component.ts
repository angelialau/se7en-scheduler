import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { User } from './../../models/user.model';
import { Course, Session, CourseDetail, courseDetails, class_type, 
  durations, venue_type } from './../../models/course.model';
import { Schedule } from './../../models/schedule.model';
import { ScheduleService } from './../services/schedule.service';
import { UserService } from './../services/user.service';

@Component({
  selector: 'app-create-course',
  templateUrl: './create-course.component.html',
  styleUrls: ['./create-course.component.css']
})

export class CreateCourseComponent implements OnInit {
  @Output() addedCourse : EventEmitter<any> = new EventEmitter();
  schedule_id : number;
  schedule : Schedule;
  courseDetails = courseDetails; 
  instructors : User[]= []; 
  class_type = class_type; 
  venue_type = venue_type;
  durations = durations;
  newForm: FormGroup;
  no_classesRange: Array<number>;
  class_sizeRange : Array<number>;
  profsInvolved : Array<any> = []; // stores selection before passing into final form
  tempInstructors : string;
  tempInstructor_ids : string;

  constructor(
    private formBuilder : FormBuilder,
    private snackBar : MatSnackBar,
    private scheduleService : ScheduleService,
    private userService: UserService,
    private route: ActivatedRoute
     ) {
    this.schedule_id = route.snapshot.params['schedule_id'];
  }

  ngOnInit() {
    // this.getSchedule(this.filterCourseDetails);
    this.createForm();
    this.getInstructors();
    this.no_classesRange = this.createRange(12);
    this.class_sizeRange = this.createRange(60);
    this.filterCourseDetails();
    
  }

  // new method
  // getSchedule(callback){
  //   this.scheduleService.getSchedule(this.schedule_id).subscribe(
  //     response => {
  //       // console.log(response);
  //       if(response.body.success){
  //         this.schedule.id = this.schedule_id;
  //         this.schedule.trimester = response.body.trimester;
  //         this.schedule.year = response.body.year;
  //         this.schedule.courses = response.body.courses;
  //         this.schedule.generated = response.body.generated;
  //         console.log('trimester:',this.schedule.trimester);
  //       }
  //     }, error => {
  //       console.log("getSchedule error:",error);
  //     } 
  //   )
  //   callback();
  // }

  filterCourseDetails(){
    let trimester = 0;
    this.scheduleService.getSchedule(this.schedule_id).subscribe(
      response => {
        if(response.body.success){
          trimester = response.body.trimester;
          console.log('trimester:',trimester);
          let currArray = courseDetails;
          let options = [[3,5,7],[1,8],[2,4,6]];
          let index = trimester-1;
          
          this.courseDetails = this.filterHelper(options[index], currArray);   
        }
      }, error => {
        console.log("getSchedule error:",error);
      } 
    )
  }

  filterHelper(options: Array<number>, currArray: Array<any>){
    let newArray = [];
    for(let course of currArray){
      if(options.includes(course.term)){
        newArray.push(course);
      }
    }   
    newArray.sort(function(a,b) {
      if(a.pillar.localeCompare(b.pillar) === 0){
        if(a.term == b.term){
          return a.course_no.localeCompare(b.course_no);  
        }else{ return a.term - b.term; }
      }else{
        return a.pillar.localeCompare(b.pillar);
      }
    })
    return newArray;
  }

  createForm(){ // assumes that u just want to add courses from existing database 
    this.newForm = this.formBuilder.group({
      courseDetail: ['', Validators.required], // course object for course number, name, term
      core: ['', Validators.required],
      no_classes: ['', Validators.required], // 1-12
      class_size: ['', Validators.required], // 1-55
      prof_list: new FormArray([
        new FormGroup({
          id: new FormControl('', Validators.required)
        })
      ]), // to filter the profs for professors later
      sessions: new FormArray([
        new FormGroup({
          class_types: new FormControl('', Validators.required),
          venue_types: new FormControl('No preference', Validators.required),
          sessions_hrs: new FormControl('', Validators.required)
        })
      ]), 
    })
  }

  rebuildForm(){
    this.newForm.reset();
    // this.setSessions(this.course.sessions); // input from getCourse
    // this.setProfs(input); // input from getCourse
  }  

  get sessions(): FormArray {
    return this.newForm.get('sessions') as FormArray;
  }

  get prof_list(): FormArray {
    return this.newForm.get('prof_list') as FormArray;
  }

  addSessionToCourse(){
    this.sessions.push(
      new FormGroup({
        class_types: new FormControl('', Validators.required),
        venue_types: new FormControl('No preference'),
        sessions_hrs: new FormControl('', Validators.required),        
      })
    );
  }

  addProfToCourse(){
    this.prof_list.push(this.formBuilder.group({
      id: ['', Validators.required]
    }));
  }
  
  deleteProf(index : number){ 
    let profId = this.prof_list.at(index).get('id').value;
    for (let session in this.profsInvolved){
      for(let prof of this.profsInvolved[session]){
       if (prof===profId){
         let index = this.profsInvolved[session].indexOf(prof);
         this.profsInvolved[session].splice(index);
       } 
      }
    }
    this.prof_list.removeAt(index); 
  }
  deleteSession(index : number){ this.sessions.removeAt(index); }

  //for editting courses
  // setSessions(sessions: Session[]){
  //   const sessionFormGroups = sessions.map(session => this.formBuilder.group(session));
  //   const sessionFormArray = this.formBuilder.array(sessionFormGroups);
  //   this.newForm.setControl('sessions', sessionFormArray);
  // }
  // setProfs(prof_list: String[]){
  //   const profsFormGroups = prof_list.map(prof_list => this.formBuilder.group(prof_list));
  //   const profsFormArray = this.formBuilder.array(profsFormGroups);
  //   this.newForm.setControl('prof_list', profsFormArray);
  // }  

  // turning form into Course
  translateDataToCourse() : Course{
    let data = this.newForm.value;
    let schedule_id = this.schedule_id; // TODO port courses to schedule and pass over schedule details
    let course_no = data.courseDetail;
    let course_name = this.queryCourse(course_no, "course_name");
    let term = this.queryCourse(course_no, "term");
    let core = Number(data.core);
    let no_classes = Number(data.no_classes);
    let class_size = Number(data.class_size);
    let no_sessions = data.sessions.length;
    let sessions_hrs : string = this.sessionsParser(data.sessions, "sessions_hrs");
    let class_types : string = this.sessionsParser(data.sessions, "class_types");
    let venue_types : string = this.sessionsParser(data.sessions, "venue_types");
    let split = null;
    this.prof_listParser();
    let instructors : string = this.tempInstructors;
    let instructor_ids : string = this.tempInstructor_ids;

    let course: Course = new Course(
      schedule_id,term,course_no,course_name,core,no_classes,
      class_size,no_sessions,sessions_hrs,class_types,venue_types,instructors,instructor_ids,split); 
    console.log(course);
    return course;
  }
  
  // http push to add course
  onSend(){ 
    let msg : string = "Submitted new course!";
    let errorMsg : string = "Hhm, something went wrong. Really sorry but please try again later!";
    this.scheduleService.addCourse(this.translateDataToCourse())
    .subscribe(
      response => {
        let success = JSON.parse(response).success;
        if(success){
          console.log("Successfully created new course!");
          this.snackBar.open(msg, null, { duration: 1000, });  
          // to update list of courses in schedule details
          this.addedCourse.emit(null);
        }else{
          console.log("Client error in addCourse via CreateCourseComponent");
          console.log(response);
          this.snackBar.open(errorMsg, null, { duration: 3000, });
        }
      },
      error => {
        console.log("Server error in addCourse via CreateCourseComponent");
        console.log(error);
        this.snackBar.open(errorMsg, null, { duration: 3000, });
      }
    );
  }
  // helper functions
  createRange(n : number) : number[]{
    let x=[];
    if(n<1){
      let error = new Error('range must start from 1');
      error.name = 'WrongRangeException';
      throw error;
    }
    let i=1;
    while(x.push(i++)<n);  
    return x;  
  }

  queryCourse(course_no, param: string): any{
    for(let course of courseDetails){
      if( course.course_no=== course_no){
        if (param === "term"){
          return course.term;
        }
        if (param === "course_name"){
          return course.course_name;
        }
        if(param === "pillar"){
          return course.pillar;
        }
        else{
          let error = new Error('param not found');
          error.name = 'NoParamForQueryException';
          throw error;      
        }
      }
    }
    let error = new Error('course to be queried not found');
    error.name = 'NoCourseForQueryException';
    throw error;   
  }

  getInstructors(){
    this.userService.getAllInstructors()
    .map((data: any) => {
      // sorts list of instructors in alphabetical order
      this.instructors = data.body.sort(function(a,b) {
        if(a.pillar.localeCompare(b.pillar) === 0){
          return a.name.localeCompare(b.name);
        } else{
          return a.pillar.localeCompare(b.pillar);
        }
      });
    })
    .subscribe(data => {}, 
      error => {
        console.log("getInstructors error"); 
        console.log(error)
      });
  }

  queryInstructors(profId:number){
    for(let i=0; i<this.instructors.length; i++){
      if (this.instructors[i].id==profId){
        return this.instructors[i].name;
      }
    } let error = new Error("instructor to be queried not found");
    error.name = 'NoInstructorForQueryException';
    throw error;
  }

  updateProfsInvolved(event, sessionIndex: number, profId: number){
    if(event.target.checked === true){
      // if initially the array is empty and uninitialised
      if(this.profsInvolved[sessionIndex] === undefined){
        this.profsInvolved[sessionIndex] = [profId];
      }
      else{
        this.profsInvolved[sessionIndex].push(profId);
      }
    }else{
      // if user unchecks the checkbox, i remove the profId
      let index = this.profsInvolved[sessionIndex].indexOf(profId);
      this.profsInvolved[sessionIndex].splice(index);      
    }
    console.log("profs involved changed:", this.profsInvolved)
  }

  // translates into format eg 51|55|51,55
  // sessions delimited by pipe
  // profs within session delimited by commas
  prof_listParser(){
    let array : string[] = [];
    let nameArray : string[] = [];
    for (let session of this.profsInvolved){
      let subarray: string[] = [];
      let subNameArray: string[] = [];
      for(let prof of session){
        subarray.push(prof);
        subNameArray.push(this.queryInstructors(prof))
      }
      array.push(subarray.join(","));
      nameArray.push(subNameArray.join(","));
    } 
    this.tempInstructor_ids = array.join("|");
    this.tempInstructors = nameArray.join("|");
  }

  sessionsParser(sessions: any, param: string): string{
    let array : string[] = [];
    if(param === "sessions_hrs"){
      for (let session of sessions){
        array.push(session.sessions_hrs);
      } 
    }else if(param==="class_types"){
      for (let session of sessions){
        array.push(session.class_types);
      } 
    }else if(param==="venue_types"){
      for (let session of sessions){
        array.push(session.venue_types);
      } 
    }else{
      let error = new Error('param not found');
      error.name = 'NoParamForQueryException';
      throw error; 
    }
    return array.join();
  }

  temp(){
    console.log(this.sessionsParser(this.newForm.value.sessions, "venue_types"));
  }

  get diagnostic() { return JSON.stringify(this.profsInvolved); }
  

}
