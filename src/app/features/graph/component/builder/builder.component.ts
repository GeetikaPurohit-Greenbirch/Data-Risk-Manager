import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NodesComponent } from "../nodes/nodes.component";
import { DiagramComponent } from "../diagram/diagram.component";

@Component({
  selector: 'app-builder',
  standalone: true,
  imports: [NodesComponent, DiagramComponent],
  templateUrl: './builder.component.html',
  styleUrl: './builder.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuilderComponent {

}
