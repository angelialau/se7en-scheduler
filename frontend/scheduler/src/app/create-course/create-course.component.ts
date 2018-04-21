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
  showCosNotCapstone: boolean = true;

  constructor(
    private formBuilder : FormBuilder,
    private snackBar : MatSnackBar,
    private scheduleService : ScheduleService,
    private userService: UserService,
    private route: ActivatedRoute, 
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

  // gets the trimester of the schedule at hand
  // to the trimester
  filterCourseDetails(){
    let trimester = 0;
    this.scheduleService.getSchedule(this.schedule_id).subscribe(
      response => {
        if(response.body.success){
          trimester = response.body.trimester;
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

  // filters out the courses that belong in the indicated trimester
  // eg trimester 1 contains courses for terms 3, 5, 7 
  filterHelper(options: Array<number>, currArray: Array<any>){
    let newArray = [];
    for(let course of currArray){
      if(options.includes(course.term)){
        newArray.push(course);
      }
    }  
    // console.log('unsorted array',newArray); // for testing
    newArray.sort(function(a,b) {
      if(a.pillar.localeCompare(b.pillar) === 0){
        if(a.term == b.term){
          return a.course_no.localeCompare(b.course_no);  
        }else{ return a.term - b.term; }
      }else{
        return a.pillar.localeCompare(b.pillar);
      }
    })
    // console.log('sorted array',newArray); // for testing
    return newArray;
  }

  // for initialising the form
  createForm(){ 
    this.newForm = this.formBuilder.group({
      courseDetail: ['', Validators.required], // object for course number, name, term
      core: ['0', Validators.required],
      no_classes: ['', Validators.required], // of range 1-12
      class_size: ['', Validators.required], // of range 1-55
      prof_list: new FormArray([ // necessary for to filter the profs for professors later
        new FormGroup({
          id: new FormControl('', Validators.required)
        })
      ]), 
      sessions: new FormArray([
        new FormGroup({
          class_types: new FormControl('0', Validators.required),
          venue_types: new FormControl('No preference', Validators.required),
          sessions_hrs: new FormControl('0', Validators.required)
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

  // dynamically adds a new session to the form
  addSessionToCourse(){
    this.sessions.push(
      new FormGroup({
        class_types: new FormControl('', Validators.required),
        venue_types: new FormControl('No preference'),
        sessions_hrs: new FormControl('', Validators.required),        
      })
    );
  }

  // dynamically adds a new prof to the form
  addProfToCourse(){
    this.prof_list.push(this.formBuilder.group({
      id: ['', Validators.required]
    }));
  }
  
  // dynamically deletes specified prof from the form
  // also removes the prof from the radio button options
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

  // turns form data into a Course object
  translateDataToCourse() : Course{
    let data = this.newForm.value;
    let schedule_id = this.schedule_id; // TODO port courses to schedule and pass over schedule details
    let course_no = data.courseDetail;
    let course_name = this.queryCourse(course_no, "course_name");
    let pillar = this.queryCourse(course_no, "pillar");
    let term = this.queryCourse(course_no, "term");
    let core = Number(data.core);
    let no_classes = Number(data.no_classes);
    let class_size = Number(data.class_size);
    let no_sessions = data.sessions.length;
    let sessions_hrs : string = this.sessionsParser(data.sessions, "sessions_hrs");
    let class_types : string = this.sessionsParser(data.sessions, "class_types");
    let venue_types : string = this.sessionsParser(data.sessions, "venue_types");
    let split = this.splitGenerator(no_sessions);
    let instructors : string;
    let instructor_ids : string;
    if(data.courseDetail==='01.400'){
      let instructorsInfo = this.capstoneProf_listParser();
      instructor_ids = instructorsInfo[0];
      instructors = instructorsInfo[1];
    }else{
      this.prof_listParser();  
      instructors = this.tempInstructors;
      instructor_ids = this.tempInstructor_ids;
    }
    let course: Course = new Course(
      schedule_id,term,course_no,course_name,pillar,core,no_classes,
      class_size,no_sessions,sessions_hrs,class_types,venue_types,instructors,instructor_ids,split); 
    console.log(course);
    return course;
  }
  
  // calls http PUSH method to add course into database
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
          this.newForm.reset();
          this.profsInvolved = new Array; 
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
  
  // helper function for generating range, used as a form option 
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

  // helper function for extracting the value of key 'param' from the courseDetails database
  // used for translating form data into Course object
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

  // calls http GET to get all instructors, used as a form option
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

  // helper function for extracting the name of prof with the specified id
  // used as a form option
  // also used for translating form data into Course object
  queryInstructors(profId:number){
    for(let i=0; i<this.instructors.length; i++){
      if (this.instructors[i].id==profId){
        return this.instructors[i].name;
      }
    }
    let error = new Error("instructor to be queried not found");
    error.name = 'NoInstructorForQueryException';
    throw error;  
  }

  // helper function to display form options for radio buttons
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

  // translates form data into format eg 51|55|51,55
  // sessions delimited by pipe
  // profs within session delimited by commas
  // used for translating form data into Course object
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

  // returns id and name of professors added to teach capstone course
  // used for translating form data into Course object
  capstoneProf_listParser(){
    let idarray : string[] = [];
    let nameArray : string[] = [];
    let finalArray : string[] = [];
    for (let prof of this.prof_list.controls){
      idarray.push(prof.value.id);
      nameArray.push(this.queryInstructors(prof.value.id));
    } 
    finalArray[0] = idarray.join(",");
    finalArray[1] = nameArray.join(",");
    return finalArray
  }

  // returns array of 'param', each session delimited by a comma
  // used for translating form data into Course object
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

  // hides fields that are not relevant to capstone
  checkCapstone($event){ 
    if($event.target.value === '01.400'){
      this.showCosNotCapstone = false;  
    }else{
      this.showCosNotCapstone = true;
    }
  }

  // used for translating form data into Course object
  splitGenerator(num: number){
    let arr = new Array;
    for(let i=0; i< num; i++){
      arr.push("1");
    }
    return arr.join(",");
  }

  // for testing
  temp(){
    console.log(this.sessionsParser(this.newForm.value.sessions, "venue_types"));
  }

  get diagnostic() { return JSON.stringify(this.profsInvolved); }
  

}
