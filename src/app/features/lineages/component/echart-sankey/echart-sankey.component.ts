import { Component, OnInit } from '@angular/core';
import { EChartsOption } from 'echarts';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-echart-sankey',
  templateUrl: './echart-sankey.component.html',
  styleUrls: ['./echart-sankey.component.scss'],
})
export class EchartSankeyComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadSankeyData();
  }

  chartOptions: EChartsOption = {};
  tableData: { name: string }[] = [];
  isLoading = true;
  isExpanded = false;

  toggleExpand(): void {
    this.isExpanded = !this.isExpanded;
  }

  loadSankeyData(): void {
    this.http
      .get<{ nodes: any[]; links: any[] }>('assets/mock/chart-data.json')
      .subscribe({
        next: (data) => {
          console.log('mock data loaded:', data);
          this.tableData = data.nodes;
          console.log('mock tableData loaded:', this.tableData);
          this.chartOptions = {
            title: { text: 'Energy Flow Lineage', left: 'center' },
            tooltip: { trigger: 'item', triggerOn: 'mousemove' },
            series: [
              {
                type: 'sankey',
                data: data.nodes,
                links: data.links,
                emphasis: { focus: 'adjacency' },
                lineStyle: { color: 'gradient', curveness: 0.5 },
                label: { color: '#333' },
              },
            ],
          };
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to load mock data', err);
          this.isLoading = false;
        },
      });
  }
}