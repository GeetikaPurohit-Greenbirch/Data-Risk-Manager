import { Component, OnInit } from '@angular/core';
import { SharedModule } from "../../../shared/shared/shared.module";
import * as Highcharts from 'highcharts';
import Treegraph from 'highcharts/modules/treegraph';

// Treegraph(Highcharts);

@Component({
  selector: 'app-lineage-treegraph',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './lineage-treegraph.component.html',
  styleUrl: './lineage-treegraph.component.scss'
})

export class LineageTreegraphComponent implements OnInit {
  ngOnInit(): void {}
  Highcharts: typeof Highcharts = Highcharts;
// TreegraphChartOptions: Highcharts.Options = {
//     title: { text: 'My Treegraph' },
//     series: [
//       {
//         type: 'treegraph',
//         data: [
//           { id: 'Root' },
//           { id: 'Child1', parent: 'Root' },
//           { id: 'Child2', parent: 'Root' },
//           { id: 'Grandchild1', parent: 'Child1' },
//         ],
//         dataLabels: {
//           style: {
//             fontSize: '13px',
//           },
//         },
//         marker: {
//           radius: 8,
//         },
//       },
//     ],
//   };
}
