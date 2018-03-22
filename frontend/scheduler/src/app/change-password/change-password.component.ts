import { Component, OnInit } from '@angular/core';
import { UserService } from './../services/user.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {
  private oldPassword : string;
  private newPassword : string;
  private confirmPassword : string;

  constructor(
    private userService : UserService,
    public snackBar : MatSnackBar,
    ) { }

  ngOnInit() {
  }

  changePassword(oldPassword : string, newPassword : string, confirmPassword: string){
    if(newPassword===confirmPassword){
      let response : boolean = this.userService.changePassword(oldPassword, newPassword);
      if(response){ // .success
        this.snackBar.open("Successfully changed password!", null, {duration: 1000});
      }else{
        // not the correct password
        this.snackBar.open("Incorrect old password, please try again.", null, {duration: 3000});
      }  
    }else{
      this.snackBar.open("Your new passwords do not match, please try again.", null, {duration: 3000});
    }
  }
}
