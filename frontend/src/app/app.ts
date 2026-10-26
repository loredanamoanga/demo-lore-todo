import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

/** The app shell from DESIGN.md: navigation rail, page header band, one card on the canvas. */
@Component({
  imports: [MatSidenavModule, MatCardModule, MatButtonModule],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {
  protected readonly pageTitle = 'Team todo';
  protected readonly pageSubtitle = 'One shared list for the team';
  protected readonly navEntry = 'Todo';
}
