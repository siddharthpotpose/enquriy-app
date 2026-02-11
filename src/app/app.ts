import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from "./components/header/header";
import { Footer } from "./components/footer/footer";
import { Alert } from "./share/alert/alert";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Alert],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('enquiry-app');

}
