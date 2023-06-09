import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth-user',
  templateUrl: './auth-user.component.html',
  styleUrls: ['./auth-user.component.css']
})
export class AuthUserComponent implements OnInit {
  user: User = {
    userid: '',
    password: ''
  }

  constructor(
    private userService: UserService,
    private router: Router) { }

  ngOnInit(): void {
  }

  signupUser(): void {
    const data = {
      userid: this.user.userid,
      password: this.user.password
    };

    this.userService.signup(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          // this.submitted = true;
        },
        error: (e) => console.error(e)
      });
  }

  signinUser(): void {
    const data = {
      userid: this.user.userid,
      password: this.user.password
    };
    this.userService.signin(data)
      .subscribe({
        next: (res) => {
          console.log(res);
          // this.submitted = true;
          if (res.status == "2")
            this.router.navigate(['/actkeys']);
            
        },
        error: (e) => console.error(e)
      });
  }
}
