import { Component } from '@angular/core';
import { Ornement } from "../../shared/ornement/ornement";
import { RouterLink } from '@angular/router';

@Component({
  imports: [Ornement,RouterLink],
  selector: 'app-a-propos',
  styleUrl: './a-propos.css',
  templateUrl: './a-propos.html',
})
export class APropos {}
