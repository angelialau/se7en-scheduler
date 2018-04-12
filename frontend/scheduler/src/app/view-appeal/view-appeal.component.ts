import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { Appeal } from './../../models/appeal.model';
import { MatSnackBar } from '@angular/material';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-appeal',
  templateUrl: './view-appeal.component.html',
  styleUrls: ['./view-appeal.component.css']
})
export class ViewAppealComponent implements OnInit {
	isAdmin : boolean = false;
  appeals : Appeal[] = [];
	columns: string[];
  showhiden: boolean = true;

  constructor(
  	private userService: UserService,
    private snackBar: MatSnackBar, 
    private cookieService: CookieService,
    private router : Router,
    ) { 
  }

  ngOnInit() {
    if(this.cookieService.get('pillar') === "Administrator"){
      this.isAdmin = true;  
      this.columns = this.userService.getAppealColumns();
      this.refreshAppeals();
    }else{
      this.router.navigateByUrl('/home');
    }
  }

  refreshAppeals(){
    this.userService.getAppeals()
    .map((data: any) => {
      data.body.sort(function(a,b){
        return a.date > b.date;
      });

      for (let entry of data.body){
        var tempdate = new Date(entry.date);
        entry.date = tempdate.getDate() + '/' + tempdate.getMonth() + '/' + tempdate.getFullYear();
      }

      this.appeals = data.body;

      console.log(this.appeals);
      console.log(typeof this.appeals);
    } )
    .subscribe(
      response => {
      }, 
      error => {
        console.log("Server error getting appeals");
        console.log(error)
      }
    )
  }

   deleteAppeal(id: number){
    let errorMsg = "Something went wrong with deleting appeal, please try again later.";
    this.userService.deleteAppeal(id).subscribe(
      response => {
        if(JSON.parse(response).success){
          this.snackBar.open("Appeal deleted!", null, {duration: 3000});
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

  showContent(id: number){ //deal with this again
     //document.getElementById(String(id)).innerHTML= "";
  }
}