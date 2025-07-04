import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import * as joint from 'jointjs';

@Component({
  selector: 'app-create-lineage',
  // standalone: true,
  // imports: [],
  templateUrl: './create-lineage.component.html',
  styleUrl: './create-lineage.component.scss'
})
export class CreateLineageComponent {
  @ViewChild('paperContainer', { static: false }) paperContainer!: ElementRef;
  @Input() inboundFields: any[] = [];
@Input() outboundFields: any[] = [];
 private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  private elementsMap: { [id: string]: joint.dia.Element } = {};
  
  // inboundFields = [
  //   { interface: 'Interface 1', fieldId: 1, fieldName: 'A', dataType: 'Num', length: 10 },
  //   { interface: 'Interface 1', fieldId: 2, fieldName: 'B', dataType: 'Alphanum', length: 28 },
  //   { interface: 'Interface 2', fieldId: 2, fieldName: 'H', dataType: 'Alphanum', length: 28 },
  //   { interface: 'System', fieldId: 1, fieldName: 'K', dataType: 'Num', length: 25 },
  //   { interface: 'System', fieldId: 2, fieldName: 'L', dataType: 'Alphanum', length: 28 },
  // ];
  
  // outboundFields = [
  //   { interface: 'Interface 1', fieldId: 1, fieldName: 'A', dataType: 'Num', length: 10 },
  //   { interface: 'Interface 3', fieldId: 1, fieldName: 'G', dataType: 'Num', length: 10 },
  //   { interface: 'Target 1', fieldId: 1, fieldName: 'G', dataType: 'Num', length: 10 },
  //   { interface: 'Target 2', fieldId: 2, fieldName: 'H', dataType: 'Alphanum', length: 28 },
  // ];
  ngOnChanges(): void {
    if (this.inboundFields.length || this.outboundFields.length) {
      this.renderFields();
    }
  }
  
  links: any[] = []; // Store link data
  ngAfterViewInit(): void {
      this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
    
      this.paper = new joint.dia.Paper({
        el: this.paperContainer.nativeElement,
        model: this.graph,
        width: 1000,
        height: 600,
        gridSize: 10,
        // interactive: true,
        interactive: (cellView) => {
          const cell = cellView.model;
      
          // ✅ Check for custom tag
          if (cell.get('customType') === 'inbound') {
            return { elementMove: false }; // disable movement
          }
      
          return true; // allow interaction for all others
        },
        linkPinning: false,
        snapLinks: { radius: 75 },
        defaultConnector: { name: 'rounded' },
        defaultConnectionPoint: { name: 'boundary' },
        defaultLink: () =>
          new joint.shapes.standard.Link({
            attrs: {
              line: {
                stroke: '#5c9ded',
                strokeWidth: 2,
                targetMarker: {
                  type: 'path',
                  d: 'M 10 -5 0 0 10 5 z',
                },
              },
            },
          }),
      });
    
      this.renderFields();
    
      // 🔗 Listen for link creation
      this.paper.on('link:connect', (linkView: any) => {
        const sourceId = linkView.model.get('source').id;
        const targetId = linkView.model.get('target').id;
    
        const sourceElement = this.graph.getCell(sourceId) as joint.dia.Element;
        const targetElement = this.graph.getCell(targetId) as joint.dia.Element;
    
        const from = sourceElement?.attributes?.attrs?.['label']?.text;
        const to = targetElement?.attributes?.attrs?.['label']?.text;
    
        if (from && to) {
          this.links.push({ from, to });
          console.log('🔗 New mapping:', from, '→', to);
        }
      });
    
      // 🧹 Optional: delete link on double click
      this.paper.on('link:pointerdblclick', (linkView: any) => {
        linkView.model.remove();
      });
    }
    
    renderFields(): void {
      const leftX = 50;
      const rightX = 800;
      const startY = 50;
      const spacing = 80;
    
      this.inboundFields.forEach((field, i) => {
        const label = `${field.interface} | ${field.fieldName}`;
        const rect = new joint.shapes.standard.Rectangle({
          position: { x: leftX, y: startY + i * spacing },
          size: { width: 150, height: 40 },
          attrs: {
            body: { fill: '#d1e8ff', stroke: '#333' },
            label: { text: label, fill: '#000' },
          },
          ports: {
            groups: {
              out: {
                position: 'right',
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#000',
                    fill: '#fff',
                  },
                },
              },
            },
            items: [{ id: 'out', group: 'out' }],
          },
        });
  
        // ✅ Tag this element as inbound
        rect.set('customType', 'inbound');
  
        rect.addTo(this.graph);
        this.elementsMap['in-' + i] = rect;
      });
    
      this.outboundFields.forEach((field, i) => {
        const label = `${field.interface} | ${field.fieldName}`;
        const rect = new joint.shapes.standard.Rectangle({
          position: { x: rightX, y: startY + i * spacing },
          size: { width: 150, height: 40 },
          attrs: {
            body: { fill: '#d1ffd1', stroke: '#333' },
            label: { text: label, fill: '#000' },
          },
          ports: {
            groups: {
              in: {
                position: 'left',
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#000',
                    fill: '#fff',
                  },
                },
              },
            },
            items: [{ id: 'in', group: 'in' }],
          },
        });
        rect.addTo(this.graph);
        this.elementsMap['out-' + i] = rect;
      });
    }
    
    saveMappings(): void {
      console.log('💾 Saved Mappings:', this.links);
      alert('Mappings saved. '+  this.links[0].from +' - '+ this.links[0].to +' || '+ this.links[1].from +' - '+ this.links[1].to+' || '+ this.links[2].from +' - '+ this.links[2].to+' || '+ this.links[3].from +' - '+ this.links[3].to+' || '+ this.links[4].from +'-'+ this.links[4].to);
    }
  
}
