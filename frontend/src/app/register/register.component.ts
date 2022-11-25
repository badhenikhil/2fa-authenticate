import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required]),
  });
  constructor(private _router: Router, private _loginService: LoginService) {}
  ngOnInit() {}
  register() {
    if (this.registerForm.valid) {
      console.log('valid');
      this._loginService.register(this.registerForm.value).subscribe(
        (data) => {
          console.log(data);
          this._router.navigate(['/register2fa'], { queryParams: data });
        },
        (error) => {
          alert(error.error.message);
        }
      );
    } else {
      console.log('invalid');
    }
  }
  login() {
    this._router.navigateByUrl('/login');
  }
}
