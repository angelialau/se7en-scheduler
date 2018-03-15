import { Component, OnInit } from '@angular/core';
import { User } from './../../models/user.model';
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
  user: User;
  model: User = new User(null,null);
  returnURL: string;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
    this.user = new User(null,null,null,null,null,null);
  }

  login(){
    this.userService.postLogin(this.model.email, this.model.password)
      .subscribe(userData => {
        if (userData){
          userData = JSON.parse(userData); // need to map userData to User model
          this.user.id = userData.id;
          this.user.pillar = userData.pillar;
          this.user.email = userData.email;
          this.user.name = userData.name;
          this.user.phone = userData.phone;
          localStorage.setItem("currentUser", JSON.stringify(this.user));
          this.snackBar.open("Your have logged in", null, { duration: 1000, });
          this.router.navigateByUrl('/home');
        }
        else{
          this.user = null;
          this.snackBar.open("Please enter a valid password/username", null, { duration: 500, })
        }
      },
      error => {console.log("show error: "+ error),this.snackBar.open("Try clearing your cookies......", null, { duration: 500, })},
      );
  }

}

