import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nodes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
})
export class NodesComponent {
  search = '';

 blocks = [
  {
    type: 'SingleBlock',
    label: 'Source',
    icon: '<i class="fa fa-database" aria-hidden="true"></i>',
    typeName: 'Source',
    color: '#fff',
    size: { width: 120, height: 40 },
    ports: [
      { id: 'out1', group: 'out', attrs: { portLabel: { text: '', fontSize: 14, fill: '#00FA00' } } }
    ],
    options: ['Trade ID', 'Order Ref', 'Exec Time']
  },
  {
    type: 'SingleBlock',
    label: 'System',
    icon: '<i class="fa fa-cogs" aria-hidden="true"></i>',
    typeName: 'System',
    color: '#fff',
    size: { width: 120, height: 40 },
    ports: [
      { id: 'in1', group: 'in', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } },
      { id: 'out2', group: 'out', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } }
    ],
    options: ['Validation Engine', 'Sanitization', 'Enrichment']
  },
  {
    type: 'SingleBlock',
    label: 'Controls',
    icon: '<i class="fa fa-sliders" aria-hidden="true"></i>',
    typeName: 'Controls',
    color: '#fff',
    size: { width: 120, height: 40 },
    ports: [
      { id: 'in2', group: 'in', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } },
      { id: 'out3', group: 'out', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } }
    ],
    options: ['Threshold Check', 'Rule Evaluation', 'Trigger Alerts']
  },
  {
    type: 'SingleBlock',
    label: 'Target',
    icon: '<i class="fa fa-bullseye" aria-hidden="true"></i>',
    typeName: 'Target',
    color: '#fff',
    size: { width: 200, height: 40 },
    ports: [
      {
        id: 'in4',
        group: 'in',
        args: { x: 25, y: 50 },
        attrs: { portLabel: { text: 'Report Status', fill: '#000', fontSize: 14,  event: 'port:reportStatus' } },
       
      },
      {
        id: 'in5',
        group: 'in',
        args: { x: 25, y: 80 },
        attrs: { portLabel: { text: 'Transaction Reference', fill: '#000', fontSize: 14,   event: 'port:transactionReference' } },
      
      },
      {
        id: 'in6',
        group: 'in',
        args: { x: 25, y: 110 },
        attrs: { portLabel: { text: 'Trading Venue', fill: '#000', fontSize: 14,  event: 'port:tradingVenue' } },
       
      }
    ],
    options: ['RTS 22', 'MiFIR', 'EMIR']
  }
];

  dragStart(event: DragEvent, block: any) {
    event.dataTransfer?.setData('block', JSON.stringify(block));
  }
}
