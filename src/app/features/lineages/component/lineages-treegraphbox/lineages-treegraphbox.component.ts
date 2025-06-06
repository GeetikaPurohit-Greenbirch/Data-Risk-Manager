import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from 'src/app/features/shared/shared/shared.module';
import Treegraph from 'highcharts/modules/treegraph';

// Treegraph(Highcharts);

@Component({
  selector: 'app-lineages-treegraphbox',
  standalone: true,
  imports: [HighchartsChartModule, SharedModule],
  templateUrl: './lineages-treegraphbox.component.html',
  styleUrl: './lineages-treegraphbox.component.scss',
})
export class LineagesTreegraphboxComponent {
  Highcharts: typeof Highcharts = Highcharts;

  TreegraphboxChartOptions: Highcharts.Options = {
    chart: {
      height: 600
    },
    title: {
      text: 'Treegraph with box layout'
    },
    tooltip: {
      pointFormat: '{point.name}'
    },
    series: [
      {
        type: 'treegraph',
        data: [
          { id: '0.0', parent: '', name: 'The World' },
          { id: '1.3', parent: '0.0', name: 'Asia' },
          { id: '1.1', parent: '0.0', name: 'Africa' },
          { id: '1.2', parent: '0.0', name: 'America' },
          { id: '1.4', parent: '0.0', name: 'Europe' },
          { id: '1.5', parent: '0.0', name: 'Oceanic' },
          { id: '2.1', parent: '1.1', name: 'Eastern Africa' },
          { id: '2.5', parent: '1.1', name: 'Western Africa' },
          { id: '2.3', parent: '1.1', name: 'North Africa' },
          { id: '2.2', parent: '1.1', name: 'Central Africa' },
          { id: '2.4', parent: '1.1', name: 'South America' },
          { id: '2.9', parent: '1.2', name: 'South America' },
          { id: '2.8', parent: '1.2', name: 'Northern America' },
          { id: '2.7', parent: '1.2', name: 'Central America' },
          { id: '2.6', parent: '1.2', name: 'Caribbean' },
          { id: '2.13', parent: '1.3', name: 'Southern Asia' },
          { id: '2.11', parent: '1.3', name: 'Eastern Asia' },
          { id: '2.12', parent: '1.3', name: 'South-Eastern Asia' },
          { id: '2.14', parent: '1.3', name: 'Western Asia' },
          { id: '2.10', parent: '1.3', name: 'Central Asia' },
          { id: '2.15', parent: '1.4', name: 'Eastern Europe' },
          { id: '2.16', parent: '1.4', name: 'Northern Europe' },
          { id: '2.17', parent: '1.4', name: 'Southern Europe' },
          { id: '2.18', parent: '1.4', name: 'Western Europe' },
          { id: '2.19', parent: '1.5', name: 'Australia and New Zealand' },
          { id: '2.20', parent: '1.5', name: 'Melanesia' },
          { id: '2.21', parent: '1.5', name: 'Micronesia' },
          { id: '2.22', parent: '1.5', name: 'Polynesia' },
        ],
        marker: {
          symbol: 'rect',
          width: 25 
        },
        // borderRadius: 10,
        dataLabels: {
          enabled: true,
          style: {
            whiteSpace: 'nowrap'
          }
        },
        levels: [
          {
            level: 1
            // 'levelIsConstant' removed – not supported by type
          },
          {
            level: 2
            // 'colorByPoint' removed – not supported here
          },
          {
            level: 3,
            colorVariation: {
              key: 'brightness',
              to: -0.5
            }
          },
          {
            level: 4,
            colorVariation: {
              key: 'brightness',
              to: 0.5
            }
          }
        ]
      }
    ]
  };
}
