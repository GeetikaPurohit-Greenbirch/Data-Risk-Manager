import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
// load modules from .js paths
import TreemapModule from 'highcharts/modules/treemap.js';
import TreegraphModule from 'highcharts/modules/treegraph.js';

// initialize modules
TreemapModule(Highcharts);
TreegraphModule(Highcharts);

@Component({
  selector: 'app-lineage-treegraph',
  templateUrl: './lineage-treegraph.component.html',
  styleUrls: ['./lineage-treegraph.component.scss'],
})
export class LineageTreegraphComponent implements OnInit, AfterViewInit {
  Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};
  demoChartOptions!: Highcharts.Options;
  customChartOptions!: Highcharts.Options;

  // Demo chart data
  readonly lineageData: any[][] = [
    [undefined, 'Proto Indo-European'],
    ['Proto Indo-European', 'Balto-Slavic'],
    ['Proto Indo-European', 'Germanic'],
    ['Proto Indo-European', 'Celtic'],
    ['Proto Indo-European', 'Italic'],
    ['Proto Indo-European', 'Hellenic'],
    ['Proto Indo-European', 'Anatolian'],
    ['Proto Indo-European', 'Indo-Iranian'],
    ['Proto Indo-European', 'Tocharian'],
    ['Indo-Iranian', 'Dardic'],
    ['Indo-Iranian', 'Indic'],
    ['Indo-Iranian', 'Iranian'],
    ['Iranian', 'Old Persian'],
    ['Old Persian', 'Middle Persian'],
    ['Indic', 'Sanskrit'],
    ['Italic', 'Osco-Umbrian'],
    ['Italic', 'Latino-Faliscan'],
    ['Latino-Faliscan', 'Latin'],
    ['Celtic', 'Brythonic'],
    ['Celtic', 'Goidelic'],
    ['Germanic', 'North Germanic'],
    ['Germanic', 'West Germanic'],
    ['Germanic', 'East Germanic'],
    ['North Germanic', 'Old Norse'],
    ['North Germanic', 'Old Swedish'],
    ['North Germanic', 'Old Danish'],
    ['West Germanic', 'Old English'],
    ['West Germanic', 'Old Frisian'],
    ['West Germanic', 'Old Dutch'],
    ['West Germanic', 'Old Low German'],
    ['West Germanic', 'Old High German'],
    ['Old Norse', 'Old Icelandic'],
    ['Old Norse', 'Old Norwegian'],
    ['Old Swedish', 'Middle Swedish'],
    ['Old Danish', 'Middle Danish'],
    ['Old English', 'Middle English'],
    ['Old Dutch', 'Middle Dutch'],
    ['Old Low German', 'Middle Low German'],
    ['Old High German', 'Middle High German'],
    ['Balto-Slavic', 'Baltic'],
    ['Balto-Slavic', 'Slavic'],
    ['Slavic', 'East Slavic'],
    ['Slavic', 'West Slavic'],
    ['Slavic', 'South Slavic'],
  ];

  ngOnInit(): void {
    this.initializeDemoChart();
    this.initializeCustomChart();
    // Optionally, you can set up default chart options here if you want to use Highcharts-angular
    this.chartOptions = {
      chart: {
        spacingBottom: 30,
        marginRight: 120,
        height: 1200,
      },
      title: { text: 'Phylogenetic language tree' },
      series: [
        {
          type: 'treegraph',
          keys: ['parent', 'id', 'level'],
          clip: false,
          data: [
            [undefined, 'Proto Indo-European'],
            ['Proto Indo-European', 'Balto-Slavic'],
            ['Proto Indo-European', 'Germanic'],
            ['Proto Indo-European', 'Celtic'],
            ['Proto Indo-European', 'Italic'],
            ['Proto Indo-European', 'Hellenic'],
            ['Proto Indo-European', 'Anatolian'],
            ['Proto Indo-European', 'Indo-Iranian'],
            ['Proto Indo-European', 'Tocharian'],
            ['Indo-Iranian', 'Dardic'],
            ['Indo-Iranian', 'Indic'],
            ['Indo-Iranian', 'Iranian'],
            ['Iranian', 'Old Persian'],
            ['Old Persian', 'Middle Persian'],
            ['Indic', 'Sanskrit'],
            ['Italic', 'Osco-Umbrian'],
            ['Italic', 'Latino-Faliscan'],
            ['Latino-Faliscan', 'Latin'],
            ['Celtic', 'Brythonic'],
            ['Celtic', 'Goidelic'],
            ['Germanic', 'North Germanic'],
            ['Germanic', 'West Germanic'],
            ['Germanic', 'East Germanic'],
            ['North Germanic', 'Old Norse'],
            ['North Germanic', 'Old Swedish'],
            ['North Germanic', 'Old Danish'],
            ['West Germanic', 'Old English'],
            ['West Germanic', 'Old Frisian'],
            ['West Germanic', 'Old Dutch'],
            ['West Germanic', 'Old Low German'],
            ['West Germanic', 'Old High German'],
            ['Old Norse', 'Old Icelandic'],
            ['Old Norse', 'Old Norwegian'],
            ['Old Swedish', 'Middle Swedish'],
            ['Old Danish', 'Middle Danish'],
            ['Old English', 'Middle English'],
            ['Old Dutch', 'Middle Dutch'],
            ['Old Low German', 'Middle Low German'],
            ['Old High German', 'Middle High German'],
            ['Balto-Slavic', 'Baltic'],
            ['Balto-Slavic', 'Slavic'],
            ['Slavic', 'East Slavic'],
            ['Slavic', 'West Slavic'],
            ['Slavic', 'South Slavic'],
            ['Proto Indo-European', 'Phrygian', 6],
            ['Proto Indo-European', 'Armenian', 6],
            ['Proto Indo-European', 'Albanian', 6],
            ['Proto Indo-European', 'Thracian', 6],
            ['Tocharian', 'Tocharian A', 6],
            ['Tocharian', 'Tocharian B', 6],
            ['Anatolian', 'Hittite', 6],
            ['Anatolian', 'Palaic', 6],
            ['Anatolian', 'Luwic', 6],
            ['Anatolian', 'Lydian', 6],
            ['Iranian', 'Balochi', 6],
            ['Iranian', 'Kurdish', 6],
            ['Iranian', 'Pashto', 6],
            ['Iranian', 'Sogdian', 6],
            ['Old Persian', 'Pahlavi', 6],
            ['Middle Persian', 'Persian', 6],
            ['Hellenic', 'Greek', 6],
            ['Dardic', 'Dard', 6],
            ['Sanskrit', 'Sindhi', 6],
            ['Sanskrit', 'Romani', 6],
            ['Sanskrit', 'Urdu', 6],
            ['Sanskrit', 'Hindi', 6],
            ['Sanskrit', 'Bihari', 6],
            ['Sanskrit', 'Assamese', 6],
            ['Sanskrit', 'Bengali', 6],
            ['Sanskrit', 'Marathi', 6],
            ['Sanskrit', 'Gujarati', 6],
            ['Sanskrit', 'Punjabi', 6],
            ['Sanskrit', 'Sinhalese', 6],
            ['Osco-Umbrian', 'Umbrian', 6],
            ['Osco-Umbrian', 'Oscan', 6],
            ['Latino-Faliscan', 'Faliscan', 6],
            ['Latin', 'Portugese', 6],
            ['Latin', 'Spanish', 6],
            ['Latin', 'French', 6],
            ['Latin', 'Romanian', 6],
            ['Latin', 'Italian', 6],
            ['Latin', 'Catalan', 6],
            ['Latin', 'Franco-Provençal', 6],
            ['Latin', 'Rhaeto-Romance', 6],
            ['Brythonic', 'Welsh', 6],
            ['Brythonic', 'Breton', 6],
            ['Brythonic', 'Cornish', 6],
            ['Brythonic', 'Cuymbric', 6],
            ['Goidelic', 'Modern Irish', 6],
            ['Goidelic', 'Scottish Gaelic', 6],
            ['Goidelic', 'Manx', 6],
            ['East Germanic', 'Gothic', 6],
            ['Middle Low German', 'Low German', 6],
            ['Middle High German', '(High) German', 6],
            ['Middle High German', 'Yiddish', 6],
            ['Middle English', 'English', 6],
            ['Middle Dutch', 'Hollandic', 6],
            ['Middle Dutch', 'Flemish', 6],
            ['Middle Dutch', 'Dutch', 6],
            ['Middle Dutch', 'Limburgish', 6],
            ['Middle Dutch', 'Brabantian', 6],
            ['Middle Dutch', 'Rhinelandic', 6],
            ['Old Frisian', 'Frisian', 6],
            ['Middle Danish', 'Danish', 6],
            ['Middle Swedish', 'Swedish', 6],
            ['Old Norwegian', 'Norwegian', 6],
            ['Old Norse', 'Faroese', 6],
            ['Old Icelandic', 'Icelandic', 6],
            ['Baltic', 'Old Prussian', 6],
            ['Baltic', 'Lithuanian', 6],
            ['Baltic', 'Latvian', 6],
            ['West Slavic', 'Polish', 6],
            ['West Slavic', 'Slovak', 6],
            ['West Slavic', 'Czech', 6],
            ['West Slavic', 'Wendish', 6],
            ['East Slavic', 'Bulgarian', 6],
            ['East Slavic', 'Old Church Slavonic', 6],
            ['East Slavic', 'Macedonian', 6],
            ['East Slavic', 'Serbo-Croatian', 6],
            ['East Slavic', 'Slovene', 6],
            ['South Slavic', 'Russian', 6],
            ['South Slavic', 'Ukrainian', 6],
            ['South Slavic', 'Belarusian', 6],
            ['South Slavic', 'Rusyn', 6],
          ],
          marker: {
            symbol: 'circle',
            radius: 6,
            fillColor: '#ffffff',
            lineWidth: 3,
          },
          levels: [
            { level: 1 },
            { level: 2, colorVariation: { key: 'brightness', to: -0.5 } },
            { level: 3, colorVariation: { key: 'brightness', to: 0.5 } },
          ],
        },
      ],
    };
  }

  ngAfterViewInit(): void {
    const highlightColor = '#2e7d32';
    const originalLineColor = '#000';

    // Data in [parent, id, optionalValue] format
    const rawData: any[][] = [
      [undefined, 'Proto Indo-European'],
      ['Proto Indo-European', 'Balto-Slavic'],
      ['Proto Indo-European', 'Germanic'],
      ['Proto Indo-European', 'Celtic'],
      ['Proto Indo-European', 'Italic'],
      ['Proto Indo-European', 'Hellenic'],
      ['Proto Indo-European', 'Anatolian'],
      ['Proto Indo-European', 'Indo-Iranian'],
      ['Proto Indo-European', 'Tocharian'],
      ['Indo-Iranian', 'Dardic'],
      ['Indo-Iranian', 'Indic'],
      ['Indo-Iranian', 'Iranian'],
      ['Iranian', 'Old Persian'],
      ['Old Persian', 'Middle Persian'],
      ['Indic', 'Sanskrit'],
      ['Italic', 'Osco-Umbrian'],
      ['Italic', 'Latino-Faliscan'],
      ['Latino-Faliscan', 'Latin'],
      ['Celtic', 'Brythonic'],
      ['Celtic', 'Goidelic'],
      ['Germanic', 'North Germanic'],
      ['Germanic', 'West Germanic'],
      ['Germanic', 'East Germanic'],
      ['North Germanic', 'Old Norse'],
      ['North Germanic', 'Old Swedish'],
      ['North Germanic', 'Old Danish'],
      ['West Germanic', 'Old English'],
      ['West Germanic', 'Old Frisian'],
      ['West Germanic', 'Old Dutch'],
      ['West Germanic', 'Old Low German'],
      ['West Germanic', 'Old High German'],
      ['Old Norse', 'Old Icelandic'],
      ['Old Norse', 'Old Norwegian'],
      ['Old Swedish', 'Middle Swedish'],
      ['Old Danish', 'Middle Danish'],
      ['Old English', 'Middle English'],
      ['Old Dutch', 'Middle Dutch'],
      ['Old Low German', 'Middle Low German'],
      ['Old High German', 'Middle High German'],
      ['Balto-Slavic', 'Baltic'],
      ['Balto-Slavic', 'Slavic'],
      ['Slavic', 'East Slavic'],
      ['Slavic', 'West Slavic'],
      ['Slavic', 'South Slavic'],
      ['Proto Indo-European', 'Phrygian', 6],
      ['Proto Indo-European', 'Armenian', 6],
      ['Proto Indo-European', 'Albanian', 6],
      ['Proto Indo-European', 'Thracian', 6],
      ['Tocharian', 'Tocharian A', 6],
      ['Tocharian', 'Tocharian B', 6],
      ['Anatolian', 'Hittite', 6],
      ['Anatolian', 'Palaic', 6],
      ['Anatolian', 'Luwic', 6],
      ['Anatolian', 'Lydian', 6],
      ['Iranian', 'Balochi', 6],
      ['Iranian', 'Kurdish', 6],
      ['Iranian', 'Pashto', 6],
      ['Iranian', 'Sogdian', 6],
      ['Old Persian', 'Pahlavi', 6],
      ['Middle Persian', 'Persian', 6],
      ['Hellenic', 'Greek', 6],
      ['Dardic', 'Dard', 6],
      ['Sanskrit', 'Sindhi', 6],
      ['Sanskrit', 'Romani', 6],
      ['Sanskrit', 'Urdu', 6],
      ['Sanskrit', 'Hindi', 6],
      ['Sanskrit', 'Bihari', 6],
      ['Sanskrit', 'Assamese', 6],
      ['Sanskrit', 'Bengali', 6],
      ['Sanskrit', 'Marathi', 6],
      ['Sanskrit', 'Gujarati', 6],
      ['Sanskrit', 'Punjabi', 6],
      ['Sanskrit', 'Sinhalese', 6],
      ['Osco-Umbrian', 'Umbrian', 6],
      ['Osco-Umbrian', 'Oscan', 6],
      ['Latino-Faliscan', 'Faliscan', 6],
      ['Latin', 'Portugese', 6],
      ['Latin', 'Spanish', 6],
      ['Latin', 'French', 6],
      ['Latin', 'Romanian', 6],
      ['Latin', 'Italian', 6],
      ['Latin', 'Catalan', 6],
      ['Latin', 'Franco-Provençal', 6],
      ['Latin', 'Rhaeto-Romance', 6],
      ['Brythonic', 'Welsh', 6],
      ['Brythonic', 'Breton', 6],
      ['Brythonic', 'Cornish', 6],
      ['Brythonic', 'Cuymbric', 6],
      ['Goidelic', 'Modern Irish', 6],
      ['Goidelic', 'Scottish Gaelic', 6],
      ['Goidelic', 'Manx', 6],
      ['East Germanic', 'Gothic', 6],
      ['Middle Low German', 'Low German', 6],
      ['Middle High German', '(High) German', 6],
      ['Middle High German', 'Yiddish', 6],
      ['Middle English', 'English', 6],
      ['Middle Dutch', 'Hollandic', 6],
      ['Middle Dutch', 'Flemish', 6],
      ['Middle Dutch', 'Dutch', 6],
      ['Middle Dutch', 'Limburgish', 6],
      ['Middle Dutch', 'Brabantian', 6],
      ['Middle Dutch', 'Rhinelandic', 6],
      ['Old Frisian', 'Frisian', 6],
      ['Middle Danish', 'Danish', 6],
      ['Middle Swedish', 'Swedish', 6],
      ['Old Norwegian', 'Norwegian', 6],
      ['Old Norse', 'Faroese', 6],
      ['Old Icelandic', 'Icelandic', 6],
      ['Baltic', 'Old Prussian', 6],
      ['Baltic', 'Lithuanian', 6],
      ['Baltic', 'Latvian', 6],
      ['West Slavic', 'Polish', 6],
      ['West Slavic', 'Slovak', 6],
      ['West Slavic', 'Czech', 6],
      ['West Slavic', 'Wendish', 6],
      ['East Slavic', 'Bulgarian', 6],
      ['East Slavic', 'Old Church Slavonic', 6],
      ['East Slavic', 'Macedonian', 6],
      ['East Slavic', 'Serbo-Croatian', 6],
      ['East Slavic', 'Slovene', 6],
      ['South Slavic', 'Russian', 6],
      ['South Slavic', 'Ukrainian', 6],
      ['South Slavic', 'Belarusian', 6],
      ['South Slavic', 'Rusyn', 6],
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
        height: '100%',
        animation: true,
        backgroundColor: '#fff',
      },
      title: {
        text: '🌐 Proto-Indo-European Language Tree',
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

  // Initialize demo chart with predefined options
   private initializeDemoChart() {
    this.demoChartOptions = {
      chart: {
        height: 600
      },
      title: {
        text: '🌿 Highcharts Demo TreeGraph'
      },
      series: [{
        type: 'treegraph',
        keys: ['parent', 'id'],
        data: this.lineageData,
        marker: {
          symbol: 'circle'
        }
      }]
    };
  }

  private initializeCustomChart() {
    const getMarkerSymbol = (parent: string | undefined, id: string): string => {
      if (!parent) return 'triangle';
      const hasChildren = this.lineageData.some(([p]) => p === id);
      return hasChildren ? 'square' : 'circle';
    };

    const formattedData = this.lineageData.map(([parent, id]) => ({
      parent,
      id,
      marker: {
        symbol: getMarkerSymbol(parent, id),
        radius: 7,
        lineWidth: 2,
        lineColor: '#2e7d32',
        fillColor: '#fff'
      }
    }));

    this.customChartOptions = {
      chart: {
        height: 600
      },
      title: {
        text: '🧠 Custom TreeGraph with Node Shapes'
      },
      tooltip: {
        formatter() {
          const point = this.point as Highcharts.Point;
          return `<b>${point.name}</b><br><span style="color:gray">Parent:</span> ${(point.options as any).parent || 'Root'}`;
        }
      },
      series: [{
        type: 'treegraph',
        data: formattedData,
        dataLabels: {
          style: {
            fontSize: '12px'
          }
        },
        link: {
          color: '#ccc'
        },
        marker: {
          lineWidth: 1
        },
        levels: [
          {
            level: 1,
            color: '#1976d2'
          },
          {
            level: 2,
            color: '#64b5f6'
          }
        ],
        events: {
          click: function (event) {
            const clickedNode = (event.point as any).id;
            const series = event.point.series;
            const pointsToHighlight = new Set<string>();

            function traceUpward(node: string) {
              pointsToHighlight.add(node);
              const parent = series.data.find(p => (p.options as any).id === node)?.options.parent;
              if (parent) traceUpward(parent);
            }

            traceUpward(clickedNode);

            series.data.forEach(point => {
              const isHighlighted = pointsToHighlight.has((point.options as any).id);
              point.update({
                color: isHighlighted ? '#2e7d32' : undefined
              }, false);
            });
            series.chart.redraw();
          }
        }
      }]
    };
  }
}
