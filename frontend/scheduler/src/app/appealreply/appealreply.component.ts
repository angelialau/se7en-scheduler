import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { MatSnackBar } from '@angular/material';
import { appealReply } from './../../models/appealReply.model';

@Component({
  selector: 'app-appealreply',
  templateUrl: './appealreply.component.html',
  styleUrls: ['./appealreply.component.css']
})
export class AppealreplyComponent implements OnInit {
	isAdmin : boolean = false;
	instructorid: any;
	replies: appealReply[] = [];

  constructor(
  	private cookieService: CookieService,
  	private router : Router,
  	private userService: UserService,
    private snackBar: MatSnackBar, ) { }

  ngOnInit() {
  	this.instructorid = this.cookieService.get('id');
  	if(this.cookieService.get('pillar') === "Administrator"){
      this.isAdmin = true;  
      this.router.navigateByUrl('/home');
    }else{
   	  this.refreshReplies();
    }
  }

  refreshReplies(){
  	 this.userService.getReplies(this.instructorid)
    .map((data: any) => {
      if (data.body.success != false){
      data.body.sort(function(a,b){ 
        return a.date < b.date;
      });
    
      for (let entry of data.body){
        var tempdate = new Date(entry.date);
        entry.date = tempdate.getDate() + '/' + (tempdate.getMonth()+1) + '/' + tempdate.getFullYear();
      }

      this.replies = data.body;
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

  deleteReply(id: number){
  	let errorMsg = "Something went wrong with deleting this reply, please try again later.";
    this.userService.deleteReply(id).subscribe(
      response => {
        if(JSON.parse(response).success){
          console.log("Reply deleted");
          this.refreshReplies();
        }else{
          this.snackBar.open(errorMsg, null, {duration: 3000});
          console.log(response);
        }
      }, 
      error => {
        this.snackBar.open(errorMsg, null, {duration: 3000});
        console.log("Server error deleting reply");
        console.log(error);
      }
    )
  }

}
