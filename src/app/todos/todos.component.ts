import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { generateClient, type Client } from 'aws-amplify/api';
import { Todo, ListTodosQuery } from '../../API';
import * as mutations from '../../graphql/mutations';
import * as queries from '../../graphql/queries';
import * as subscriptions from '../../graphql/subscriptions';

@Component({
  selector: 'app-todos',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css'
})
export class TodosComponent implements OnInit, OnDestroy {
  public todos: ListTodosQuery['listTodos'];
  public createForm: FormGroup;
  public client: Client;

  private subscription: any = null;

  constructor(private fb: FormBuilder) {
    this.createForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required]
    });

    // @ts-ignore
    this.client = generateClient();
  }

  async ngOnInit() {
    /* fetch todos when app loads */
    try {
      const response = await this.client.graphql({
        query: queries.listTodos
      });
      this.todos = response.data.listTodos;
    } catch (e) {
      console.log('error fetching todos', e);
    }

    this.subscription = this.client
      .graphql({
        query: subscriptions.onCreateTodo
      })
      .subscribe({
        next: (event: any) => {
          const newTodo: Todo = event.data.onCreateTodo;
          if (this.todos) {
            this.todos.items = [newTodo, ...this.todos.items];
          }
        }
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.subscription = null;
  }

  public async onCreate(todo: Todo) {
    try {
      const response = await this.client.graphql({
        query: mutations.createTodo,
        variables: {
          input: todo
        }
      });
      console.log('item created!', response);
      this.createForm.reset();
    } catch (e) {
      console.log('error creating todo...', e);
    }
  }
}
