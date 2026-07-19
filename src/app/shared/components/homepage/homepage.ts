import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import {SelectModule} from 'primeng/select';

@Component({
  selector: 'app-homepage',
  imports: [ButtonModule, CardModule, AvatarModule, AvatarGroupModule, SelectModule],
  templateUrl: './homepage.html',
  styleUrl: './homepage.scss',
})
export class Homepage {}
