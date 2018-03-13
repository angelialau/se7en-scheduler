import { Component, OnInit } from '@angular/core';
import { User } from './../../models/user.model';
import { NewUser } from './../../models/newuser.model';
import { MatDialogRef,MatSnackBar } from '@angular/material';
import { UserService } from './../services/user.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  user: NewUser;
  temp: User = new User(null,null);
  model: User = new User(null,null);
  returnURL: string;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
    this.user = new NewUser(null,null,null,null,null,null);
  }

  login(){
    this.temp = JSON.parse(localStorage.getItem("currentUser"));
    if (this.temp.email != null){
      console.log(this.temp);
      this.snackBar.open("Login invalid", null, {duration:500,})
    }
    else{
      this.userService.postLogin(this.model.email, this.model.password)
      .subscribe(userData => {
        if (userData){
          userData = JSON.parse(userData); // need to map userData to NewUser model
           this.user.id = userData.id;
           this.user.admin = userData.admin;
           this.user.email = userData.email;
           this.user.name = userData.name;
           this.user.phone = userData.phone;
           localStorage.setItem("currentUser", JSON.stringify(this.user));
           this.snackBar.open("Your have logged in", null, { duration: 1000, });
           this.router.navigateByUrl('/home');
           console.log("currentUser:");
           console.log(localStorage.getItem("currentUser"));
        }
        else{
          this.user = null;
          this.snackBar.open("Please enter a valid password/username", null, { duration: 500, })
        }
      },
      error => {console.log("show error: "+ error),this.snackBar.open("Try clearing your cookies......", null, { duration: 500, })},
      () => console.log(this.user),
      );
    }
  }

}

