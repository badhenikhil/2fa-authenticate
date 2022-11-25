import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  users: any = [];
  currentUser: any = null;
  heroes: Hero[] = [];
  ngOnInit(): void {
    //this.getHeroes();
    this.getUsers();
  }
  constructor(
    private heroService: HeroService,
    private loginService: LoginService,
    private _router: Router
  ) {
    this.loginService.getUsers().subscribe(
      (user) => {
        this.currentUser = user;
      },
      (error) => this._router.navigateByUrl('login')
    );
  }
  getHeroes() {
    this.heroService
      .getHeroes()
      .subscribe((heroes) => (this.heroes = heroes.slice(1, 5)));
  }
  getUsers() {
    this.loginService.getUsers().subscribe((users) => (this.users = users));
  }
  logout() {
    localStorage.removeItem('token');
    this._router.navigateByUrl('login');
  }
}
