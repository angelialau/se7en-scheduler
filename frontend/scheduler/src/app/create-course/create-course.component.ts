import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { User } from './../../models/user.model';
import { Course, Session, CourseDetail, courseDetails, class_type, 
  durations } from './../../models/course.model';
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
  courseDetails = courseDetails; 
  instructors : User[]= []; 
  class_type = class_type; 
  durations = durations;
  newForm: FormGroup;
  no_classesRange = this.createRange(12);
  class_sizeRange = this.createRange(60);
  profsInvolved : Array<any> = []; // stores selection before passing into final form

  constructor(
    private formBuilder : FormBuilder,
    private snackBar : MatSnackBar,
    private scheduleService : ScheduleService,
    private userService: UserService,
    private route: ActivatedRoute
     ) {
    this.schedule_id = route.snapshot.params['schedule_id'];
    this.createForm();
    this.getInstructors();
  }

  ngOnInit() {
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
          sessions_hrs: new FormControl('', Validators.required),
          profs_involved: new FormArray([
            new FormGroup({
              profId: new FormControl('', Validators.required)
            })
          ])
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
    console.log("sessions:", this.sessions);
    this.sessions.push(
      new FormGroup({
        class_types: new FormControl('', Validators.required),
        sessions_hrs: new FormControl('', Validators.required),
        profs_involved: new FormArray([
          new FormGroup({
            profId: new FormControl('', Validators.required)
          })
        ]),
      })
    );
  }

  addProfToSession(sessionId:number){ 
    console.log("addProfToSession sessions:",this.sessions);
    console.log("addProfToSession sessionId:",sessionId);
    let session= this.newForm.get('sessions.'+sessionId+'.profs_involved');
    (<FormArray>session).push(
      new FormGroup({
        profId: new FormControl('', Validators.required)
      })
    );
  }

  addProfToCourse(){
    this.prof_list.push(this.formBuilder.group({
      id: ['', Validators.required]
    }));
  }
  deleteProf(index : number){ 
    this.prof_list.removeAt(index); 
  }
  deleteSession(index : number){ this.sessions.removeAt(index); }

  pushToInstructorsArray(prof_name: string, index: number){
    const instructorListFormArray = <FormArray> this.newForm.get(['sessions', index, 'selectedInstructors']);
    instructorListFormArray.push(this.formBuilder.group({
      instructor_name: ''
    }));
    console.log(instructorListFormArray.value);
  }

  //for editting courses
  setSessions(sessions: Session[]){
    const sessionFormGroups = sessions.map(session => this.formBuilder.group(session));
    const sessionFormArray = this.formBuilder.array(sessionFormGroups);
    this.newForm.setControl('sessions', sessionFormArray);
  }
  setProfs(prof_list: String[]){
    const profsFormGroups = prof_list.map(prof_list => this.formBuilder.group(prof_list));
    const profsFormArray = this.formBuilder.array(profsFormGroups);
    this.newForm.setControl('prof_list', profsFormArray);
  }  

  // http methods
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
    let split = null;
    let instructors : string = this.prof_listParser();

    let course: Course = new Course(
      schedule_id,term,course_no,course_name,core,no_classes,
      class_size,no_sessions,sessions_hrs,class_types,instructors,split); 
    console.log(course);
    return course;
  }
  
  onSend(){ 
    let msg : string = "Submitted new course!"
    this.scheduleService.addCourse(this.translateDataToCourse())
    .subscribe(
      response => {
        let success = JSON.parse(response).success;
        // console.log(JSON.parse(response));
        if(success){
          console.log("Successfully created new course!");
          this.snackBar.open(msg, null, { duration: 800, });  
          // to update list of courses in schedule details
          this.addedCourse.emit(null);
        }else{
          console.log("Error in addCourse via CreateCourseComponent");
          // console.log();
          this.snackBar.open("Hhm, something went wrong. Really sorry but please try again later!", null, { duration: 1000, });
        }
      },
      error => {
        console.log("Error in addCourse via CreateCourseComponent");
        console.log(error);
        this.snackBar.open("Hhm, something went wrong. Really sorry but please try again!", null, { duration: 800, });
      }
    );
  }
  // helper functions
  createRange(n : number) : number[]{
    let x=[];
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
      }
    }
  }
  
  showCheckBox(): boolean{
    if(this.prof_list.value) { return true; }
    return false;
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
    }
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
  }
  // translates into format eg 51|55|51,55
  // sessions delimited by pipe
  // profs within session delimited by commas
  prof_listParser(): string{
    let array : string[] = [];
    for (let session of this.profsInvolved){
      let subarray: string[] = [];
      for(let prof of session){
        subarray.push(prof);
      }
      array.push(subarray.join(","));
    } 
    return array.join("|");
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
    }
    return array.join();
  }

  get diagnostic() { return JSON.stringify(this.profsInvolved); }
  

}
