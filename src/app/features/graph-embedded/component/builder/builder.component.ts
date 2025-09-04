import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-builder',
  templateUrl: './builder.component.html',
  styleUrls: ['./builder.component.scss']
})
export class BuilderComponent implements OnInit {

  constructor() {}

   nodesCollapsed = false;

  toggleNodes(): void {
    this.nodesCollapsed = !this.nodesCollapsed;
    // If your JointJS paper needs a resize after layout changes,
    // call your diagram component's `onResize()` here (via ViewChild) after a tick.
    // Example:
    // setTimeout(() => this.diagramRef?.onResize?.(), 0);
  }

  ngOnInit(): void {
    // Any initialization logic
  }
}
