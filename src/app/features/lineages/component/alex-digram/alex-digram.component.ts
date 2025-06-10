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
  styleUrl: './alex-digram.component.scss'
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
      [undefined, 'Source', 'source'],
      ['Source', 'Interface 1', 'interface'],
      ['Interface 1', 'System A', 'system'],
      ['Interface 1', 'Interface 2', 'Interface'],
      ['Interface 2', 'Target', 'target'],
    ];

    // Transform to Highcharts format
    const data = rawData.map(([parent, id, val]) => { 
      let markerSymbol = 'circle';
      if (!parent) markerSymbol = 'triangle';
      else if (!val && rawData.some(([p]) => p === id)) markerSymbol = 'square';
      else if (!val) markerSymbol = 'circle';
      else markerSymbol = 'circle';

      return {
        id,
        parent,
        marker: { symbol: markerSymbol },
        color:
          markerSymbol === 'triangle'
            ? '#c742a8'
            : markerSymbol === 'square'
            ? '#7ac74f'
            : '#29b6f6',
      };
    });

    Highcharts.chart('treegraph-container', {
      chart: {
        type: 'treegraph',
        height: '50%',
        animation: true,
        backgroundColor: '#fff',
      },
      title: {
        text: '🌐 Basic Lineage Example with flow through of Risk',
        style: { fontSize: '20px', color: '#333' },
      },
      tooltip: {
        formatter: function () {
          const point = this.point.options;
          if (point.parent)
            return `🌱 <b>${point.parent}</b> ➡ <b>${point.id}</b>`;
          return `🧠 <b>${point.id}</b>`;
        },
      },
      series: [
        {
          type: 'treegraph',
          keys: ['parent', 'id'],
          data,
          marker: {
            radius: 10,
            height: 20,
            width: 30,
            lineWidth: 1,
            lineColor: originalLineColor,
          },
          dataLabels: {
            enabled: true,
            align: 'left',
            x: 35,
            crop: false,
            style: {
              color: '#000',
              fontSize: '13px',
              fontWeight: 'normal',
              textOutline: '2px #fff',
              whiteSpace: 'nowrap',
              fontFamily: 'Segoe UI, sans-serif',
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
                        lineColor: originalLineColor,
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
                        lineColor: highlightColor,
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
