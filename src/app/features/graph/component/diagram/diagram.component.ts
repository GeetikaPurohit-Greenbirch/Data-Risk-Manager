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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

 private get processorShapes(): any {
  return (joint.shapes as any)?.processor?.Block;
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
      
      // validateConnection: (srcView, srcMagnet, tgtView, tgtMagnet) => {
      //   if (!srcMagnet || !tgtMagnet ||
      //     srcMagnet.getAttribute('magnet') !== 'true' ||
      //     tgtMagnet.getAttribute('magnet') !== 'true') return false;

      //   const sourceGroup = srcMagnet.getAttribute('port-group');
      //   const targetGroup = tgtMagnet.getAttribute('port-group');

      //   return (sourceGroup === 'out' && targetGroup === 'in') ||
      //          (sourceGroup === 'in' && targetGroup === 'out');
      // },


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
    
    // container.addEventListener('drop', (e: DragEvent) => {
    //   e.preventDefault();
    //   const block = JSON.parse(e.dataTransfer?.getData('block') || '{}');
    //   const position = { x: e.offsetX, y: e.offsetY };

    //   const el = new this.processorShapes({
    //     size: block.size || { width: 120, height: 90 },
    //     position: position
    //   });

    //   el.attr('label/text', block.label || 'Block');
    //   el.attr('body/fill', block.color || '#6a6c8a');

    //   if (block.ports && Array.isArray(block.ports)) {
    //     el.addPorts(block.ports);
    //   } else {
    //     el.addPorts([
    //       { group: 'in', id: 'in1', attrs: { portLabel: { text: 'Input' } } },
    //       { group: 'out', id: 'out1', attrs: { portLabel: { text: 'Output' } } }
    //     ]);

        
    //   }

    //   this.graph.addCell(el);
    // });


//     container.addEventListener('drop', (e: DragEvent) => {
//   e.preventDefault();
//   const block = JSON.parse(e.dataTransfer?.getData('block') || '{}');
//   const position = { x: e.offsetX, y: e.offsetY };

//   // Decide block shape based on type
//   const shapeType = block.type || 'SingleBlock';
//   const ShapeClass =
//     shapeType === 'DualBlock'
//       ? joint.shapes?.processor.DualBlock
//       : joint.shapes?.processor.SingleBlock;

//   const el = new ShapeClass({
//     position,
//     size: block.size || { width: 150, height: 100 },
//     attrs: {
//       title: { text: block.label || '' },
//       body: { fill: block.color || '#4875C6' }
//     },
//     type: `processor.${shapeType}`
//   });

//   if (block.ports?.length) {
//     el.addPorts(block.ports);
//   }

//   this.graph.addCell(el);
// });



container.addEventListener('drop', (e: DragEvent) => {
  e.preventDefault();

  const block = JSON.parse(e.dataTransfer?.getData('block') || '{}');
  const position = { x: e.offsetX, y: e.offsetY };

  const shapeType = block.type || 'SingleBlock';
  const ShapeClass =
    shapeType === 'DualBlock'
      ? joint.shapes?.processor.DualBlock
      : joint.shapes?.processor.SingleBlock;

  const el = new ShapeClass({
    position,
    size: block.size || { width: 150, height: 100 },
    attrs: {
      body: { fill: block.color || '#4875C6' },
      title: block.attrs?.title || {
        text: block.label || '',
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




// Automatically remove links not connected to both source and target
this.graph.on('change:source change:target', (link: joint.dia.Link) => {
  const source = link.get('source');
  const target = link.get('target');

  // If source or target is missing an ID or port (meaning not properly connected)
  if (!source || !source.id || !source.port || !target || !target.id || !target.port) {
    // Delay slightly to allow connection if user is still dragging
    setTimeout(() => {
      const s = link.get('source');
      const t = link.get('target');

      if (!s || !s.id || !s.port || !t || !t.id || !t.port) {
        link.remove(); // 🗑️ remove the floating link
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



    this.paper.on('element:mouseenter', (view: any) => {
      view.model.attr('remove-icon/visibility', 'visible');
       view.model.attr('resize-handle/visibility', 'visible');
       
    });

    this.paper.on('element:mouseleave', (view: any) => {
      view.model.attr('remove-icon/visibility', 'hidden');
       view.model.attr('resize-handle/visibility', 'hidden');
    });

    this.paper.on('element:delete', (view: any) => {
      view.model.remove();
    });





// this.paper.on('element:pointerdown', (view: any, evt: joint.dia.Event, x: number, y: number) => {
//   const target = evt.target as SVGElement;
//   const model = view.model;

//   if (target.getAttribute('selector') === 'resize-handle') {
//     evt.stopPropagation();

//     const bbox = view.getBBox();
//     const paperRect = this.paper.el.getBoundingClientRect();

//     const onMouseMove = (e: MouseEvent) => {
//       const width = Math.max(80, e.clientX - paperRect.left - bbox.x);
//       const height = Math.max(60, e.clientY - paperRect.top - bbox.y);
//       model.resize(width, height);
//     };

//     const onMouseUp = () => {
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('mouseup', onMouseUp);
//     };

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('mouseup', onMouseUp);
//   }
// });



// this.paper.on('element:pointerdown', (view: any, evt: joint.dia.Event, x: number, y: number) => {
//   const model = view.model;

//   const bbox = view.getBBox();
//   const resizeMargin = 10;

//   // Check if pointer is in bottom-right corner
//   const isInResizeCorner =
//     x > bbox.x + bbox.width - resizeMargin &&
//     y > bbox.y + bbox.height - resizeMargin;

//   if (isInResizeCorner) {
//     evt.stopPropagation(); // prevent dragging the whole node

//     let startX = x;
//     let startY = y;
//     let startWidth = bbox.width;
//     let startHeight = bbox.height;

//     const onMouseMove = (moveEvt: MouseEvent) => {
//       const paperRect = this.paper.el.getBoundingClientRect();
//       // Calculate mouse position relative to the paper
//       const mouseX = moveEvt.clientX - paperRect.left;
//       const mouseY = moveEvt.clientY - paperRect.top;

//       // Calculate delta from initial pointerdown
//       const dx = mouseX - bbox.x - startX;
//       const dy = mouseY - bbox.y - startY;

//       // Apply delta to initial size for smooth resizing
//       const newWidth = Math.max(40, startWidth + dx);
//       const newHeight = Math.max(30, startHeight + dy);

//       model.resize(newWidth, newHeight, { direction: 'se' });
//     };

//     const onMouseUp = () => {
//       window.removeEventListener('mousemove', onMouseMove);
//       window.removeEventListener('mouseup', onMouseUp);
//     };

//     window.addEventListener('mousemove', onMouseMove);
//     window.addEventListener('mouseup', onMouseUp);
//   }
// });

   


//Track Path To Origin Heighlight...
this.paper.on('element:pointerclick', (elementView: joint.dia.ElementView) => {
  const element = elementView.model;

  // ✅ Clear previous highlights and animations
  this.graph.getElements().forEach(el => {
    el.attr('body/stroke', '#708090'); // default border
    el.attr('body/strokeWidth', 1);
  });
  this.graph.getLinks().forEach(link => {
    link.attr('line/stroke', '#708090'); // default link color
    link.attr('line/strokeWidth', 2);
    link.removeAttr('line/strokeDasharray');
    link.removeAttr('line/animation');
    // Remove CSS animation from SVG element
    const view = this.paper.findViewByModel(link);
    if (view && view.el) {
      (view.el as SVGElement).style.removeProperty('animation');
    }
  });

  // ✅ Trace from clicked node to origin and animate only connector links
  const visited = new Set<string>();
  const path: joint.dia.Element[] = [];

  const walk = (el: joint.dia.Element) => {
    if (visited.has(String(el.id))) return;
    visited.add(String(el.id));
    path.push(el);

    const inboundLinks = this.graph.getConnectedLinks(el, { inbound: true });
    for (const link of inboundLinks) {
      const sourceId = link.get('source')?.id;
      if (sourceId) {
        const sourceEl = this.graph.getCell(sourceId) as joint.dia.Element;
        if (sourceEl) {
          walk(sourceEl);
        }
      }
    }
  };

  walk(element);

  // Animate only the connector links in the traced path
  for (let i = 1; i < path.length; i++) {
    const from = path[i];
    const to = path[i - 1];
    const link = this.graph.getLinks().find(l =>
      l.get('source')?.id === from.id && l.get('target')?.id === to.id
    );
    if (link) {
      link.attr('line/stroke', '#FF9800');
      link.attr('line/strokeWidth', 2);
      // Animate using stroke-dasharray and stroke-dashoffset
      link.attr('line/strokeDasharray', '10 5');
      link.attr('line/animation', 'dash 1s linear infinite');
      // Add CSS animation to the SVG element
      const view = this.paper.findViewByModel(link);
      if (view && view.el) {
        (view.el as SVGElement).style.setProperty('animation', 'dash 1s linear infinite');
      }
    }
  }

  // Add keyframes for dash animation if not already present
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
});


 

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

  // loadGraphManually(json: any) {
  //   if (!json.cells) return;
  //   const nodeMap: { [id: string]: joint.dia.Element } = {};

  //   json.cells.forEach((cell: any) => {
  //     if (cell.type === 'processor.Block') {
  //       const block = new this.processorShapes({
  //         id: cell.id,
  //         position: cell.position,
  //         size: cell.size,
  //         attrs: cell.attrs
  //       });

  //       if (cell.ports?.items) {
  //         block.addPorts(cell.ports.items);
  //       }

  //       nodeMap[cell.id] = block;
  //       this.graph.addCell(block);
  //     }
  //   });

  //   json.cells.forEach((cell: any) => {
  //     if (cell.type === 'standard.Link') {
  //       const sourceId = cell.source?.id;
  //       const targetId = cell.target?.id;

  //       if (nodeMap[sourceId] && nodeMap[targetId]) {
  //         const link = new joint.shapes.standard.Link({
  //           id: cell.id,
  //           source: cell.source,
  //           target: cell.target,
  //           attrs: cell.attrs || {},
  //           labels: cell.labels || [],
  //           // router: cell.router || { name: 'orthogonal' },
  //           // connector: cell.connector || { name: 'rounded' }
  //         });

  //         if (link.labels().length === 0) {
  //           link.label(0, {
  //             position: 0.5,
  //             attrs: {
  //               body: {
  //                 refWidth: 0,
  //                 refHeight: 0,
  //                 fill: '',
  //                 stroke: 'red',
  //                 strokeWidth: 0,
  //                 rx: 0,
  //                 ry: 0,
  //                 cursor: 'pointer',
  //                 event: 'link:delete',
  //                 visibility: 'hidden'
  //               },
  //               label: {
  //                 text: '✕',
  //                 fontSize: 14,
  //                 fontWeight: 'bold',
  //                 fill: 'red',
  //                 cursor: 'pointer',
  //                 textAnchor: 'middle',
  //                 yAlignment: 'middle',
  //                 event: 'link:delete',
  //                 visibility: 'hidden'
  //               }
  //             },
  //             markup: [
  //               { tagName: 'rect', selector: 'body' },
  //               { tagName: 'text', selector: 'label' }
  //             ]
  //           });
  //         }

  //         this.graph.addCell(link);
  //       } else {
  //         console.warn('⛔ Skipping link: source or target not found', cell);
  //       }
  //     }
  //   });

  //   console.log('✅ Diagram loaded manually.');
  // }


  // Track Path To Origin 
tracePathToOrigin(startElement: joint.dia.Element) {
  const visited = new Set<string>();
  const path: joint.dia.Element[] = [];

  const walk = (el: joint.dia.Element) => {
    if (visited.has(String(el.id))) return;
    visited.add(String(el.id));
    path.push(el);

    const inboundLinks = this.graph.getConnectedLinks(el, { inbound: true });
    for (const link of inboundLinks) {
      const sourceId = link.get('source')?.id;
      if (sourceId) {
        const sourceEl = this.graph.getCell(sourceId) as joint.dia.Element;
        if (sourceEl) {
          walk(sourceEl);
        }
      }
    }
  };

  walk(startElement);

  // 🔶 Highlight nodes
  path.forEach(el => {
    el.attr('body/stroke', '#FF9800');
    el.attr('body/strokeWidth', 3);
  });

  // 🔷 Highlight links
  const highlightLink = (from: joint.dia.Element, to: joint.dia.Element) => {
    const link = this.graph.getLinks().find(l =>
      l.get('source')?.id === from.id && l.get('target')?.id === to.id
    );
    if (link) {
      link.attr('line/stroke', '#FF9800');
      link.attr('line/strokeWidth', 3);
    }
  };

  for (let i = 1; i < path.length; i++) {
    highlightLink(path[i], path[i - 1]);
  }

  console.log('🔍 Path to origin:', path.map(n => n.id));
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