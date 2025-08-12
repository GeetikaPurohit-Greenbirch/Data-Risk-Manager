import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import * as joint from 'jointjs';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';

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
@Input() systemId!: number; // or number
// @Input() showsystemMapping: any;
 private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  public mappingId:any;
  private pendingRender = false;
  private graphInitialized = false;

  private elementsMap: { [id: string]: joint.dia.Element } = {};
   constructor(
        private datafieldsService: DatafieldsService,
          private toastNotificationService: ToastnotificationService,
      
    ) {}


  ngOnInIt()
  {
    this.renderFields();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      (changes['systemId'] && changes['systemId'].currentValue) ||
      (changes['inboundFields'] && changes['inboundFields'].currentValue) ||
      (changes['outboundFields'] && changes['outboundFields'].currentValue)
    ) {
      if (this.graphInitialized) {
        this.renderFields();
      } else {
        this.pendingRender = true;
      }
    }
  }

  ngAfterViewInit() {
    // Delay to ensure DOM is ready
    setTimeout(() => {
      this.initGraph();
      if (this.pendingRender) {
        this.renderFields();
        this.pendingRender = false;
      }
    });
  }

  private initGraph() {
    const container = document.getElementById('paper-container');
    if (!container) {
      console.error('Graph container not found. Check template for #paper-container element.');
      return;
    }

    this.graph = new joint.dia.Graph();
    // this.paper = new joint.dia.Paper({
    //   el: container,
    //   model: this.graph,
    //   width: 1000,
    //   height: 600,
    //   gridSize: 10
    // });

    this.graphInitialized = true;
    console.log('Graph initialized');

    this.paper = new joint.dia.Paper({
          el: container,
          model: this.graph,
          width: 1200,
          height: 600,
          gridSize: 10,
          interactive: (cellView) => {
            const cell = cellView.model;
            if (cell.get('customType') === 'inbound') {
              return { elementMove: false }; // disable moving inbound fields
            }
            return true;
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
      
        // 2️⃣ Render fields and then load saved links
        this.renderFields();
        setTimeout(() => {
          this.loadAndRenderSavedLinks(); // should populate saved mappings
        }, 0);
      
        // 3️⃣ On new link creation → store mapping in `this.links`
        this.paper.on('link:connect', (linkView: any) => {
          const sourceId = linkView.model.get('source').id;
          const targetId = linkView.model.get('target').id;
      
          const sourceElement = this.graph.getCell(sourceId) as joint.dia.Element;
          const targetElement = this.graph.getCell(targetId) as joint.dia.Element;
      
          const from = sourceElement?.attributes?.attrs?.['label']?.text;
          const to = targetElement?.attributes?.attrs?.['label']?.text;
      
          if (from && to) {
            this.links.push({ from, to }); // mappingId will be added only after save
            console.log('🔗 New mapping:', from, '→', to);
          }
        });
      
        // 4️⃣ Show delete (X) tool on link hover using linkTools
        this.paper.on('link:mouseenter', (linkView: any) => {
          const customDeleteTool = new joint.linkTools.Button({
            markup: [{
              tagName: 'circle',
              selector: 'button',
              attributes: {
                r: 10,
                fill: '#f44336',
                stroke: '#fff',
                'stroke-width': 2,
                cursor: 'pointer'
              }
            }, {
              tagName: 'text',
              textContent: 'X',
              selector: 'icon',
              attributes: {
                fill: '#fff',
                'font-size': 12,
                'text-anchor': 'middle',
                y: 4,
                cursor: 'pointer'
              }
            }],
            distance: '50%',
            action: (evt: any, linkView: any) => {
              evt.stopPropagation(); // prevent native removal
        
              const link = linkView.model;
              const sourceId = link.get('source')?.id;
              const targetId = link.get('target')?.id;
        
              const sourceElement = this.graph.getCell(sourceId) as joint.dia.Element;
              const targetElement = this.graph.getCell(targetId) as joint.dia.Element;
        
              const fromLabel = sourceElement?.attr('label/text');
              const toLabel = targetElement?.attr('label/text');
        
              const mapping = this.links.find(
                l => l.from === fromLabel && l.to === toLabel
              );
        
              const confirmed = confirm(`Do you really want to delete mapping:\n${fromLabel} → ${toLabel}?`);
              if (confirmed) {
                if (mapping?.mappingId) {
                  // ✅ Saved mapping: call delete API
                  this.datafieldsService.deleteFieldMapping(mapping?.mappingId).subscribe((res:string) => {
                    alert(res);
                    link.remove();
                    this.links = this.links.filter(l => l.mappingId !== mapping?.mappingId);
                  });
                } else {
                  // ❌ Not yet saved: just remove
                  link.remove();
                  this.links = this.links.filter(l => l.from !== fromLabel || l.to !== toLabel);
                }
              }
            }
          });
        
          const toolsView = new joint.dia.ToolsView({
            tools: [customDeleteTool]
          });
        
          linkView.addTools(toolsView);
        });
        
      
        // 5️⃣ Remove delete tool on mouse leave
        this.paper.on('link:mouseleave', (linkView: any) => {
          linkView.removeTools();
        });
      
      
        // 7️⃣ Optional: fallback manual delete on double click
        this.paper.on('link:pointerdblclick', (linkView: any) => {
          linkView.model.remove();
        });
  }

  
  links: any[] = []; // Store link data
  // ngAfterViewInit(): void {
  //   // 1️⃣ Initialize graph and paper
  //   this.graph = new joint.dia.Graph({}, { cellNamespace: joint.shapes });
  
  //   this.paper = new joint.dia.Paper({
  //     el: this.paperContainer.nativeElement,
  //     model: this.graph,
  //     width: 1200,
  //     height: 600,
  //     gridSize: 10,
  //     interactive: (cellView) => {
  //       const cell = cellView.model;
  //       if (cell.get('customType') === 'inbound') {
  //         return { elementMove: false }; // disable moving inbound fields
  //       }
  //       return true;
  //     },
  //     linkPinning: false,
  //     snapLinks: { radius: 75 },
  //     defaultConnector: { name: 'rounded' },
  //     defaultConnectionPoint: { name: 'boundary' },
  //     defaultLink: () =>
  //       new joint.shapes.standard.Link({
  //         attrs: {
  //           line: {
  //             stroke: '#5c9ded',
  //             strokeWidth: 2,
  //             targetMarker: {
  //               type: 'path',
  //               d: 'M 10 -5 0 0 10 5 z',
  //             },
  //           },
  //         },
  //       }),
  //   });
  
  //   // 2️⃣ Render fields and then load saved links
  //   this.renderFields();
  //   setTimeout(() => {
  //     this.loadAndRenderSavedLinks(); // should populate saved mappings
  //   }, 0);
  
  //   // 3️⃣ On new link creation → store mapping in `this.links`
  //   this.paper.on('link:connect', (linkView: any) => {
  //     const sourceId = linkView.model.get('source').id;
  //     const targetId = linkView.model.get('target').id;
  
  //     const sourceElement = this.graph.getCell(sourceId) as joint.dia.Element;
  //     const targetElement = this.graph.getCell(targetId) as joint.dia.Element;
  
  //     const from = sourceElement?.attributes?.attrs?.['label']?.text;
  //     const to = targetElement?.attributes?.attrs?.['label']?.text;
  
  //     if (from && to) {
  //       this.links.push({ from, to }); // mappingId will be added only after save
  //       console.log('🔗 New mapping:', from, '→', to);
  //     }
  //   });
  
  //   // 4️⃣ Show delete (X) tool on link hover using linkTools
  //   this.paper.on('link:mouseenter', (linkView: any) => {
  //     const customDeleteTool = new joint.linkTools.Button({
  //       markup: [{
  //         tagName: 'circle',
  //         selector: 'button',
  //         attributes: {
  //           r: 10,
  //           fill: '#f44336',
  //           stroke: '#fff',
  //           'stroke-width': 2,
  //           cursor: 'pointer'
  //         }
  //       }, {
  //         tagName: 'text',
  //         textContent: 'X',
  //         selector: 'icon',
  //         attributes: {
  //           fill: '#fff',
  //           'font-size': 12,
  //           'text-anchor': 'middle',
  //           y: 4,
  //           cursor: 'pointer'
  //         }
  //       }],
  //       distance: '50%',
  //       action: (evt: any, linkView: any) => {
  //         evt.stopPropagation(); // prevent native removal
    
  //         const link = linkView.model;
  //         const sourceId = link.get('source')?.id;
  //         const targetId = link.get('target')?.id;
    
  //         const sourceElement = this.graph.getCell(sourceId) as joint.dia.Element;
  //         const targetElement = this.graph.getCell(targetId) as joint.dia.Element;
    
  //         const fromLabel = sourceElement?.attr('label/text');
  //         const toLabel = targetElement?.attr('label/text');
    
  //         const mapping = this.links.find(
  //           l => l.from === fromLabel && l.to === toLabel
  //         );
    
  //         const confirmed = confirm(`Do you really want to delete mapping:\n${fromLabel} → ${toLabel}?`);
  //         if (confirmed) {
  //           if (mapping?.mappingId) {
  //             // ✅ Saved mapping: call delete API
  //             this.datafieldsService.deleteFieldMapping(mapping?.mappingId).subscribe((res:string) => {
  //               alert(res);
  //               link.remove();
  //               this.links = this.links.filter(l => l.mappingId !== mapping?.mappingId);
  //             });
  //           } else {
  //             // ❌ Not yet saved: just remove
  //             link.remove();
  //             this.links = this.links.filter(l => l.from !== fromLabel || l.to !== toLabel);
  //           }
  //         }
  //       }
  //     });
    
  //     const toolsView = new joint.dia.ToolsView({
  //       tools: [customDeleteTool]
  //     });
    
  //     linkView.addTools(toolsView);
  //   });
    
  
  //   // 5️⃣ Remove delete tool on mouse leave
  //   this.paper.on('link:mouseleave', (linkView: any) => {
  //     linkView.removeTools();
  //   });
  
  
  //   // 7️⃣ Optional: fallback manual delete on double click
  //   this.paper.on('link:pointerdblclick', (linkView: any) => {
  //     linkView.model.remove();
  //   });
  // }
  
  
    
    renderFields(): void {
      const leftX = 50;
      const rightX = 800;
      const startY = 50;
      const spacing = 80;
    
      this.inboundFields.forEach((field, i) => {
        const label = `${field.interface} | ${field.fieldName} | ${field.fieldId}`;
        const rect = new joint.shapes.standard.Rectangle({
          position: { x: leftX, y: startY + i * spacing },
          size: { width: 200, height: 40 },
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
        rect.set('customFieldId', field.fieldId);
  
        rect.addTo(this.graph);
        this.elementsMap['in-' + i] = rect;
      });
    
      this.outboundFields.forEach((field, i) => {
        const label = `${field.interface} | ${field.fieldName} | ${field.fieldId}`;
        const rect = new joint.shapes.standard.Rectangle({
          position: { x: rightX, y: startY + i * spacing },
          size: { width: 200, height: 40 },
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

        rect.set('customFieldId', field.fieldId);
        rect.addTo(this.graph);
        this.elementsMap['out-' + i] = rect;
      });
    }
    
    saveMappings(): void {
      const systemId = this.systemId; // Replace with your actual system ID if dynamic
    
      const formattedLinks = this.links.map(link => {
        const fromField = this.inboundFields.find(
          f => `${f.interface} | ${f.fieldName} | ${f.fieldId}` === link.from
        );
        const toField = this.outboundFields.find(
          f => `${f.interface} | ${f.fieldName} | ${f.fieldId}` === link.to
        );
    
        if (fromField && toField) {
          return {
            p_field_id: fromField.fieldId,
            c_field_id: toField.fieldId,
            system_id: systemId
          };
        }
    
        return null;
      }).filter(link => link !== null); // remove nulls for unmatched
    
      console.log('💾 Final Mappings Payload:', formattedLinks);
      this.datafieldsService.saveFieldMapping(formattedLinks).subscribe({
        next: (res:string) => {
        alert(res);
      },
      error: (err) => {
        console.error('Error saving mappingd:', err);
        alert('Failed to save field mapping.');
      }
    });
  
   
    }

    deleteMappings()
    {
      const confirmed = confirm('Do you really want to delete all mappings?');

      if (!confirmed) return; // User canceled
    
      this.datafieldsService.deleteAllSystemMapping(this.systemId).subscribe({
        next: (res: string) => {
          alert(res);
    
          // ✅ 1. Remove all links from the graph
          this.graph.getLinks().forEach(link => {
            link.remove();
          });
    
          // ✅ 2. Clear local mapping data
          this.links = [];
        },
        error: (err) => {
          console.error('Error deleting mappings:', err);
          alert('Failed to delete system mappings.');
        }
      });
    }

    loadAndRenderSavedLinks(): void {
      
      this.datafieldsService.getMappings(this.systemId).subscribe((mappings: any[]) => {
        mappings.forEach(mapping => {
          const pField = this.inboundFields.find(f => f.fieldId === mapping.p_field_id);
          const cField = this.outboundFields.find(f => f.fieldId === mapping.c_field_id);
    
          if (pField && cField) {
            const fromLabel = `${pField.interface} | ${pField.fieldName} | ${pField.fieldId}`;
            const toLabel = `${cField.interface} | ${cField.fieldName} | ${cField.fieldId}`;
            const mappingId = mapping.id;

            this.links.push({ from: fromLabel, to: toLabel, mappingId: mappingId });
    
            const sourceElement = Object.values(this.elementsMap).find(el =>
              el.get('customFieldId') === mapping.p_field_id
            );
            
            const targetElement = Object.values(this.elementsMap).find(el =>
              el.get('customFieldId') === mapping.c_field_id
            );
            
    
            if (sourceElement && targetElement) {
              const link = new joint.shapes.standard.Link();
              link.source(sourceElement, { port: 'out' });
              link.target(targetElement, { port: 'in' });
              link.attr({
                line: {
                  stroke: '#5c9ded',
                  strokeWidth: 2,
                  targetMarker: {
                    type: 'path',
                    d: 'M 10 -5 0 0 10 5 z',
                  },
                },
              });
              link.addTo(this.graph);
            }
          }
        });
    
        console.log('🔄 Restored Mappings:', this.links);
      });
    }
    
    
  
}
