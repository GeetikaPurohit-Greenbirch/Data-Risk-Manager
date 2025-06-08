import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-lineage-treegraph',
  templateUrl: './lineage-treegraph.component.html',
  styleUrl: './lineage-treegraph.component.scss',
})

export class LineageTreegraphComponent implements OnInit {
    Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.chartOptions = {
      chart: { type: 'treegraph' },
      title: { text: 'شجرة النسب' },
      series: [{
        type: 'treegraph',
        keys: ['id', 'parent', 'name'],
        data: [
          ['A', '', 'الجد الأعلى'],
          ['B', 'A', 'الابن الأول'],
          ['C', 'A', 'الابن الثاني'],
          ['D', 'B', 'الحفيد الأول'],
          ['E', 'C', 'الحفيد الثاني']
        ],
        dataLabels: {
          // formatter() { return this.point.name; } // i commented this line to avoid error
        }
      }]
    };
  }
}
