import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { SharedModule } from 'src/app/features/shared/shared/shared.module';

// Import necessary Highcharts modules
const Networkgraph = require('highcharts/modules/networkgraph');
// const Treegraph = require('highcharts/modules/treegraph');
const Sankey = require('highcharts/modules/sankey');
const HC_3D = require('highcharts/highcharts-3d');
const Organization = require('highcharts/modules/organization');
try {
  HC_3D(Highcharts);
  Sankey(Highcharts);
  Organization(Highcharts);
  // Treegraph(Highcharts);
  Networkgraph(Highcharts);
} catch (e) {
  console.error('Charts Module Failed:', e);
}

@Component({
  standalone: true,
  imports: [HighchartsChartModule, SharedModule],
  selector: 'app-lineages-tree',
  templateUrl: './lineage-tree.component.html',
  styleUrls: ['./lineage-tree.component.scss'],
})

export class LineageTreeComponent {
  Highcharts: typeof Highcharts = Highcharts;
  HC_3D: typeof HC_3D = HC_3D; // 3D enable

  // Chart 1: Sankey Diagram
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

  // Chart 2: Organization Chart
  OrganizationChartOptions: Highcharts.Options = {
    chart: {
      height: 600,
      inverted: true,
    },
    title: {
      text: 'Simple Org Chart',
    },
    series: [
      {
        type: 'organization',
        name: 'Highsoft',
        keys: ['from', 'to'],
        data: [
          { from: 'CEO', to: 'CTO' },
          { from: 'CEO', to: 'CFO' },
          { from: 'CTO', to: 'Dev1' },
          { from: 'CTO', to: 'Dev2' },
          { from: 'CFO', to: 'Accountant' },
        ],
        nodes: [
          { id: 'CEO', title: 'CEO', name: 'John' },
          { id: 'CTO', title: 'CTO', name: 'Jane' },
          { id: 'CFO', title: 'CFO', name: 'Jack' },
          { id: 'Dev1', title: 'Developer', name: 'Alex' },
          { id: 'Dev2', title: 'Developer', name: 'Alice' },
          { id: 'Accountant', title: 'Accountant', name: 'Anne' },
        ],
        colorByPoint: false,
        color: '#007ad0',
        dataLabels: {
          color: 'white',
        },
        borderColor: 'white',
        nodeWidth: 65,
      },
    ],
    tooltip: {
      outside: true,
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      // make nodes clickable and show a dialog/modal when clicked
      series: {
        point: {
          events: {
            click: function () {
              alert('Clicked: ' + (this as any).id);
            },
          },
        },
      },
    },
  };

  // Chart 3: Treegraph Chart
  TreegraphChartOptions: Highcharts.Options = {
    chart: {
      inverted: false,
    },
    title: {
      text: 'Simple Lineage Tree (Treegraph)',
    },
    series: [
      {
        type: 'treegraph',
        data: [
          { id: 'Grandparent' },
          { id: 'Parent1', parent: 'Grandparent' },
          { id: 'Parent2', parent: 'Grandparent' },
          { id: 'Child1', parent: 'Parent1' },
          { id: 'Child2', parent: 'Parent1' },
          { id: 'Child3', parent: 'Parent2' },
        ],
        dataLabels: {
          style: {
            fontSize: '13px',
          },
        },
        marker: {
          radius: 8,
        },
      },
    ],
    credits: {
      enabled: false,
    },
  };

  // Chart 4: Networkgraph Chart
  NetworkgraphChartOptions: Highcharts.Options = {
    chart: {
      type: 'networkgraph',
      height: '600px',
    },
    title: {
      text: 'Simple Network Graph',
    },
    plotOptions: {
      networkgraph: {
        keys: ['from', 'to'],
        layoutAlgorithm: {
          enableSimulation: true,
          integration: 'verlet',
          linkLength: 100,
        },
      },
      series: {
        cursor: 'pointer',
        point: {
          events: {
            click: function () {
              alert('You clicked node: ' + this.name);
            },
          },
        },
      },
    },
    series: [
      {
        type: 'networkgraph',
        name: 'Relationships',
        data: [
          ['A', 'B'],
          ['A', 'C'],
          ['A', 'D'],
          ['B', 'E'],
          ['C', 'F'],
          ['D', 'G'],
          ['F', 'H'],
          ['G', 'I'],
        ],
      },
    ],
    credits: {
      enabled: false,
    },
  };
}
