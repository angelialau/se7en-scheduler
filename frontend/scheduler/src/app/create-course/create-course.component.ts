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
  profsAvailable : User[];
  profsInvolved : string[] = [];
  // checkBoxOptions = this.makeCheckBoxOptions();

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

  // works!!!
  // TODO, check that they are unique and no repeats 
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
    // for(let i=0; i<this.sessions.length; i++){
    //   this.sessions.controls['profs_available'].push(
    //     new FormGroup({
    //       profId: new FormControl('', Validators.required)
    //     })
    //   )
    // }
  }
  deleteProf(index : number){ 
    for(let i=0; i< this.sessions.length; i++){
      // if(this.prof_list[index].id == this.profs_involved[i].profId){
      //   this.prof_list.removeAt(i);
      //   break;
      // }  
    }
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
    // -- uncomment below for split --
    // let split : string = this.sessionsParser(data.sessions, "split");
    let instructors : string = this.prof_listParser(data.prof_list);

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

  refreshProfsAvailable(){
    let array = this.prof_list.value;
    this.profsAvailable = new Array();
    for (let profId of array){
      this.profsAvailable.push(profId);
    }

    // for (let prof of this.prof_list.value){
    //   this.profsAvailable.push(prof.name);
    // } 
  }

  prof_listParser(prof_list: any): string{
    let array : string[] = [];
    for (let profId of prof_list){
      array.push(profId);
    } 
    return array.join();
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
    }else if(param==="split"){
      for (let session of sessions){
        array.push(session.split);
      } 
    }
    return array.join();
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

  updateProfsInvolved(profId: number, sessionIndex : number){
    if(this.updateProfsInvolved[sessionIndex].includes(profId)){
      let index = this.updateProfsInvolved[sessionIndex].indexOf(profId);
      this.updateProfsInvolved[sessionIndex].splice(index);
    }else{
      this.updateProfsInvolved[sessionIndex].push(profId);
    }
  }

  get diagnostic() { return JSON.stringify(this.profsInvolved); }
  

}
