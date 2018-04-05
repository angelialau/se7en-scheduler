import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { Appeal } from './../../models/appeal.model';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-view-appeal',
  templateUrl: './view-appeal.component.html',
  styleUrls: ['./view-appeal.component.css']
})
export class ViewAppealComponent implements OnInit {
	appeals : Appeal[] = [];
	columns: string[];
  showhiden: boolean = true;

  constructor(
  	private userService: UserService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  	this.columns = this.userService.getAppealColumns();
    this.refreshAppeals();
  }

  refreshAppeals(){
    this.userService.getAppeals()
    .map((data: any) => {
      /*data.body.sort(function(a,b){
        return a.getTime() - b.getTime();
      });*/

      for (let entry of data.body){
        var tempdate = new Date(entry.date);
        entry.date = tempdate.getDate() + '/' + tempdate.getMonth() + '/' + tempdate.getFullYear();
      }

      this.appeals = data.body;
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