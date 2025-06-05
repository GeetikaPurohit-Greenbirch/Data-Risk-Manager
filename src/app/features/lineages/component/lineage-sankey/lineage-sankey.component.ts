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

  // Chart Data
  chartData: [string, string, number][] = [
    ['Net Import', 'Electricity & Heat', 0.14],
    ['Solar', 'Electricity & Heat', 1.28],
    ['Nuclear', 'Electricity & Heat', 8.05],
    ['Hydro', 'Electricity & Heat', 2.31],
    ['Wind', 'Electricity & Heat', 3.84],
    ['Geothermal', 'Electricity & Heat', 0.15],
    ['Natural Gas', 'Electricity & Heat', 12.5],
    ['Coal', 'Electricity & Heat', 8.9],
    ['Biomass', 'Electricity & Heat', 0.41],
    ['Petroleum', 'Electricity & Heat', 0.24],
    ['Electricity & Heat', 'Residential', 5.19],
    ['Solar', 'Residential', 0.4],
    ['Geothermal', 'Residential', 0.04],
    ['Natural Gas', 'Residential', 5.17],
    ['Biomass', 'Residential', 0.48],
    ['Petroleum', 'Residential', 0.98],
    ['Electricity & Heat', 'Commercial', 4.69],
    ['Solar', 'Commercial', 0.16],
    ['Geothermal', 'Commercial', 0.02],
    ['Natural Gas', 'Commercial', 3.65],
    ['Coal', 'Commercial', 0.02],
    ['Biomass', 'Commercial', 0.15],
    ['Petroleum', 'Commercial', 0.88],
    ['Electricity & Heat', 'Industrial', 3.44],
    ['Solar', 'Industrial', 0.04],
    ['Natural Gas', 'Industrial', 10.8],
    ['Coal', 'Industrial', 0.99],
    ['Biomass', 'Industrial', 2.27],
    ['Petroleum', 'Industrial', 9.13],
    ['Electricity & Heat', 'Transportation', 0.02],
    ['Natural Gas', 'Transportation', 1.29],
    ['Biomass', 'Transportation', 1.57],
    ['Petroleum', 'Transportation', 24.6],
    ['Electricity & Heat', 'Rejected Energy', 24.3],
    ['Residential', 'Rejected Energy', 4.29],
    ['Commercial', 'Rejected Energy', 3.35],
    ['Industrial', 'Rejected Energy', 13.6],
    ['Transportation', 'Rejected Energy', 21.7],
    ['Residential', 'Energy Services', 7.97],
    ['Commercial', 'Energy Services', 6.22],
    ['Industrial', 'Energy Services', 13.1],
    ['Transportation', 'Energy Services', 5.77],
  ];

  // Dummy data for Sankey chart
  // SankeyChartOptions: Highcharts.Options = {
  //   title: { text: 'Simple Sankey Diagram' },
  //   series: [
  //     {
  //       type: 'sankey',
  //       keys: ['from', 'to', 'weight'],
  //       data: [
  //         ['A', 'B', 5],
  //         ['A', 'C', 3],
  //         ['B', 'D', 2],
  //         ['C', 'D', 2],
  //       ],
  //       name: 'Sankey flow',
  //     },
  //   ],
  // };

  // Dummy data for Sankey chart from Highcharts Docs
  SankeyChartOptions: Highcharts.Options = {
    chart: {
      zooming: {
        type: 'xy',
      },
      panning: {
        enabled: true,
        type: 'xy',
      },
      panKey: 'shift',
    },
    title: {
      text: 'Estimated US Energy Consumption in 2022',
    },
    subtitle: {
      text: "Source: <a href='https://www.llnl.gov/'> Lawrence Livermore National Laboratory</a>",
    },
    accessibility: {
      point: {
        valueDescriptionFormat:
          '{index}. {point.from} to {point.to}, ' + '{point.weight}.',
      },
    },
    tooltip: {
      pointFormat:
        '{point.fromNode.name} \u2192 {point.toNode.name}: {point.weight:.2f} ' +
        'quads',
    },
    series: [
      {
        keys: ['from', 'to', 'weight'],

        nodes: [
          {
            id: 'Electricity & Heat',
            color: '#ffa500',
          },
          {
            id: 'Net Import',
            color: '000000',
          },
          {
            id: 'Residential',
            color: '#74ffe7',
            column: 2,
          },
          {
            id: 'Commercial',
            color: '#8cff74',
            column: 2,
          },
          {
            id: 'Industrial',
            color: '#ff8da1',
            column: 2,
          },
          {
            id: 'Transportation',
            color: '#f4c0ff',
            column: 2,
          },
          {
            id: 'Rejected Energy',
            color: '#e6e6e6',
            column: 3,
          },
          {
            id: 'Energy Services',
            color: '#F9E79F',
            column: 3,
          },
          {
            id: 'Net Import',
            color: '000000',
          },
          {
            id: 'Solar',
            color: '#009c00',
          },
          {
            id: 'Nuclear',
            color: '#1a8dff',
          },
          {
            id: 'Hydro',
            color: '#009c00',
          },
          {
            id: 'Wind',
            color: '#009c00',
          },
          {
            id: 'Geothermal',
            color: '#009c00',
          },
          {
            id: 'Natural Gas',
            color: '#1a8dff',
          },
          {
            id: 'Biomass',
            color: '#009c00',
          },
          {
            id: 'Coal',
            color: '#989898',
          },
          {
            id: 'Petroleum',
            color: '#989898',
          },
        ],

        data: [
          ['Net Import', 'Electricity & Heat', 0.14],
          ['Solar', 'Electricity & Heat', 1.28],
          ['Nuclear', 'Electricity & Heat', 8.05],
          ['Hydro', 'Electricity & Heat', 2.31],
          ['Wind', 'Electricity & Heat', 3.84],
          ['Geothermal', 'Electricity & Heat', 0.15],
          ['Natural Gas', 'Electricity & Heat', 12.5],
          ['Coal', 'Electricity & Heat', 8.9],
          ['Biomass', 'Electricity & Heat', 0.41],
          ['Petroleum', 'Electricity & Heat', 0.24],

          ['Electricity & Heat', 'Residential', 5.19],
          ['Solar', 'Residential', 0.4],
          ['Geothermal', 'Residential', 0.04],
          ['Natural Gas', 'Residential', 5.17],
          ['Biomass', 'Residential', 0.48],
          ['Petroleum', 'Residential', 0.98],

          ['Electricity & Heat', 'Commercial', 4.69],
          ['Solar', 'Commercial', 0.16],
          ['Geothermal', 'Commercial', 0.02],
          ['Natural Gas', 'Commercial', 3.65],
          ['Coal', 'Commercial', 0.02],
          ['Biomass', 'Commercial', 0.15],
          ['Petroleum', 'Commercial', 0.88],

          ['Electricity & Heat', 'Industrial', 3.44],
          ['Solar', 'Industrial', 0.04],
          ['Natural Gas', 'Industrial', 10.8],
          ['Coal', 'Industrial', 0.99],
          ['Biomass', 'Industrial', 2.27],
          ['Petroleum', 'Industrial', 9.13],

          ['Electricity & Heat', 'Transportation', 0.02],
          ['Natural Gas', 'Transportation', 1.29],
          ['Biomass', 'Transportation', 1.57],
          ['Petroleum', 'Transportation', 24.6],

          ['Electricity & Heat', 'Rejected Energy', 24.3],
          ['Residential', 'Rejected Energy', 4.29],
          ['Commercial', 'Rejected Energy', 3.35],
          ['Industrial', 'Rejected Energy', 13.6],
          ['Transportation', 'Rejected Energy', 21.7],

          ['Residential', 'Energy Services', 7.97],
          ['Commercial', 'Energy Services', 6.22],
          ['Industrial', 'Energy Services', 13.1],
          ['Transportation', 'Energy Services', 5.77],
        ],
        type: 'sankey',
        name: 'Sankey demo series',
      },
    ],
    plotOptions: {
      // Enable point click events with a callback function dialog massage
      series: {
        point: {
          events: {
            click: function () {
              const nodeId = this.name;

              const data = [
                ['Net Import', 'Electricity & Heat', 0.14],
                ['Solar', 'Electricity & Heat', 1.28],
                ['Nuclear', 'Electricity & Heat', 8.05],
                ['Hydro', 'Electricity & Heat', 2.31],
                ['Wind', 'Electricity & Heat', 3.84],
                ['Geothermal', 'Electricity & Heat', 0.15],
                ['Natural Gas', 'Electricity & Heat', 12.5],
                ['Coal', 'Electricity & Heat', 8.9],
                ['Biomass', 'Electricity & Heat', 0.41],
                ['Petroleum', 'Electricity & Heat', 0.24],
                ['Electricity & Heat', 'Residential', 5.19],
                ['Solar', 'Residential', 0.4],
                ['Geothermal', 'Residential', 0.04],
                ['Natural Gas', 'Residential', 5.17],
                ['Biomass', 'Residential', 0.48],
                ['Petroleum', 'Residential', 0.98],
                ['Electricity & Heat', 'Commercial', 4.69],
                ['Solar', 'Commercial', 0.16],
                ['Geothermal', 'Commercial', 0.02],
                ['Natural Gas', 'Commercial', 3.65],
                ['Coal', 'Commercial', 0.02],
                ['Biomass', 'Commercial', 0.15],
                ['Petroleum', 'Commercial', 0.88],
                ['Electricity & Heat', 'Industrial', 3.44],
                ['Solar', 'Industrial', 0.04],
                ['Natural Gas', 'Industrial', 10.8],
                ['Coal', 'Industrial', 0.99],
                ['Biomass', 'Industrial', 2.27],
                ['Petroleum', 'Industrial', 9.13],
                ['Electricity & Heat', 'Transportation', 0.02],
                ['Natural Gas', 'Transportation', 1.29],
                ['Biomass', 'Transportation', 1.57],
                ['Petroleum', 'Transportation', 24.6],
                ['Electricity & Heat', 'Rejected Energy', 24.3],
                ['Residential', 'Rejected Energy', 4.29],
                ['Commercial', 'Rejected Energy', 3.35],
                ['Industrial', 'Rejected Energy', 13.6],
                ['Transportation', 'Rejected Energy', 21.7],
                ['Residential', 'Energy Services', 7.97],
                ['Commercial', 'Energy Services', 6.22],
                ['Industrial', 'Energy Services', 13.1],
                ['Transportation', 'Energy Services', 5.77],
              ];

              // Lineage calculation
              const getLineage = (targetNode: string): string[] => {
                const paths: string[][] = [];

                const traverse = (node: string, path: string[]) => {
                  const predecessors = data
                    .filter((d) => d[1] === node)
                    .map((d) => d[0]);
                  if (predecessors.length === 0) {
                    paths.push([node, ...path]);
                  } else {
                    predecessors.forEach((prev) =>
                      traverse(prev as string, [node, ...path])
                    );
                  }
                };

                traverse(nodeId, []);
                return paths[0] || [nodeId];
              };

              const lineage = getLineage(nodeId);
              alert(`Data Lineage for ${nodeId}:\n${lineage.join(' → ')}`);
            },
          },
        },
      },
    },
  };
}
