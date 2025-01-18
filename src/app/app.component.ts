import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TodosComponent} from './todos/todos.component';

@Component({
  selector: 'app-root',
  imports: [TodosComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'untitled1';
}
