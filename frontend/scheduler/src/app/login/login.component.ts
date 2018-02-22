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
  temp: User;
  model: any = {};
  submitted: boolean = false;
  returnURL: string;

  constructor(
    private userService: UserService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router
    ) {}

  ngOnInit() {
    this.user = new User();
    this.returnURL = this.route.snapshot.queryParams['']
  }

  onSubmit(){
    this.submitted = true;
  }

  login(){
    this.temp = JSON.parse(localStorage.getItem("currentUser"));
    if (this.temp != null){
      this.snackBar.open("Plese login again", null, {duration:500,})
    }
    else{
      this.userService.postUserLogin(this.model.employee_id, this.model.password)
      .map((data:any) => data)
      .subscribe(userData => {
        if (userData.success){
           this.user.employee_id = userData.employee_id;
           this.user.email = userData.email;
           this.user.name = userData.name;
           this.user.id = userData.id;
           this.user.phone = userData.phone;
           localStorage.setItem("currentUser", JSON.stringify(this.user));
           this.snackBar.open("Your have login", null, { duration: 1000, })

           this.router.navigateByUrl('/home');
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

