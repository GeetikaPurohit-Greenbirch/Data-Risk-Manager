import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from '../../../shared/shared/shared.module';

const HC_3D = require('highcharts/highcharts-3d');
try {
  HC_3D(Highcharts);
} catch (e) {
  console.error('3D Module Failed:', e);
}

@Component({
  selector: 'app-lineage-chart',
  templateUrl: './lineage-chart.component.html',
  styleUrls: ['./lineage-chart.component.scss'],
})
export class LineageChartComponent implements OnInit {
  Highcharts: typeof Highcharts = Highcharts;

  // Chart 0: Line Chart
  chartOptionsLine: Highcharts.Options = {
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
  // Chart 1: Basic Column Chart
  chartOptionsOne: Highcharts.Options = {
    chart: {
      type: 'column',
      // backgroundColor: 'transparent',
      height: '100%',
      style: {
        fontFamily: 'inherit',
      },
    },
    title: {
      text: 'Task Completion Summary',
      style: { color: '#2563eb', fontWeight: '500' },
    },
    xAxis: {
      categories: ['Tasks'],
    },
    yAxis: {
      min: 0,
      title: { text: 'Count' },
      gridLineColor: '#f4f4f4',
    },
    series: [
      { name: 'Completed', type: 'column', data: [5] },
      { name: 'Incomplete', type: 'column', data: [3] },
    ],
    plotOptions: {
      column: {
        borderRadius: 5,
        pointPadding: 0.2,
        groupPadding: 0.1,
      },
    },
    credits: { enabled: false },
  };

  // Chart 2: 3D Column Chart
  threeDChartOptions: Highcharts.Options = {
    chart: {
      type: 'column',
      options3d: {
        enabled: true,
        alpha: 5,
        beta: 15,
        depth: 50,
        viewDistance: 25,
      },
    },
    title: {
      text: 'Car Sales in Norway - May 2024',
    },
    subtitle: {
      text: 'Source: <a href="https://ofv.no/registreringsstatistikk" target="_blank">OFV</a>',
    },
    xAxis: {
      type: 'category',
    },
    yAxis: {
      title: { text: 'Cars Sold' },
    },
    legend: {
      enabled: true,
    },
    tooltip: {
      headerFormat: '<b>{point.key}</b><br>',
      pointFormat: 'Cars sold: {point.y}',
    },
    plotOptions: {
      column: {
        depth: 125,
        pointPadding: 0.3,
      },
    },
    series: [
      { type: 'column', name: 'Toyota', data: [1795], color: '#1f77b4' },
      { type: 'column', name: 'Volkswagen', data: [1242], color: '#ff7f0e' },
      { type: 'column', name: 'Volvo', data: [1074], color: '#2ca02c' },
      { type: 'column', name: 'Tesla', data: [832], color: '#d62728' },
    ],
    credits: { enabled: false },
  };

  // Chart 3: Stock Line Chart
  stockChartOptions: Highcharts.Options = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Stock Price Over Time',
    },
    xAxis: {
      type: 'datetime',
    },
    yAxis: {
      title: {
        text: 'Price (USD)',
      },
    },
    series: [
      {
        type: 'line',
        name: 'Stock Price',
        data: [
          [Date.UTC(2023, 0, 1), 29.9],
          [Date.UTC(2023, 1, 1), 71.5],
          [Date.UTC(2023, 2, 1), 106.4],
          [Date.UTC(2023, 3, 1), 129.2],
          [Date.UTC(2023, 4, 1), 144.0],
        ],
      },
    ],
    credits: { enabled: false },
  };

  ngOnInit(): void {}
  // # Chart Options with buildChart method
  // chartOptions: Highcharts.Options = {};
  // ngOnInit(): void { this.buildChart(); }
  // buildChart(): void {
  //   this.chartOptionsLine = {
  //     chart: { type: 'column' },
  //     title: { text: 'Simplified Data Lineage' },
  //     xAxis: {
  //       categories: [
  //         'A', 'B', 'C',
  //         'Interface 1',
  //         'D', 'E',
  //         'Interface 2',
  //         'System A',
  //         'F', 'G', 'H'
  //       ],
  //       crosshair: true,
  //     },
  //     yAxis: {
  //       min: 0,
  //       title: { text: 'Weight' },
  //     },
  //     tooltip: {
  //       shared: true,
  //       useHTML: true,
  //     },
  //     plotOptions: {
  //       column: {
  //         pointPadding: 0.2,
  //         borderWidth: 0,
  //       },
  //     },
  //     series: [
  //       {
  //         name: 'Lineage',
  //         type: 'column',
  //         data: [1, 1, 1, 3, 1, 1, 2, 5, 2, 2, 1],
  //       },
  //     ],
  //   };
  // }
}
