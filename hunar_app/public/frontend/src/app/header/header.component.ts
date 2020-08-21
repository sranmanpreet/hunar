import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Role } from '../shared/enums/user.roles.enum';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  position = true;
  prevScrollpos = 0;
  Role = Role;
  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    window.addEventListener('scroll', this.scroll, true);
  }

  scroll = (event: any): void => {
    const currentScrollPos = event.srcElement.scrollTop;
    if (this.prevScrollpos > currentScrollPos) {
      this.position = true;
    } else {
      this.position = false;
    }
    this.prevScrollpos = currentScrollPos;
  }

  onLogout() {
    this.authService.logout().subscribe();
    this.router.navigateByUrl('/sign-in');
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scroll, true);
  }

}
