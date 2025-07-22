import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as joint from 'jointjs';
import { GraphService } from '../../services/graph.service';
import { MatDialog } from '@angular/material/dialog';
import { NodeDropModalComponent } from '../../../../node-drop-modal/node-drop-modal.component';

@Component({
  selector: 'app-diagram',
  standalone: true,
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {
  @ViewChild('paperContainer') paperContainer!: ElementRef;

  graph!: joint.dia.Graph;
  paper!: joint.dia.Paper;
  linkSource: joint.dia.Element | null = null;
  hasGraph: boolean = false;
  scale: number = 1;
  scaleDisplay: number = 100;

  constructor(
    private GraphService: GraphService,
    private dialog: MatDialog,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  private get processorShapes(): any {
    return (joint.shapes as any)?.processor?.Block;
  }



  tracePathToPort(targetElement: joint.dia.Element, portId: string) {
    const visited = new Set<string>();
    const pathElements: joint.dia.Element[] = [];
    const pathLinks: joint.dia.Link[] = [];

    const walk = (element: joint.dia.Element) => {
      if (visited.has(element.id.toString())) return;
      visited.add(element.id.toString());
      pathElements.push(element);

      const inboundLinks = this.graph.getConnectedLinks(element, { inbound: true });

      console.log(inboundLinks, "inboundLinks")

      inboundLinks.forEach(link => {
        const targetPort = link.get('target')?.port;
        if (element.id === link.get('target')?.id && targetPort === portId) {
          pathLinks.push(link);

          const sourceId = link.get('source')?.id;
          if (sourceId) {
            const sourceEl = this.graph.getCell(sourceId) as joint.dia.Element;
            if (sourceEl) {
              walk(sourceEl); // recurse back
            }
          }
        }
      });
    };

    walk(targetElement);

    // Clear existing highlights
    this.graph.getElements().forEach(el => {
      el.attr('body/stroke', '#708090');
      el.attr('body/strokeWidth', 1);
    });
    this.graph.getLinks().forEach(link => {
      link.attr('line/stroke', '#708090');
      link.attr('line/strokeWidth', 2);
      link.removeAttr('line/strokeDasharray');
      link.removeAttr('line/animation');

      const view = this.paper.findViewByModel(link);
      if (view && view.el) {
        (view.el as SVGElement).style.removeProperty('animation');
      }
    });

    // Apply highlight
    pathElements.forEach(el => {
      el.attr('body/stroke', '#FF9800');
      el.attr('body/strokeWidth', 2);
    });

    pathLinks.forEach(link => {
      link.attr('line/stroke', '#FF9800');
      link.attr('line/strokeWidth', 2);
      link.attr('line/strokeDasharray', '10 5');
      link.attr('line/animation', 'dash 1s linear infinite');

      const view = this.paper.findViewByModel(link);
      if (view && view.el) {
        (view.el as SVGElement).style.setProperty('animation', 'dash 1s linear infinite');
      }
    });

    // Add animation style (once)
    const styleId = 'jointjs-dash-animation-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
      @keyframes dash {
        to {
          stroke-dashoffset: -30;
        }
      }
      .joint-link [animation="dash 1s linear infinite"] {
        animation: dash 1s linear infinite;
      }
    `;
      document.head.appendChild(style);
    }
  }

  clearHighlights() {
    const allLinks = this.graph.getLinks();

    allLinks.forEach(link => {
      // Reset line style
      link.attr('line/stroke', '#000000'); // or default color
      link.attr('line/strokeWidth', 1);
      link.removeAttr('line/strokeDasharray');
      link.removeAttr('line/animation');

      const view = this.paper.findViewByModel(link);
      if (view && view.el) {
        (view.el as SVGElement).style.removeProperty('animation');
      }
    });
  }


  tracePathNew(model: joint.dia.Element, portId: string): boolean {
    const connectedLinks = this.graph.getConnectedLinks(model, { inbound: true });
    for (const link of connectedLinks) {
      const sourceId = link.get('source')?.id;
      const sourceElement = this.graph.getCell(sourceId);
      const sourceName = sourceElement?.attributes?.attrs?.['title']?.text || 'Unnamed';
      const targetPort = link.get('target')?.port;
      console.log(sourceName, 'inside tracePathNew', targetPort);
      if (portId === targetPort) {
        if (link) {
          link.attr('line/stroke', '#FF9800');
          link.attr('line/strokeWidth', 2);
          link.attr('line/strokeDasharray', '10 5');
          link.attr('line/animation', 'dash 1s linear infinite');
          const view = this.paper.findViewByModel(link);
          if (view && view.el) {
            (view.el as SVGElement).style.setProperty('animation', 'dash 1s linear infinite');
          }
        }
        if (sourceName === 'FXALL GUI') {
          if (link) {
            link.attr('line/stroke', '#FF9800');
            link.attr('line/strokeWidth', 2);
            link.attr('line/strokeDasharray', '10 5');
            link.attr('line/animation', 'dash 1s linear infinite');
            const view = this.paper.findViewByModel(link);
            if (view && view.el) {
              (view.el as SVGElement).style.setProperty('animation', 'dash 1s linear infinite');
            }
          }
          return true;
        }
        const sourceLinks = this.graph.getConnectedLinks(sourceElement, { inbound: true });
        sourceLinks.forEach((l: joint.dia.Link) => {
          const nextTargetPort = l.get('target')?.port;
          const shouldStop = this.tracePathNew(sourceElement as joint.dia.Element, nextTargetPort);
          if (shouldStop) return true;
          return false
        })
      }
    }
    return false;
  }



  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.graph = new joint.dia.Graph();
    this.GraphService.registerCustomShapes();

    this.paper = new joint.dia.Paper({
      el: this.paperContainer.nativeElement,
      model: this.graph,
      gridSize: 10,
      drawGrid: true,
      background: { color: '#f4f7fa' },
      defaultLink: () => new joint.shapes.standard.Link({
        router: { name: 'normal' },
        connector: { name: 'smooth' },

        attrs: {
          line: {
            stroke: '#708090',
            strokeWidth: 2,
            targetMarker: {
              type: 'none',
              d: 'M 10 -5 0 0 10 5 z'
            }
          }
        },
        labels: [
          {
            position: 0.5,
            attrs: {
              body: {
                refWidth: 0,
                refHeight: 0,
                fill: '',
                stroke: 'red',
                strokeWidth: 0,
                rx: 0,
                ry: 0,
                cursor: 'pointer',
                event: 'link:delete',
                visibility: 'hidden'
              },
              label: {
                text: '✕',
                fontSize: 14,
                fontWeight: 'bold',
                fill: 'red',
                cursor: 'pointer',
                textAnchor: 'middle',
                yAlignment: 'middle',
                event: 'link:delete',
                visibility: 'hidden'
              }
            },
            markup: [
              { tagName: 'rect', selector: 'body' },
              { tagName: 'text', selector: 'label' }
            ]
          }
        ]
      }),

      validateConnection: (srcView, srcMagnet, tgtView, tgtMagnet) => {
        return !!srcMagnet && !!tgtMagnet &&
          srcMagnet.getAttribute('magnet') === 'true' &&
          tgtMagnet.getAttribute('magnet') === 'true';
      },

      snapLinks: true,
      markAvailable: true
    });

    (this.graph as any).on('add remove reset', () => {
      this.hasGraph = this.graph.getCells().length > 0;
    });

    this.paperContainer.nativeElement.addEventListener('wheel', (evt: WheelEvent) => {
      if (!evt.ctrlKey) return;
      evt.preventDefault();
      const delta = evt.deltaY < 0 ? 0.1 : -0.1;
      this.setZoom(this.scale + delta);
    });

    const container = this.paperContainer.nativeElement;
    container.addEventListener('dragover', (e: DragEvent) => e.preventDefault());

    container.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();

      const block = JSON.parse(e.dataTransfer?.getData('block') || '{}');

      const dialogRef = this.dialog.open(NodeDropModalComponent, {
        width: '300px',
        data: block
      });

      dialogRef.afterClosed().subscribe((selectedValue: string) => {
        if (!selectedValue) return; // User canceled

        const position = { x: e.offsetX, y: e.offsetY };
        const shapeType = block.type || 'SingleBlock';

        const ShapeClass =
          shapeType === 'DualBlock'
            ? joint.shapes?.processor.DualBlock
            : joint.shapes?.processor.SingleBlock;

        const nodeSize = block.size || { width: 150, height: 100 };

        const el = new ShapeClass({
          position,
          size: nodeSize,
          attrs: {
            body: { fill: block.color || '#4875C6' },
             icon: {
              html: '<i class="fa fa-bullseye" aria-hidden="true"></i>',
              refX: '50%',
              refY: '10%',
              fontSize: 20, 
              fill: '#000',
            },
            title: {
              text: selectedValue,
              refX: '50%',
              refY: '40%',
              textAnchor: 'middle',
              fontSize: 14,
              fill: '#000'
            }
          },
          type: `processor.${shapeType}`
        });

        if (block.ports?.length) {
          el.addPorts(block.ports);
        }

        this.graph.addCell(el);
      });
    });



    this.graph.on('change:source change:target', (link: joint.dia.Link) => {
      const source = link.get('source');
      const target = link.get('target');

      if (!source || !source.id || !source.port || !target || !target.id || !target.port) {
        setTimeout(() => {
          const s = link.get('source');
          const t = link.get('target');

          if (!s || !s.id || !s.port || !t || !t.id || !t.port) {
            link.remove();
          }
        }, 1000);
      }
    });


    this.paper.on('link:mouseenter', (linkView: any) => {
      const link = linkView.model as joint.dia.Link;
      link.label(0, {
        attrs: {
          body: { visibility: 'visible' },
          label: { visibility: 'visible' }
        }
      });
    });

    this.paper.on('link:mouseleave', (linkView: any) => {
      const link = linkView.model as joint.dia.Link;
      link.label(0, {
        attrs: {
          body: { visibility: 'hidden' },
          label: { visibility: 'hidden' }
        }
      });
    });

    this.paper.on('link:delete', (linkView: any, evt: any) => {
      evt.stopPropagation();
      linkView.model.remove();
    });

    this.paper.on('element:pointerdown', (view: joint.dia.ElementView, evt: joint.dia.Event) => {
      const model = view.model as joint.dia.Element;
      const nativeEvt = evt as unknown as PointerEvent;

      if (nativeEvt.shiftKey) {
        if (!this.linkSource) {
          this.linkSource = model;
        } else {
          const link = new joint.shapes.standard.Link();
          link.source(this.linkSource);
          link.target(model);
          link.addTo(this.graph);
          this.linkSource = null;
        }
      }
    });

    this.paper.on('element:pointerdown', (view: any, evt: joint.dia.Event, x: number, y: number) => {
      const target = evt.target as SVGElement;
      const model = view.model;

      if (target.getAttribute('selector') === 'resize-handle') {
        evt.stopPropagation();

        const bbox = view.getBBox();
        const paperRect = this.paper.el.getBoundingClientRect();

        const onMouseMove = (e: MouseEvent) => {
          const width = Math.max(80, e.clientX - paperRect.left - bbox.x);
          const height = Math.max(60, e.clientY - paperRect.top - bbox.y);
          model.resize(width, height);
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }
    });

    this.paper.on('element:pointerdown', (view: any, evt: joint.dia.Event, x: number, y: number) => {
      const model = view.model;

      const bbox = view.getBBox();
      const resizeMargin = 10;

      // Check if pointer is in bottom-right corner
      const isInResizeCorner =
        x > bbox.x + bbox.width - resizeMargin &&
        y > bbox.y + bbox.height - resizeMargin;

      if (isInResizeCorner) {
        evt.stopPropagation(); // prevent dragging the whole node

        const onMouseMove = (moveEvt: MouseEvent) => {
          const paperRect = this.paper.el.getBoundingClientRect();
          const newWidth = moveEvt.clientX - paperRect.left - bbox.x;
          const newHeight = moveEvt.clientY - paperRect.top - bbox.y;

          model.resize(Math.max(40, newWidth), Math.max(30, newHeight));
        };

        const onMouseUp = () => {
          window.removeEventListener('mousemove', onMouseMove);
          window.removeEventListener('mouseup', onMouseUp);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
      }
    });


    this.paper.on('port:reportStatus', (elementView, evt) => {
      evt.stopPropagation();
      this.clearHighlights()
      const model = elementView.model;
      this.tracePathNew(model, 'in4');
    });

    this.paper.on('port:transactionReference', (elementView, evt) => {
      evt.stopPropagation();
      this.clearHighlights()
      const model = elementView.model;
      this.tracePathNew(model, 'in5');
    });

    this.paper.on('port:tradingVenue', (elementView, evt) => {
      evt.stopPropagation();
      this.clearHighlights()
      const model = elementView.model;
      this.tracePathNew(model, 'in6');
    });

    const styleId = 'jointjs-dash-animation-style';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
          @keyframes dash {
            to {
              stroke-dashoffset: -30;
            }
          }
          .joint-link [animation="dash 1s linear infinite"] {
            animation: dash 1s linear infinite;
          }
        `;
      document.head.appendChild(style);
    }

  }
  saveGraph() {
    if (!this.hasGraph) return;
    const json = this.graph.toJSON();
    const blob = new Blob([JSON.stringify(json)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'diagram.json';
    a.click();
  }
  loadGraphManually(json: any) {
    if (!json.cells) return;
    const nodeMap: { [id: string]: joint.dia.Element } = {};
    json.cells.forEach((cell: any) => {
      if (cell.type?.startsWith('processor.')) {
        let shapeType = cell.type.split('.')[1]; // e.g., Block, SingleBlock, DualBlock

        // 🔁 Migrate old Block type to SingleBlock
        if (shapeType === 'Block') {
          shapeType = 'SingleBlock';
          console.warn(`ℹ️ Migrating "processor.Block" to "processor.SingleBlock" for cell ID: ${cell.id}`);
        }

        // const ShapeClass = (joint.shapes as any).processor?.[shapeType];
        const shapeRegistry = (joint.shapes as any)?.processor || {};
        const ShapeClass = shapeRegistry[shapeType];


        if (!ShapeClass) {
          console.warn(`❌ Unknown shape type: processor.${shapeType}`);
          return;
        }

        const block = new ShapeClass({
          id: cell.id,
          position: cell.position,
          size: cell.size,
          attrs: cell.attrs,
          ports: { items: [] } // Empty by default, ports added separately below
        });

        // 🧩 Add ports (if available)
        if (cell.ports?.items?.length) {
          block.addPorts(cell.ports.items);
        }

        nodeMap[cell.id] = block;
        this.graph.addCell(block);
      }
    });

    // 🔗 Add links
    json.cells.forEach((cell: any) => {
      if (cell.type === 'standard.Link') {
        const sourceId = cell.source?.id;
        const targetId = cell.target?.id;

        if (nodeMap[sourceId] && nodeMap[targetId]) {
          const link = new joint.shapes.standard.Link({
            id: cell.id,
            source: cell.source,
            target: cell.target,
            attrs: cell.attrs || {},
            labels: cell.labels || [],
            router: cell.router || { name: 'normal' },
            connector: cell.connector || { name: 'smooth' }
          });

          if (link.labels().length === 0) {
            link.label(0, {
              position: 0.5,
              attrs: {
                body: {
                  refWidth: 0,
                  refHeight: 0,
                  fill: '',
                  stroke: 'red',
                  strokeWidth: 0,
                  rx: 0,
                  ry: 0,
                  cursor: 'pointer',
                  event: 'link:delete',
                  visibility: 'hidden'
                },
                label: {
                  text: '✕',
                  fontSize: 14,
                  fontWeight: 'bold',
                  fill: 'red',
                  cursor: 'pointer',
                  textAnchor: 'middle',
                  yAlignment: 'middle',
                  event: 'link:delete',
                  visibility: 'hidden'
                }
              },
              markup: [
                { tagName: 'rect', selector: 'body' },
                { tagName: 'text', selector: 'label' }
              ]
            });
          }

          this.graph.addCell(link);
        } else {
          console.warn('⛔ Skipping link: source or target not found', cell);
        }
      }
    });

    console.log('✅ Diagram loaded (with backward compatibility).');
  }
  loadGraphFromFile(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const json = JSON.parse(reader.result as string);
        this.GraphService.registerCustomShapes();
        this.loadGraphManually(json);
        console.log('Diagram loaded!');
      } catch (err) {
        console.error('Error loading diagram:', err);
        alert('Failed to load diagram.');
      }
    };
    reader.readAsText(file);
  }
  resetGraph() {
    const confirmReset = confirm('⚠️ This will clear your current diagram. Continue?');
    if (!confirmReset) return;
    this.graph.clear();
    this.linkSource = null;
    this.scale = 1;
    this.setZoom(1);
  }
  resetZoom() {
    this.setZoom(1);
  }
  fitToScreen() {
    this.paper.scaleContentToFit({ padding: 20 });
    this.scale = this.paper.scale().sx;
    this.scaleDisplay = Math.round(this.scale * 100);
  }
  onZoomSliderChange(event: Event) {
    const value = Number((event.target as HTMLInputElement).value);
    this.setZoom(value / 100);
  }
  setZoom(newScale: number) {
    this.scale = Math.max(0.2, Math.min(newScale, 3));
    this.paper.scale(this.scale);
    this.scaleDisplay = Math.round(this.scale * 100);
  }
}