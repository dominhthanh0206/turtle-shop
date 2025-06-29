import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from './store';
import { checkAuthStatus } from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'TurtleShop';

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(checkAuthStatus());
  }
}
