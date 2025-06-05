import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from 'src/app/features/shared/shared/shared.module';

const Sankey = require('highcharts/modules/sankey');
try {
  Sankey(Highcharts);
} catch (e) {
  console.error('Charts Module Failed:', e);
}

@Component({
  selector: 'app-lineage-sankey',
  standalone: true,
  imports: [HighchartsChartModule, SharedModule],
  templateUrl: './lineage-sankey.component.html',
  styleUrl: './lineage-sankey.component.scss',
})
export class LineageSankeyComponent {
  Highcharts: typeof Highcharts = Highcharts;
  SankeyChartOptions: Highcharts.Options = {
    title: { text: 'Simple Sankey Diagram' },
    series: [
      {
        type: 'sankey',
        keys: ['from', 'to', 'weight'],
        data: [
          ['A', 'B', 5],
          ['A', 'C', 3],
          ['B', 'D', 2],
          ['C', 'D', 2],
        ],
        name: 'Sankey flow',
      },
    ],
  };
}
