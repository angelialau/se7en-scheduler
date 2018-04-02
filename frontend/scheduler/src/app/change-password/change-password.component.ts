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
    let errorMsg : string = "Something went wrong with changing your password," + 
    " please try again later!";
    if(newPassword===confirmPassword){
      this.userService.changePassword(oldPassword, newPassword)
      .subscribe(
        response => {
          if(JSON.parse(response).success){
            this.snackBar.open("Password changed!", null, {duration: 1000});
          }else{
            this.snackBar.open(errorMsg, null, {duration: 1000});
            console.log(response);
          }
        }, error => {
          this.snackBar.open(errorMsg, null, {duration: 1000});
          console.log(error);
        }
        )
    }else{
      this.snackBar.open("The new passwords do not match, please try again.", null, {duration: 3000});
    }
  }
}
