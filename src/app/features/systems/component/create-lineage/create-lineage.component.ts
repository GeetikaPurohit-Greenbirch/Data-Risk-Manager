import { Component, ElementRef, EventEmitter, Inject, Input, Output, SimpleChanges, ViewChild } from '@angular/core';
import * as joint from 'jointjs';
import { DatafieldsService } from 'src/app/features/shared-services/datafields.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { Link, Constant, Concat, GetDate, Record } from '../../../graph-embedded/component/diagram/shapes.component';
import { shapes, util, dia, ui } from '@joint/plus';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

type Records = Constant | Concat | GetDate | Record;


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

@Output() closePopup = new EventEmitter<void>();  // 👈 output event

// @Input() showsystemMapping: any;
private __autoScrollCleanup: (() => void) | undefined;

 private graph!: joint.dia.Graph;
  private paper!: joint.dia.Paper;
  public mappingId:any;
  private pendingRender = false;
  private graphInitialized = false;

  private elementsMap: { [id: string]: joint.dia.Element } = {};
   constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
        private datafieldsService: DatafieldsService,
          private toastNotificationService: ToastnotificationService,
          private dialogRef: MatDialogRef<CreateLineageComponent>,   // 👈 reference to dialog
    ) {
      this.inboundFields = data.inboundFields;
      this.outboundFields = data.outboundFields;
      this.systemId = data.systemId;
    }


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
  

  closeDialog(): void {
    this.dialogRef.close();   // 👈 closes the dialog
  }


  private initGraph() {
    const container = document.getElementById('paper-container');
    if (!container) {
      console.error('Graph container not found. Check template for #paper-container element.');
      return;
    }
  
    this.graph = new joint.dia.Graph();
    this.paper = new joint.dia.Paper({
      el: container,
      model: this.graph,
      width: 2000,
      height: '100%',
      gridSize: 10,
      async: true,
      drawGrid: true,
      interactive: (cellView) => {
        const cell = cellView.model;
        if (cell.get('customType') === 'inbound' || cell.get('customType') === 'outbound') {
          return { elementMove: true };
        }
        return true;
      },
      linkPinning: false,
      snapLinks: { radius: 75 },
      defaultConnector: { name: 'smooth' },
      defaultConnectionPoint: { name: 'boundary' },
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
    });
  
    this.graphInitialized = true;
// Helper: find nearest scrollable ancestor (overflow-y auto/scroll)
const findScrollParent = (el: HTMLElement | null): HTMLElement | null => {
  let parent = el?.parentElement || null;
  while (parent) {
    const style = window.getComputedStyle(parent);
    const overflowY = style.overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') return parent;
    // common dialog/content wrappers
    if (parent.classList.contains('mat-dialog-content') || parent.classList.contains('paper-wrapper')) {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document.scrollingElement as HTMLElement | null;
};

const scrollContainer = findScrollParent(container) || document.scrollingElement as HTMLElement;
if (!scrollContainer) {
  console.warn('Auto-scroll: no scrollable parent found — auto-scroll disabled.');
} else {
  // state
  let pointerDown = false;
  let autoScrollInterval: number | null = null;
  let currentDx = 0;
  let currentDy = 0;

  // configuration
  const EDGE_MARGIN = 80; // px to edge to start scrolling
  const SCROLL_SPEED = 20; // px per tick
  const TICK_MS = 40;

  const stopAutoScroll = () => {
    if (autoScrollInterval !== null) {
      window.clearInterval(autoScrollInterval);
      autoScrollInterval = null;
      currentDx = 0;
      currentDy = 0;
    }
  };

  const startAutoScrollIfNeeded = () => {
    if (autoScrollInterval === null && (currentDx !== 0 || currentDy !== 0)) {
      autoScrollInterval = window.setInterval(() => {
        if (currentDy !== 0) {
          scrollContainer.scrollTop += currentDy;
        }
        if (currentDx !== 0) {
          scrollContainer.scrollLeft += currentDx;
        }
      }, TICK_MS);
    } else if (currentDx === 0 && currentDy === 0) {
      stopAutoScroll();
    }
  };

  // Pointer down/up handlers (capture pointer down inside the paper)
  const onPointerDown = (ev: PointerEvent) => {
    // only left button start
    if (ev.button === 0) pointerDown = true;
  };
  const onPointerUp = () => {
    pointerDown = false;
    stopAutoScroll();
  };

  // Move handler: when pointer is down and inside paper, compute distance to scroll container edges
  const onPointerMove = (ev: PointerEvent) => {
    if (!pointerDown) return;

    const rect = scrollContainer.getBoundingClientRect();
    // Use client coords
    if (ev.clientY > rect.bottom - EDGE_MARGIN) {
      currentDy = SCROLL_SPEED;
    } else if (ev.clientY < rect.top + EDGE_MARGIN) {
      currentDy = -SCROLL_SPEED;
    } else {
      currentDy = 0;
    }

    if (ev.clientX > rect.right - EDGE_MARGIN) {
      currentDx = SCROLL_SPEED;
    } else if (ev.clientX < rect.left + EDGE_MARGIN) {
      currentDx = -SCROLL_SPEED;
    } else {
      currentDx = 0;
    }

    startAutoScrollIfNeeded();
  };

  // Attach listeners
  // pointer events are preferable, but add mouse fallback
  container.addEventListener('pointerdown', onPointerDown, { passive: true });
  window.addEventListener('pointerup', onPointerUp, { passive: true });
  window.addEventListener('pointermove', onPointerMove);

  // Fallback for browsers without pointer events (optional)
  // container.addEventListener('mousedown', onPointerDown, { passive: true });
  window.addEventListener('mouseup', onPointerUp, { passive: true });
  // window.addEventListener('mousemove', onPointerMove);

  // Save references so we can remove them later
  this.__autoScrollCleanup = () => {
    container.removeEventListener('pointerdown', onPointerDown);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointermove', onPointerMove);
    // container.removeEventListener('mousedown', onPointerDown);
    window.removeEventListener('mouseup', onPointerUp);
    // window.removeEventListener('mousemove', onPointerMove);
    stopAutoScroll();
  };
}
  // ⬆️ END AUTO SCROLL
    console.log('Graph initialized');
  
    const resizePaper = () => {
      const bbox = this.graph.getBBox();
      if (bbox) {
        this.paper.setDimensions(
          Math.max(container.clientWidth, bbox.width + 100),
          Math.max(container.clientHeight, bbox.height + 100)
        );
      }
    };
  
    // Call after elements are rendered
    // ✅ Call `renderFields()` only once.
    this.renderFields(); 
    setTimeout(() => {
      const bbox = this.graph.getBBox();
      if (bbox) {
        this.paper.setDimensions(
          Math.max(container.clientWidth, bbox.width + 100),
          Math.max(container.clientHeight, bbox.height + 100)
        );
      }
      this.loadAndRenderSavedLinks();
    }, 100);
  
    // ✅ Make sure canvas resizes on window resize
    // window.addEventListener('resize', () => {
    //   this.paper.setDimensions(container.clientWidth, container.clientHeight);
    // });
  
    // 3️⃣ On new link creation → store mapping in `this.links`
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
  
     // 1️⃣ Add a listener to remove tools when clicking on a blank spot
  this.paper.on('blank:pointerdown', () => {
    this.paper.hideTools(); // This method is not available in jointjs, see note below
    // Correct way for jointjs:
    this.graph.getLinks().forEach((link) => {
      const linkView = this.paper.findViewByModel(link);
      if (linkView && linkView.hasTools()) {
        linkView.removeTools();
      }
    });
  });

  // 2️⃣ Handle link interaction
  this.paper.on('link:mouseenter', (linkView, evt) => {
    evt.stopPropagation();
    
    // // Correct way for jointjs: clear existing tools first
    // this.graph.getLinks().forEach((link) => {
    //   const existingLinkView = this.paper.findViewByModel(link);
    //   if (existingLinkView && existingLinkView.hasTools()) {
    //     existingLinkView.removeTools();
    //   }
    // });

    // 4️⃣ Show delete (X) tool on link hover using linkTools
    // this.paper.on('link:mouseenter', (linkView: any) => {
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
          evt.stopPropagation();
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
              this.datafieldsService.deleteFieldMapping(mapping?.mappingId).subscribe((res: string) => {
                alert(res);
                link.remove();
                this.links = this.links.filter(l => l.mappingId !== mapping?.mappingId);
              });
            } else {
              link.remove();
              this.links = this.links.filter(l => l.from !== fromLabel || l.to !== toLabel);
            }
          }
        }
      });
        // Create the vertices tool
    const verticesTool = new joint.linkTools.Vertices();

    // Create a ToolsView instance and add the tools to it
    const toolsView = new joint.dia.ToolsView({
      tools: [customDeleteTool, verticesTool]
    });

    // Add the ToolsView to the link
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
  
    this.paper.on('blank:mousewheel', (evt, x, y, delta) => {
      evt.preventDefault();
      const oldScale = this.paper.scale().sx;
      const newScale = oldScale + delta * 0.1;
      if (newScale > 0.2 && newScale < 2) {
        this.paper.scale(newScale, newScale);
      }
    });
  }

  
  links: any[] = []; // Store link data
   
    
    renderFields(): void {
      const leftX = 50;
      const rightX = 800;
      const startY = 50;
      const spacing = 80;
    
      this.inboundFields.forEach((field, i) => {
        field.portId = generateUUID(); // add port UUID to field object

        const label = `Interface Name : ${field.interface}\nField ID : ${field.fieldId}\nField Name : ${field.fieldName}`;
        const rect = new joint.shapes.standard.Rectangle({
          position: { x: leftX, y: startY + i * spacing },
          size: { width: 300, height: 60 },
          markup: [
            { tagName: 'rect', selector: 'body' },
            { tagName: 'image', selector: 'image' },  // 👈 add icon element
            { tagName: 'text', selector: 'label' }
          ],
          attrs: {
            body: {
              fill: '#ffffff',
              stroke: '#008080', // teal/green border
              strokeWidth: 2,
              rx: 6, // rounded corners
              ry: 6
            },
           // Add image (icon from assets)
            // image: {
            //   'xlink:href': 'assets/images/icons-random-48.png', // <-- your assets path
            //   width: 18,
            //   height: 24,
            //   x: 6,
            //   y: 10,
            // },
            
            label: {
              text: label,
              fill: '#333',
              fontSize: 12,
              fontWeight: 'bold',
              x: 8,
              refX: 28, // offset right after the icon
              refY: 22,
              textAnchor: 'start',
              style: {
                whiteSpace: 'pre'   // 👈 preserves line breaks
              },
              textWrap: {
                width: -20,   // available width inside the rect
                height: 'auto',
                ellipsis: false
              }
            }
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
            items: [{ id: field.portId, group: 'out' }],
          },
        });

       
        
        // this.graph.addCell(interfaceHeader);
     
          // 1️⃣ Add element to graph first
          this.graph.addCell(rect);

          // 2️⃣ Wait for the paper to render before measuring
          setTimeout(() => {
            const view = this.paper.findViewByModel(rect);
            if (view) {
              const labelEl = view.el.querySelector('text'); // SVG <text> element
              if (labelEl) {
                const bbox = labelEl.getBBox();
                // 3️⃣ Resize rect height according to text
                rect.resize(300, bbox.height + 10); // +20 for padding
              }
            }
          }, 0);
        
  
        // ✅ Tag this element as inbound
        rect.set('customType', 'inbound');
        rect.set('customFieldId', field.portId);
        // rect.set('movable', false);
  
        rect.addTo(this.graph);
        this.elementsMap['in-' + i] = rect;
      });
    
      this.outboundFields.forEach((field, i) => {
        field.portId = generateUUID(); // add port UUID to field object

        const label = `Interface Name : ${field.interface}\nField ID : ${field.fieldId}\nField Name : ${field.fieldName}`;
        const rect = new joint.shapes.standard.Rectangle({
          position: { x: rightX, y: startY + i * spacing },
          size: { width: 300, height: 60 },
          markup: [
            { tagName: 'rect', selector: 'body' },
            { tagName: 'image', selector: 'image' },  // 👈 add icon element
            { tagName: 'text', selector: 'label' }
          ],
          attrs: {
            body: {
              fill: '#ffffff',
              stroke: '#008080', // teal/green border
              strokeWidth: 2,
              rx: 6, // rounded corners
              ry: 6
            },
            // image: {
            //   'xlink:href': 'assets/images/icons-random-48.png', // <-- your assets path
            //   width: 18,
            //   height: 24,
            //   x: 10,
            //   y: 17,
            // },
            label: {
              text: label,
              fill: '#333',
              fontSize: 12,
              fontWeight: 'bold',
              refX: 10,       // left padding
              refY: '50%',    // center vertically in rect
              textAnchor: 'start',
              textVerticalAnchor: 'middle', // 👈 keeps multiline text centered vertically
              style: {
                whiteSpace: 'pre',          // preserve line breaks
                lineHeight: '1.4em'         // add spacing between lines
              },
              textWrap: {
                width: 300,   // available width inside the rect
                height: 'auto',
                ellipsis: false
              }
            }
          },
          ports: {
            groups: {
              in: {
                position: 'left',
                attrs: {
                  circle: {
                    r: 6,
                    magnet: true,
                    stroke: '#008080',
                    fill: '#fff',
                  },
                },
              },
            },
            items: [{id: field.portId, group: 'in'}],
          },
        });

          // 1️⃣ Add element to graph first
          this.graph.addCell(rect);

          // 2️⃣ Wait for the paper to render before measuring
          setTimeout(() => {
            const view = this.paper.findViewByModel(rect);
            if (view) {
              const labelEl = view.el.querySelector('text'); // SVG <text> element
              if (labelEl) {
                const bbox = labelEl.getBBox();
                // 3️⃣ Resize rect height according to text
                rect.resize(320, bbox.height + 10); // +20 for padding
              }
            }
          }, 0);

          rect.set('customType', 'outbound');
        rect.set('customFieldId', field.portId);
        rect.addTo(this.graph);
        this.elementsMap['out-' + i] = rect;
      });
    }
    
    saveMappings(): void {
      const systemId = this.systemId; // Replace with your actual system ID if dynamic
    
      const formattedLinks = this.links.map(link => {
        const fromField = this.inboundFields.find(
          f => `Interface Name : ${f.interface}\nField ID : ${f.fieldId}\nField Name : ${f.fieldName}` === link.from
        );
        const toField = this.outboundFields.find(
          f => `Interface Name : ${f.interface}\nField ID : ${f.fieldId}\nField Name : ${f.fieldName}` === link.to
        );
    
        if (fromField && toField) {
          return {
            p_field_id: fromField.fieldId,
            p_field_uuid: fromField.portId, // UUID from array
            c_field_id: toField.fieldId,
            c_field_uuid: toField.portId, 
            system_id: systemId
          };
        }
    
        return null;
      }).filter(link => link !== null); // remove nulls for unmatched
    
      console.log('💾 Final Mappings Payload:', formattedLinks);
      this.datafieldsService.saveFieldMapping(formattedLinks).subscribe({
        next: (res:string) => {
        alert(res);
        this.closeDialog();
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
            const fromLabel = `Interface Name : ${pField.interface}\nField ID : ${pField.fieldId}\nField Name : ${pField.fieldName}`;
            const toLabel = `Interface Name : ${cField.interface}\nField ID : ${cField.fieldId}\nField Name : ${cField.fieldName}`;
            const mappingId = mapping.id;

            this.links.push({ from: fromLabel, p_field_uuid: mapping.p_field_uuid, to: toLabel, c_field_uuid: mapping.c_field_uuid, mappingId: mappingId });
    
            const sourceElement = Object.values(this.elementsMap).find(el =>
              el.get('customFieldId') === pField.portId
            );
            
            const targetElement = Object.values(this.elementsMap).find(el =>
              el.get('customFieldId') === cField.portId
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
    
    // ngOnDestroy
ngOnDestroy(): void {
  if (this.__autoScrollCleanup) {
    this.__autoScrollCleanup();
    this.__autoScrollCleanup = undefined;
  }
  // window.removeEventListener('resize', /* if you added one earlier */);
  
}
}
function generateUUID() {
  return 'xxxx-xxxx-xxxx-xxxx'.replace(/[x]/g, () =>
    Math.floor(Math.random() * 16).toString(16)
  );
}


function getWrappedTextHeight(text: string, width: number, font: string = 'bold 12px Arial') {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  div.style.width = `${width}px`;
  div.style.font = font;
  div.style.lineHeight = '16px';
  div.style.whiteSpace = 'normal';
  div.style.wordBreak = 'break-word';
  div.innerText = text;
  document.body.appendChild(div);
  const height = div.offsetHeight;
  document.body.removeChild(div);
  return height;
}



