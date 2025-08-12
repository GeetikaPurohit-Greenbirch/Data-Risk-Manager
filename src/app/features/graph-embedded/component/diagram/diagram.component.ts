// diagram.component.ts (NO CHANGES NEEDED - it's already correct for this flow)

import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Inject,
  PLATFORM_ID
} from '@angular/core';
import {
  dia,
  ui,
  setTheme,
  shapes,
  util,
  format,
  elementTools
} from '@joint/plus';
import { Router } from '@angular/router';
import { Link, Constant, Concat, GetDate, Record } from './shapes.component';
import { Decorator } from './highlighter.component';
import { SourceArrowhead, TargetArrowhead, Button } from './link-tools.component';
import { routerNamespace } from './routers.component';
import { anchorNamespace } from './anchors.component';
import { loadExample } from './example.component';
import { MatDialog } from '@angular/material/dialog';
import { NodeDropModalComponent } from 'src/app/node-drop-modal/node-drop-modal.component';
import {L001,L002,L003} from './diagrams'; 


type Records = Constant | Concat | GetDate | Record;


@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss']
})
export class DiagramComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;
  hasGraph: boolean = false;
  graph!: dia.Graph;
  paper!: dia.Paper;
  scroller!: ui.PaperScroller;
  scale: number = 1;
  scaleDisplay: number = 100;

  constructor(
  private dialog: MatDialog,
  private router: Router,
  @Inject(PLATFORM_ID) private platformId: Object
) {}


  public ngOnInit(): void {
    // This is a good place for initial setup that doesn't require DOM access
   
  }


  public showLinkTools(linkView: dia.LinkView) {
    const tools = new dia.ToolsView({
      tools: [
        new SourceArrowhead(),
        new TargetArrowhead(),
        new Button({
          distance: '25%',
          action: () => {
            this.linkAction(linkView.model as Link); // ✅ 'this' is now bound correctly
          }
        })
      ]
    });
    linkView.addTools(tools);
  }


  public linkAction(link: Link) {

    link.remove();

  }


  public clearHighlights() {
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


  public tracePathNew(element: dia.Element, portId: string): boolean {
    const incomingLinks = this.graph.getConnectedLinks(element, {
      inbound: true
    });
    const filteredLinks = incomingLinks.filter(link => {
      const target = link.get('target');
      return target?.port === portId;
    });
    for (const link of filteredLinks) {
      const source = link.get('source');
      if (!source?.id || !source?.port) continue;
      const sourceElement = this.graph.getCell(source.id);
      if (!sourceElement) continue;
      const sourceAttrs = sourceElement.attributes?.attrs || {};
      const sourceName = sourceAttrs['title']?.text || 'Unnamed';
      const incomingLinksOfSource = this.graph.getConnectedLinks(sourceElement, {
        inbound: true
      });
      link.attr({
        line: {
          stroke: '#FF9800',
          strokeWidth: 2,
          strokeDasharray: '10 5'
        }
      });
      const view = this.paper.findViewByModel(link);
      if (view?.el) {
        (view.el as SVGElement).style.setProperty('animation', 'dash 1s linear infinite');
      }
      if (sourceName === 'FXALL GUI') {
        return true;
      }
      for (const l of incomingLinksOfSource) {
        const nextTargetPort = l.get('target')?.port;
        const shouldStop = this.tracePathNew(sourceElement as dia.Element, nextTargetPort);
        if (shouldStop) return true;
      }
    }
    return false;
  }

  public zoom(x: number, y: number, delta: number) {
    this.scroller.zoom(delta * 0.2, { min: 0.4, max: 3, grid: 0.2, ox: x, oy: y });
  }

  public ngAfterViewInit(): void {
    const container = this.canvas.nativeElement;
    container.addEventListener('dragover', (e: DragEvent) => e.preventDefault());

    // --- Initialize Graph, Paper, and Scroller ONCE ---
    this.graph = new dia.Graph({

    }, { cellNamespace: shapes });

    this.paper = new dia.Paper({
      model: this.graph,
      background: {
        color: '#F8F9FA',
      },
      // frozen: true, // Keep frozen until initial setup is done
      async: true,
      sorting: dia.Paper.sorting.APPROX,
      cellViewNamespace: shapes,
      linkPinning: false,
      magnetThreshold: 'onleave',
      moveThreshold: 5,
      clickThreshold: 5,

      markAvailable: true,
      snapLinks: { radius: 40 },
      routerNamespace: routerNamespace,
      defaultRouter: {
        name: 'mapping',
        args: { padding: 30 }
      },
      defaultConnectionPoint: { name: 'anchor' },
      anchorNamespace: anchorNamespace,
      defaultAnchor: { name: 'mapping' },
      defaultConnector: {
        name: 'jumpover',
        args: { jump: 'cubic' }
      },
      highlighting: {
        magnetAvailability: {
          name: 'addClass',
          options: {
            className: 'record-item-available'
          }
        },
        connecting: {
          name: 'stroke',
          options: {
            padding: 8,
            attrs: {
              'stroke': 'none',
              'fill': '#7c68fc',
              'fill-opacity': 0.2
            }
          }
        }
      },
      defaultLink: function () {
        return new Link();
      },
      validateConnection: function (sv, sm, tv, tm, end) {
        return !!sm && !!tm;
      }
    });

    this.paper.setDimensions(500, 500);

    this.scroller = new ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: false, // important: disables scroll management
      padding: 0,
      baseWidth: 500,
      baseHeight: 500,
      cursor: 'grab'
    });


    // this.scroller.render();
    this.canvas.nativeElement.appendChild(this.scroller.el); // Append scroller to canvas
    this.scroller.center();
    this.paper.unfreeze(); // Unfreeze the paper after initial setup

    // --- Event Listeners for Paper and Graph ---
    this.paper.on('element:mousewheel', (recordView: dia.ElementView, evt: dia.Event, x: number, y: number, delta: number) => {
      evt.preventDefault();
      const record = recordView.model as any;
      if (!record.isEveryItemInView()) {
        record.setScrollTop(record.getScrollTop() + delta * 10);
      }
    });

    this.paper.on('blank:mousewheel', (evt: dia.Event, ox: number, oy: number, delta: number) => {
      evt.preventDefault();
      this.zoom(ox, oy, delta);
    });

    this.paper.on('link:mousewheel', (_, evt: dia.Event, ox: number, oy: number, delta: number) => {
      evt.preventDefault();
      this.zoom(ox, oy, delta);
    });


    this.paper.on('link:mouseenter', (linkView: dia.LinkView) => {
      this.showLinkTools(linkView);
    })

    this.paper.on('link:mouseleave', (linkView: dia.LinkView) => {
      linkView.removeTools();
    });

    this.graph.on('add', (cell) => {
      if (cell.get('type') === 'mapping.Record') {
        // Ensure the view is rendered before adding tools
        const cellView = this.paper.findViewByModel(cell);
        if (cellView) {
          cellView.addTools(new dia.ToolsView({
            tools: [new elementTools.RecordScrollbar({})]
          }));
        }
      }
    });

    this.paper.on('link:mouseenter', (linkView: dia.LinkView) => {
      // showLinkTools(linkView);
    })

    this.paper.on('element:magnet:pointerdblclick', (elementView, evt, magnet) => {
      const model = elementView.model; // dia.Element
      const itemId = elementView.findAttribute('item-id', magnet);
      const connectedLinks = this.graph.getConnectedLinks(model, {
        inbound: true,
        outbound: true,
        port: itemId   // 🔥 This is the key part to filter links by specific item/port
      });

      console.log('Connected Links:', connectedLinks, itemId);

      connectedLinks.forEach((link: dia.Link) => {
        const target = link.get('target');
        const source = link.get('source');
        console.log('Target Port:', target, source, 'on Link:', link.id);
      })
      this.clearHighlights()
      this.tracePathNew(elementView.model as dia.Element, itemId ?? '');


    });


    // --- Drop Event Listener (now only adds to existing graph) ---
    container.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();

      const block = JSON.parse(e.dataTransfer?.getData('block') || '{}');

      // Crucial: Add the actual drop coordinates to the block data
      const paperLocalPoint = this.paper.clientToLocalPoint({ x: e.clientX, y: e.clientY });
      block.x = paperLocalPoint.x;
      block.y = paperLocalPoint.y;
      console.log('Dropped block:', block);

      const dialogRef = this.dialog.open(NodeDropModalComponent, {
        width: '300px',
        data: block // Now block contains x and y coordinates, and full block definition
      });

      dialogRef.afterClosed().subscribe((selectedValue: string) => {
        if (!selectedValue) return; // User canceled

        // Use the existing graph instance to add the new element
        loadExample(this.graph, selectedValue, block); // Pass the full 'block' data

        // You might want to recenter or adjust the view after adding
        // If loadExample adds elements, the scroller might need to re-evaluate its content.
        // For simple additions, JointJS usually handles rendering automatically.
        // If you add many elements, consider freezing/unfreezing the paper around the additions.
      });
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

   try {

     const path = this.router.url.split('?')[0].split('#')[0];
  const segments = path.split('/').filter(Boolean);
  const layoutId = (segments[segments.length - 1] || '').toUpperCase();
console.log('Current path:', path, 'Layout ID:', layoutId);
    // Map routes to your JSON presets
    const presetByPath: any = {
      '/L001': L001,
      '/L002': L002,
      '/L003': L003
      // add more like '/L003': L003
    };

    // Current path without query/hash
    // const path = this.router.url.split('?')[0].split('#')[0];

    const preset = presetByPath[`/${layoutId}`];
    if (preset) {
      this.paper.freeze();
      // If preset might be a string, parse it; if it's already an object, use as-is
      const json = typeof preset === 'string' ? JSON.parse(preset) : preset;
      this.graph.fromJSON(json);
      this.paper.unfreeze();
      this.scroller.centerContent();
      this.hasGraph = true;
      console.log('Loaded preset for path:', path);
    } else {
      console.log('No preset mapped for path:', path, '— skipping auto-load.');
    }
  } catch (err) {
    console.error('Failed to load diagram from route:', err);
  }
  }

  resetGraph() {
    this.graph.clear(); // Clears all cells from the graph
    this.scroller.center(); // Recenter the empty paper
  }

  saveGraph() {
    const json = this.graph.toJSON();
    const jsonString = JSON.stringify(json, null, 2); // Pretty print

    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.json'; // Change name if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up
  }

  loadGraphFromFile(e: any) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          this.graph.fromJSON(json); // Load graph from JSON
          this.scroller.centerContent(); // Adjust scroller to fit loaded content
          this.hasGraph = true; // Update state if needed
        } catch (error) {
          console.error('Error loading graph:', error);
          alert('Failed to load graph. Invalid file format.');
        }
      };
      reader.readAsText(file);
    }
  }

  loadGraphFromJSON(json: any) {
    this.graph.fromJSON(json); 
    this.scroller.centerContent(); 
    this.hasGraph = true; 
  }

  onZoomSliderChange(e: any) {
    const newScale = e.value / 100;
    this.scale = newScale;
    this.scaleDisplay = e.value;
    this.scroller.zoom(newScale, { absolute: true });
  }

  resetZoom() {
    this.scale = 1;
    this.scaleDisplay = 100;
    this.scroller.zoom(1, { absolute: true });
    this.scroller.centerContent(); // Center content after resetting zoom
  }
}
