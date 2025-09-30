import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { Link, Constant, Concat, GetDate, Record } from '../../../graph-embedded/component/diagram/shapes.component';
import * as joint from 'jointjs';

// ✅ import from @joint/plus
import { dia, shapes, elementTools, ui } from '@joint/plus';
// import * as joint from '@joint/plus/joint-plus';

type Records = Constant | Concat | GetDate | Record;

@Component({
  selector: 'app-create-lineage-new',
  template: `<div #paperContainer class="mapping-container"></div>`,
  styles: [`
    .mapping-container {
      width: 100%;
      height: 600px;
      border: 1px solid #ccc;
    }
  `]
})
export class CreateLineageNewComponent {
  @ViewChild('paperContainer', { static: true }) paperContainer!: ElementRef;
  @Input() inboundFields: any[] = [];
  @Input() outboundFields: any[] = [];
  @Input() systemId!: number; // or number
  private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;

  ngAfterViewInit(): void {
    this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });

    this.paper = new joint.dia.Paper({
      el: this.paperContainer.nativeElement,
      model: this.graph,
      width: 1200,
      height: 600,
      gridSize: 1,
      background: { color: '#f8f9fa' },
      interactive: (cellView) => {
        const cell = cellView.model;
        if (cell.get('customType') === 'inbound' || cell.get('customType') === 'outbound') {
          return { elementMove: false };
        }
        return true;
      },
     defaultLink: () => new joint.shapes.standard.Link({
             attrs: {
               line: {
                 stroke: '#ff9800',
                 strokeWidth: 2,
                 strokeDasharray: '4 2',
                 targetMarker: {
                   type: 'path',
                   d: 'M 10 -5 0 0 10 5 z',
                   fill: '#ff9800'
                 }
               }
             }
           }),
           validateConnection: (srcView, srcMagnet, tgtView, tgtMagnet) => {
            return !!srcMagnet && !!tgtMagnet;
          }
    });

    this.renderTables();
  }

  private renderTables(): void {
    const inboundFields = [
      { id: 'IN1', name: 'Customer ID' },
      { id: 'IN2', name: 'Order Date' },
      { id: 'IN3', name: 'Amount' }
    ];

    const outboundFields = [
      { id: 'OUT1', name: 'Client Identifier' },
      { id: 'OUT2', name: 'Purchase Date' },
      { id: 'OUT3', name: 'Total' }
    ];

    const inbound = this.createTable(
      'Inbound Interface',
      this.inboundFields,
      50, // left side
      50,
      '#ffcccc',
      'right' // inbound ports at right
    );

    const outbound = this.createTable(
      'Outbound Interface',
      this.outboundFields,
      600, // right side
      50,
      '#cce5ff',
      'left' // outbound ports at left
    );

    this.graph.addCells([inbound, outbound]);
  }
  private createTable(
    title: string,
    fields: { fieldId: string; fieldName: string }[],
    x: number,
    y: number,
    headerColor: string,
    portSide: 'left' | 'right'
  ): joint.dia.Element {
    const rowHeight = 40;
    const tableWidth = 300;
    const visibleRows = 8; // number of rows visible before scroll
    const scrollHeight = visibleRows * rowHeight;
  
    // Build rows markup inside <foreignObject>
    let rowsHtml = '';
    fields.forEach(f => {
      rowsHtml += `
        <div style="
          display: flex;
          flex-direction: row;
          border-bottom: 1px solid #ccc;
          height: ${rowHeight}px;
          align-items: center;
          font-size: 12px;
        ">
          <div style="width: 80px; flex-shrink: 0; padding-left: 5px;">${f.fieldId}</div>
          <div style="flex: 1; padding-left: 5px; word-wrap: break-word; white-space: normal; overflow-wrap: anywhere;">
            ${f.fieldName}
          </div>
        </div>
      `;
    });
  
    const markup = `
      <g>
        <!-- Outer body -->
        <rect class="body" width="${tableWidth}" height="${scrollHeight + 40}" fill="#fff" stroke="#333"/>
        <!-- Header -->
        <rect class="header" width="${tableWidth}" height="40" fill="${headerColor}" stroke="#333"/>
        <text class="header-text" x="10" y="25" font-size="14" font-weight="bold">${title}</text>
        <!-- Scrollable fields -->
        <foreignObject x="0" y="40" width="${tableWidth}" height="${scrollHeight}">
          <div xmlns="http://www.w3.org/1999/xhtml" style="
            width: 100%;
            height: 100%;
            overflow-y: auto;
            font-family: Arial, sans-serif;
          ">
            ${rowsHtml}
          </div>
        </foreignObject>
      </g>
    `;
  
    const TableElement = joint.dia.Element.define('custom.Table', {
      markup,
      size: { width: tableWidth, height: scrollHeight + 40 }
    });
  
    const table = new TableElement();
    table.position(x, y);
  
    // Add ports aligned with rows (even though rows are scrollable, ports must stay fixed relative to row index)
    const ports = fields.map((f, i) => {
      const yPos = 40 + (i % visibleRows) * rowHeight + rowHeight / 2; // align visible ports
      return { id: f.fieldId, group: 'list', args: { y: yPos } };
    });
  
    table.set('ports', {
      groups: {
        list: {
          position: { name: portSide },
          attrs: {
            circle: {
              r: 5,
              magnet: true,
              stroke: '#000',
              fill: '#fff'
            }
          }
        }
      },
      items: ports
    });
  
    return table;
  }
  
  
}