import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-register2fa',
  templateUrl: './register2fa.component.html',
  styleUrls: ['./register2fa.component.scss'],
})
export class Register2faComponent implements OnInit {
  @Input() email: string = '';
  @Input() qr: string = '';
  register2faForm: FormGroup = new FormGroup({
    code: new FormControl(null, [Validators.required]),
  });
  constructor(
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _loginService: LoginService
  ) {}
  ngOnInit(): void {
    this.email = String(
      this._activatedRoute.snapshot.queryParamMap.get('email')
    );
    this.qr = String(this._activatedRoute.snapshot.queryParamMap.get('qr'));
  }
  register() {
    if (this.register2faForm.valid) {
      this._loginService
        .register2fa({
          email: this.email,
          code: String(this.register2faForm.controls['code'].value),
        })
        .subscribe(
          (data) => {
            console.log(data);
            this._router.navigateByUrl('/login');
          },
          (error) => {
            alert(error.error.message);
          }
        );
    } else {
      console.log('invalid');
    }
  }
}
