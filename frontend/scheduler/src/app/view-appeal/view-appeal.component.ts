import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { Appeal } from './../../models/appeal.model';
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';
import { appealReply } from './../../models/appealReply.model';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-view-appeal',
  templateUrl: './view-appeal.component.html',
  styleUrls: ['./view-appeal.component.css']
})
export class ViewAppealComponent implements OnInit {
	isAdmin : boolean = false;
  appeals : Appeal[] = [];
	columns: string[];
  today: string = this.transformDate(Date.now()).toString();
  newReply: appealReply = new appealReply(this.today);

  constructor(
  	private userService: UserService,
    private snackBar: MatSnackBar, 
    private cookieService: CookieService,
    private router : Router,
    private datePipe: DatePipe,
    ) { 
  }

  ngOnInit() {
    if(this.cookieService.get('pillar') === "Administrator"){
      this.isAdmin = true;  
      this.refreshAppeals();
    }else{
      this.router.navigateByUrl('/home');
    }
  }

  refreshAppeals(){
    this.userService.getAppeals()
    .map((data: any) => {
      if (data.body.success != false){
      data.body.sort(function(a,b){ 
        return a.date < b.date;
      });
    

      for (let entry of data.body){
        var tempdate = new Date(entry.date);
        entry.date = tempdate.getDate() + '/' + (tempdate.getMonth()+1) + '/' + tempdate.getFullYear();
      }

      this.appeals = data.body;
    }
    } )
    .subscribe(
      response => {
      }, 
      error => {
        console.log("Server error getting appeals");
        console.log(error);
      }
    )
  }

  transformDate(date) {
    return this.datePipe.transform(date, 'yyyy-MM-dd'); //whatever format you need. 
  }

  deleteAppeal(id:number){
    let errorMsg = "Something went wrong with deleting appeal, please try again later.";
    this.userService.deleteAppeal(id).subscribe(
      response => {
        if(JSON.parse(response).success){
          console.log("Appeal deleted");
          this.refreshAppeals();
        }else{
          this.snackBar.open(errorMsg, null, {duration: 3000});
          console.log(response);
        }
      }, 
      error => {
        this.snackBar.open(errorMsg, null, {duration: 3000});
        console.log("Server error deleting appeals");
        console.log(error);
      }
    )
  }

  editAppeal(appeal: Appeal, integer: number){
    let errorMsg : string = "Something went wrong with making appeal reply, please try again later!";
    let approveMsg: string = "We refer to your appeal and we are pleased to inform you that your appeal is successful. Please refer to the new calendar for more information.";
    let disapproveMsg: string = "We refer to your appeal and we regret to inform you that your appeal has failed. Please try making an appeal with a different preferred time slot again.";
    this.deleteAppeal(appeal.id);
    // console.log(appeal.id);
    this.newReply.title = "RE: Appeal for " + appeal.title;
    // console.log(appeal);
    if (integer == 0){
      this.newReply.content = disapproveMsg;
    }
    if (integer == 1){
      this.newReply.content = approveMsg;
    }
    this.newReply.instructor = appeal.instructor;
    this.newReply.instructorid = appeal.instructorId;
    this.newReply.scheduleId = appeal.scheduleId;
    this.userService.makeReplies(this.newReply,this.cookieService.get('name'), this.cookieService.get('id')).subscribe(
      response =>{
        if (JSON.parse(response).success){
          if(integer == 0){
            this.snackBar.open("Rejected the appeal!", null, {duration:1200});    
          }else if(integer == 1){
            this.snackBar.open("Accepted the appeal!", null, {duration:1200});    
          }        
        this.refreshAppeals();
        this.newReply = new appealReply(this.today);
      }
      else{
        this.snackBar.open(errorMsg,null,{duration:1000});
      }
      }, 
      error => {
       this.snackBar.open(errorMsg, null, {duration:1000});
       console.log("sever error in making reply");
     }
      )
  }
}