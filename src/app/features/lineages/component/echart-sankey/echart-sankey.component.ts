import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-echart-sankey',
  templateUrl: './echart-sankey.component.html',
  styleUrl: './echart-sankey.component.scss',
})

export class EchartSankeyComponent implements OnInit {
  chartOptions: EChartsOption = {};
  isLoading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSankeyData();
  }

  loadSankeyData(): void {
    this.http.get<any>('assets/mock/sankey-data.json').subscribe((data) => {
      this.chartOptions = {
        title: {
          text: 'Financial Flow (Sankey)',
          left: 'center',
        },
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
        },
        series: [
          {
            type: 'sankey',
            emphasis: { focus: 'adjacency' },
            data: data.nodes,
            links: data.links,
            lineStyle: {
              color: 'gradient',
              curveness: 0.5,
            },
            label: {
              color: '#333',
            },
          },
        ],
      };
      this.isLoading = false;
    });
  }
}
