import { Component } from '@angular/core';
import { SharedModule } from "../../../shared/shared/shared.module";

@Component({
  selector: 'app-lineage-sankey',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './lineage-sankey.component.html',
  styleUrl: './lineage-sankey.component.scss'
})
export class LineageSankeyComponent {

}
