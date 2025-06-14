import { Component } from '@angular/core';
import {ProjectionModel} from "../../model/projection/projection.model";
import {ModelMovie} from "../../model/model.movie";
import {MatCard, MatCardContent, MatCardHeader} from "@angular/material/card";
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from "@angular/material/divider";

@Component({
  selector: 'app-about',
  imports: [
    MatCard,
    MatCardHeader,
    MatCardContent,
    MatIcon,
    MatDivider
  ],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  public projections: ProjectionModel[] = []
  public movies: ModelMovie[] | null = null
  public error: string | null = null

  team: any = [
    {
      name: 'Elena Petrović',
      role: 'Founder & General Manager',
      imageUrl: 'https://i.pravatar.cc/150?u=elena'
    },
    {
      name: 'Marko Jovanović',
      role: 'Head of Programming',
      imageUrl: 'https://i.pravatar.cc/150?u=marko'
    },
    {
      name: 'Ana Kovačević',
      role: 'Customer Experience Lead',
      imageUrl: 'https://i.pravatar.cc/150?u=ana'
    }
  ];
  constructor() {

  }
}
