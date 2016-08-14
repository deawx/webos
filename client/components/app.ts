import {Component} from '@angular/core';

@Component({
  selector   : 'app',
  template: `
    <main>
        <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
}