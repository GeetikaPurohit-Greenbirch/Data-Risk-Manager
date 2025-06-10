import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
// load modules from .js paths
import TreemapModule from 'highcharts/modules/treemap.js';
import TreegraphModule from 'highcharts/modules/treegraph.js';

// initialize modules
TreemapModule(Highcharts);
TreegraphModule(Highcharts);

@Component({
  selector: 'app-alex-digram',
  templateUrl: './alex-digram.component.html',
  styleUrl: './alex-digram.component.scss',
})
export class AlexDigramComponent implements OnInit, AfterViewInit {
  Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  demoChartOptions!: Highcharts.Options;
  customChartOptions!: Highcharts.Options;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const highlightColor = '#2e7d32';
    const originalLineColor = '#000';

    // Data in [parent, id, optionalValue] format
    const rawData: any[][] = [
      [undefined, 'A \n B \n C \n D \n E \n (Source)', 'source'],
      // [undefined, 'A - (Source)', 'source'],
      // [undefined, 'B - (Source)', 'source'],
      // [undefined, 'C - (Source)', 'source'],
      // [undefined, 'D - (Source)', 'source'],
      // [undefined, 'E - (Source)', 'source'],

      [
        'A \n B \n C \n D \n E \n (Source)',
        'A \n B \n C \n D \n E \n (Interface1)',
        'interface',
      ],
      // ['A - (Source)', 'A - (Interface 1)', 'interface'],
      // ['B - (Source)', 'B - (Interface 1)', 'interface'],
      // ['C - (Source)', 'C - (Interface 1)', 'interface'],
      // ['D - (Source)', 'D - (Interface 1)', 'interface'],
      // ['E - (Source)', 'E - (Interface 1)', 'interface'],

      [
        'A \n B \n C \n D \n E \n (Interface1)',
        'A \n B \n C \n D \n E \n (System)',
        'system',
      ],
      // ['A - (Interface 1)', 'A - (System)', 'system'],
      // ['B - (Interface 1)', 'B - (System)', 'system'],
      // ['C - (Interface 1)', 'C - (System)', 'system'],
      // ['D - (Interface 1)', 'D - (System)', 'system'],
      // ['E - (Interface 1)', 'E - (System)', 'system'],

      [
        'A \n B \n C \n D \n E \n (System)',
        'A \n B \n C \n D \n E \n (Interface2)',
        'interface',
      ],
      // ['A - (System)', 'A - (Interface 2)', 'interface'],
      // ['B - (System)', 'B - (Interface 2)', 'interface'],
      // ['C - (System)', 'C - (Interface 2)', 'interface'],
      // ['D - (System)', 'D - (Interface 2)', 'interface'],
      // ['E - (System)', 'E - (Interface 2)', 'interface'],

      [
        'A \n B \n C \n D \n E \n (Interface2)',
        'A \n B \n C \n D \n E \n (Target)',
        'target',
      ],
      // ['A - (Interface 2)', 'A - (Target)', 'target'],
      // ['B - (Interface 2)', 'B - (Target)', 'target'],
      // ['C - (Interface 2)', 'C - (Target)', 'target'],
      // ['D - (Interface 2)', 'D - (Target)', 'target'],
      // ['E - (Interface 2)', 'E - (Target)', 'target'],
    ];

    // Transform to Highcharts format
    const data = rawData.map(([parent, id, type]) => {
      let markerSymbol = 'circle';
      let nodeColor = '#29b6f6'; // Default: system (blue)
      let customMarker = {};

      switch (type.toLowerCase()) {
        case 'source':
          markerSymbol = 'triangle';
          nodeColor = '#c742a8'; // Purple
          break;
        case 'interface':
          markerSymbol = 'square';
          nodeColor = '#7ac74f'; // Green
          break;
        case 'system':
          markerSymbol = 'circle';
          nodeColor = '#29b6f6'; // Blue
          break;
        case 'target':
          markerSymbol = 'circle';
          nodeColor = '#ff9800'; // Orange
          customMarker = {
            // radius: 14,
            // lineWidth: 3,
            // lineColor: '#000', // Outer pulse border
          };
          break;
      }

      return {
        id,
        parent,
        marker: {
          symbol: markerSymbol,
          ...customMarker,
          radius: 90,
          lineWidth: 3,
          lineColor: '#000',
        },
        color: nodeColor,
      };
    });

    Highcharts.chart('treegraph-container', {
      chart: {
        type: 'treegraph',
        // height: '60%',
        backgroundColor: '#fff',
        animation: true,
      },
      title: {
        text: '🌐 Custom TreeGraph with Node Types',
        style: { fontSize: '16px', color: '#333' },
      },
      tooltip: {
        formatter: function () {
          const point = this.point.options;
          if (point.parent)
            return `🔁 <b>${point.parent}</b> ➡ <b>${point.id}</b>`;
          return `🧠 <b>${point.id}</b>`;
        },
      },
      series: [
        {
          type: 'treegraph',
          keys: ['parent', 'id'],
          data,
          marker: {
            radius: 90,
            lineWidth: 10,
            lineColor: '#ff0000',
          },
          dataLabels: {
            enabled: true,
            align: 'center',
            x: 0,
            y: 0,
            inside: true,
            style: {
              color: '#000',
              fontSize: '14px',
              fontWeight: 'normal',
              textOutline: '2px #fff',
            },
            formatter: function () {
              return `<span style="color:${this.point.color}">${this.point.options.id}</span>`;
            },
          },
          point: {
            events: {
              click: function (this: any) {
                const point = this;
                const chart = point.series.chart;
                const allPoints = point.series.points;

                allPoints.forEach((p: any) =>
                  p.update(
                    {
                      marker: {
                        lineColor: '#000',
                        symbol: p.options.marker?.symbol,
                      },
                    },
                    false
                  )
                );

                const path: string[] = [];
                let current = point;
                while (current) {
                  path.push(current.options.id);
                  current.update(
                    {
                      marker: {
                        lineColor: '#2e7d32', // green
                        symbol: current.options.marker?.symbol,
                      },
                    },
                    false
                  );
                  const parentId = current.options.parent;
                  current = allPoints.find(
                    (p: any) => p.options.id === parentId
                  );
                }

                chart.redraw();
                console.warn(
                  '📢 Highlighted path to root:',
                  path.reverse().join(' ➡ ')
                );
              },
            },
          },
          link: {
            color: '#c742a8',
          },
        },
      ],
      credits: { enabled: false },
    });
  }
}
