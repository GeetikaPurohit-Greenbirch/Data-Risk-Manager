import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from 'src/app/features/shared/shared/shared.module';

@Component({
  selector: 'app-lineages-tree',
  standalone: true,
  templateUrl: './lineages-tree.component.html',
  styleUrls: ['./lineages-tree.component.scss'],
  imports: [HighchartsChartModule, SharedModule],
})

export class LineagesTreeComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  ngOnInit(): void {
    this.buildChart();
  }

  buildChart(): void {
    this.chartOptions = {
      chart: { type: 'column' },
      title: { text: 'Simplified Data Lineage' },
      xAxis: {
        categories: [
          'A',
          'B',
          'C',
          'Interface 1',
          'D',
          'E',
          'Interface 2',
          'System A',
          'F',
          'G',
          'H',
        ],
        crosshair: true,
      },
      yAxis: {
        min: 0,
        title: { text: 'Weight' },
      },
      tooltip: {
        shared: true,
        useHTML: true,
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0,
        },
      },
      series: [
        {
          name: 'Lineage',
          type: 'column',
          data: [1, 1, 1, 3, 1, 1, 2, 5, 2, 2, 1],
        },
      ],
    };
  }
}
