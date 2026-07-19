import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-main',
  imports: [Navbar, RouterOutlet],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
