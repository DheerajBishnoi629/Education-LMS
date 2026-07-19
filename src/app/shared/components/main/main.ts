import { Component } from '@angular/core';
import { Navbar } from '../navbar/navbar';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import {SelectModule} from 'primeng/select';
@Component({
  selector: 'app-main',
  imports: [Navbar, ButtonModule, CardModule, AvatarModule, AvatarGroupModule, SelectModule],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {}
