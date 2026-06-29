import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-main',
  imports: [Navbar],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
