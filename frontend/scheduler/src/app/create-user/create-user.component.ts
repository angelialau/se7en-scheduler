import { Component, OnInit } from '@angular/core';
import { User } from './../../models/user.model';
import { MatSnackBar } from '@angular/material';
import { UserService } from './../services/user.service';
import { CookieService } from 'ng2-cookies';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
  modelNewUser = new User(null,null);
  isAdmin : boolean = false;

  constructor(
    public snackBar: MatSnackBar, 
    private userService: UserService,
    private cookieService: CookieService,
    private router : Router,
     ) {
  }

  ngOnInit() {
    if(this.cookieService.get('pillar')==='Administrator'){
      this.isAdmin = true;
    }else{
      this.router.navigateByUrl('/home');
    }
  }

  createUser(name: string){
    let msg : string = "User account created for " + this.modelNewUser.name + "!";
    let errorMessage: string = "There seems to have been a problem with creating a user, please try again later!";
    this.userService.postNewUser(this.modelNewUser)
    .subscribe(
      response => {
        if(JSON.parse(response).success){
          this.snackBar.open(msg, null, { duration: 1000, });  
        }else{
          this.snackBar.open(errorMessage, null, { duration: 1000, });  
          console.log("Error in postNewUser via CreateUserComponent");
          console.log(response);
        }
      },
      error => {
        console.log("Error in postNewUser via CreateUserComponent");
        console.log(error);
        this.snackBar.open(errorMessage, null, { duration: 1000, });
      }
    );
  }

  get diagnostic() { return JSON.stringify(this.modelNewUser)};
}
