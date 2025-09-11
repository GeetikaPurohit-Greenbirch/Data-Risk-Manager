// diagram.component.ts

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
import { Subject, of, forkJoin } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Link, Constant, Concat, GetDate, Record } from './shapes.component';
import { SourceArrowhead, TargetArrowhead, Button } from '../diagram/link-tools.component';
import { routerNamespace } from '../diagram/routers.component';
import { anchorNamespace } from '../diagram/anchors.component';
import { loadExample } from './example.component';
import { MatDialog } from '@angular/material/dialog';
import { NodeDropModalComponent } from 'src/app/node-drop-modal/node-drop-modal.component';
import { L001, L002, L003 } from '../diagram/diagrams';
import { LineageService } from '../../services/lineage.service';
import { catchError } from 'rxjs/operators';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';

type Records = Constant | Concat | GetDate | Record;

@Component({
  selector: 'app-child-diagram',
  templateUrl: './lineage.component.html',
  styleUrls: ['./lineage.component.scss']
})
export class LineageComponent implements AfterViewInit {
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
    private route: ActivatedRoute,
    private lineageService: LineageService,
    private toastNotificationService: ToastnotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  source: any = null;
  target: any = null;
  initialData: any = null;

  private destroy$ = new Subject<void>();

  private getFirstQueryParamWithType(keys: string[]): { type: string; value: string } {
    const pm: ParamMap = this.route.snapshot.queryParamMap;
    for (const k of keys) {
      const v = pm.get(k);
      if (v) return { type: k.split('-')[1], value: v };
    }
    return { type: '', value: '' };
  }

  public loadData = () => {
    const sourceQP = this.getFirstQueryParamWithType([
      'source-sources', 'source-systems', 'source-targets', 'source-controls'
    ]);
    const targetQP = this.getFirstQueryParamWithType([
      'target-sources', 'target-systems', 'target-targets', 'target-controls'
    ]);

    const path = this.router.url.split('?')[0].split('#')[0];
    const segments = path.split('/').filter(Boolean);
    const linkId = (segments[segments.length - 1] || '');
    const usecaseId = (segments[segments.length - 3] || '');

    forkJoin({
      initialData: this.lineageService
        .getLineageDetailsByLinkId(linkId, usecaseId)
        .pipe(
          catchError(err => {
            console.error('initialData failed:', err);
            return of(null); // ← make forkJoin continue
          })
        ),
      source: this.lineageService.getEntityById(sourceQP.type, +sourceQP.value),
      target: this.lineageService.getEntityById(targetQP.type, +targetQP.value)
    }).subscribe(({ initialData, source, target }) => {
      this.source = source;
      this.target = target;
      this.initialData = initialData;

      // If we have lineage_json, use it; otherwise fall back to rendering source/target
      const lineageStr =
        initialData?.lineage_json && typeof initialData.lineage_json === 'string'
          ? initialData.lineage_json.trim()
          : '';

      if (lineageStr.length > 0) {
        // NOTE: loadGraphFromJSON does JSON.parse internally—pass the string
        this.loadGraphFromJSON(lineageStr);
      } else {
        // Fall back (same behavior as when lineage_json has no length)
        try {
          const sourceParsed = JSON.parse(source.node);
          const targetParsed = JSON.parse(target.node);
          // this.paper.freeze();
          loadExample(this.graph, { x: 100, y: 90 }, this.source, sourceParsed);
          loadExample(this.graph, { x: 500, y: 90 }, this.target, targetParsed);
          // this.paper.unfreeze();
          // this.scroller.centerContent();
        } catch (e) {
          console.error('Failed to parse node JSON:', e);
          // this.toastNotificationService?.error?.('Invalid node JSON from API.');
        }
      }
    });
  }

  public ngOnInit(): void {
    // This is a good place for initial setup that doesn't require DOM access
    this.loadData();
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

  public goBack = () => {
    const path = this.router.url.split('?')[0].split('#')[0];
    const segments = path.split('/').filter(Boolean);
    const lineageId = (segments[segments.length - 2] || '');
    const usecaseId = (segments[segments.length - 3] || '');
    this.router.navigate([`/graph-embedded/edit-lineage/${usecaseId}/${lineageId}`]);
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
      const sourceAttrs = (sourceElement as any).attributes?.attrs || {};
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
    this.graph = new dia.Graph({}, { cellNamespace: shapes });

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

    this.scroller = new ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: false, // important: disables scroll management
      padding: 0,
      baseWidth: 500,
      baseHeight: 500,
      cursor: 'grab'
    });

    this.canvas.nativeElement.appendChild(this.scroller.el); // Append scroller to canvas

    this.paper.on('element:mousewheel', (recordView: dia.ElementView, evt: dia.Event, x: number, y: number, delta: number) => {
      evt.preventDefault();
      const record = recordView.model as any;
      if (!record.isEveryItemInView()) {
        record.setScrollTop(record.getScrollTop() + delta * 10);
      }
    });

    this.paper.on('link:mouseenter', (linkView: dia.LinkView) => {
      this.showLinkTools(linkView);
    });

    this.paper.on('link:mouseleave', (linkView: dia.LinkView) => {
      linkView.removeTools();
    });

    this.graph.on('add', (cell) => {
      if ((cell as any).get('type') === 'mapping.Record') {
        // Ensure the view is rendered before adding tools
        const cellView = this.paper.findViewByModel(cell);
        if (cellView) {
          cellView.addTools(new dia.ToolsView({
            tools: [new elementTools.RecordScrollbar({})]
          }));
        }
      }
    });

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
        console.log('Target Port:', target, source, 'on Link:', (link as any).id);
      });
      this.clearHighlights();
      this.tracePathNew(elementView.model as dia.Element, itemId ?? '');
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

  // saveGraph() {
  //   const json = this.graph.toJSON();
  //   const jsonString = JSON.stringify(json, null, 2); // Pretty print
  //   const blob = new Blob([jsonString], { type: 'application/json' });
  //   const url = URL.createObjectURL(blob);
  //   const link = document.createElement('a');
  //   link.href = url;
  //   link.download = 'diagram.json'; // Change name if needed
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url); // Clean up
  // }

  public normalizeTypeName(typeName: string) {
    switch (typeName.toLowerCase()) {
      case 'sources':
        return 'SOURCE';
      case 'systems':
        return 'SYSTEM';
      case 'interfaces':
        return 'INTERFACE';
      case 'targets':
        return 'TARGET';
      case 'control':
        return 'CONTROLS';
      default:
        return typeName.toUpperCase();
    }
  }

  // === NEW HELPERS ==============================================

  /** Safely extract a raw typeName from a Concat cell.
   * Supports:
   * - cell.typeName as string
   * - cell.attrs.typeName as string
   * - cell.attrs.typeName as object-of-characters {0:'s',1:'y',...}
   */
  private getRawTypeName(cell: any): string {
    if (!cell) return '';
    if (typeof cell.typeName === 'string') return cell.typeName;
    const t = cell?.attrs?.typeName;
    if (typeof t === 'string') return t;
    if (t && typeof t === 'object') {
      try {
        return Object.values(t).join('');
      } catch {
        return '';
      }
    }
    return '';
  }

  /** Build a map of { portId -> item.type } from a mapping.Concat cell's nested items. */
  private buildConcatPortTypeIndex(concatCell: any): any {
    const idx: any = {};
    const groups = Array.isArray(concatCell?.items) ? concatCell.items : [];
    for (const group of groups) {
      const sections = Array.isArray(group) ? group : [];
      for (const section of sections) {
        const leafItems = Array.isArray(section?.items) ? section.items : [];
        for (const leaf of leafItems) {
          const id = leaf?.id;
          const t = (leaf?.type ?? '').trim();
          if (id !== undefined && id !== null && t) {
            idx[String(id)] = t.toUpperCase();
          }
        }
      }
    }
    return idx;
  }


  /** Build a map of { portId -> parentId } from a Concat cell's items */
private buildConcatPortParentIdMap(concatCell: any): any {
  const map: any = {};
  const nodeId = String(concatCell?.id);
  const groups = Array.isArray(concatCell?.items) ? concatCell.items : [];

  for (const group of groups) {
    const sections = Array.isArray(group) ? group : [];

    for (const section of sections) {
      const sectionId = section?.id || nodeId; // fallback to node id if no section id
      const leafItems = Array.isArray(section?.items) ? section.items : [];

      for (const leaf of leafItems) {
        const leafId = leaf?.id;
        if (leafId != null) {
          map[String(leafId)] = sectionId;
        }
      }
    }
  }

  return map;
}


  // === UPDATED METHOD ============================================

  /** Enrich links so source.type/target.type reflect the exact port item type when available,
   *  falling back to the Concat node's normalized type.
   */
  public enrichLinksWithNormalizedTypeName(json: any) {
    // nodeId -> normalized node type (SYSTEM/TARGET/INTERFACE/SOURCE/CONTROLS/...)
    const idToNormalizedTypeName: any= {};
    // nodeId -> (portId -> item type) from Concat leaf items
    const nodePortTypeMap: any = {};
    const nodePortParentMap: any = {};

    // Step 1: build maps from Concat cells
    (json.cells || []).forEach((cell: any) => {
      if (cell?.type !== 'mapping.Concat' || !cell.id) return;

      // node-level normalized type
      const rawTypeName = this.getRawTypeName(cell);
      if (rawTypeName) {
        idToNormalizedTypeName[cell.id] = this.normalizeTypeName(rawTypeName);
      }

      // per-port type map
      const portIndex = this.buildConcatPortTypeIndex(cell);
      if (Object.keys(portIndex).length) {
        nodePortTypeMap[cell.id] = portIndex;
      }


       const portParentMap = this.buildConcatPortParentIdMap(cell);
    if (Object.keys(portParentMap).length) {
      nodePortParentMap[cell.id] = portParentMap;
    }

    });

    console.log('ID to Normalized TypeName Map:', idToNormalizedTypeName);
    // console.log('Node Port Type Map:', nodePortTypeMap);

    // Step 2: enrich links using exact port type, fallback to node type
    (json.cells || []).forEach((cell: any) => {
      if (cell?.type !== 'mapping.Link') return;

      const applyType = (endpoint: 'source' | 'target') => {
        const ep = cell[endpoint];
        if (!ep?.id) return;

        const nodeId = String(ep.id);
        const portId = ep.port != null ? String(ep.port) : '';
        let resolved: string | undefined;

        // 1) exact port type if available
        const portMap = nodePortTypeMap[nodeId];
        if (portMap && portId && portMap[portId]) {
          resolved = portMap[portId];
        }

        // 2) fallback to node normalized type
        if (!resolved && idToNormalizedTypeName[nodeId]) {
          resolved = idToNormalizedTypeName[nodeId];
        }


        //  let resolvedType = portTypeMap?.[portId] || normalizedType;
         const portParentMap = nodePortParentMap[nodeId];
        let resolvedParentId = portParentMap?.[portId].split('_')[3] || nodeId;

        if (resolved) {
          cell[endpoint] = { ...(ep || {}), type: resolved, parentId: resolvedParentId};
        }
      };

      applyType('source');
      applyType('target');
    });

    return json;
  }

  saveGraph() {
    const json = this.graph.toJSON();
    const ddata = this.enrichLinksWithNormalizedTypeName(json);
    const jsonString = JSON.stringify(ddata, null, 2); // Pretty print

    const path = this.router.url.split('?')[0].split('#')[0];
    const segments = path.split('/').filter(Boolean);
    const linkId = (segments[segments.length - 1] || '');
    const usecaseId = (segments[segments.length - 3] || '');

    this.lineageService.saveLineageDetailsByLinkId(linkId, usecaseId, jsonString).subscribe({
      next: (response) => {
        console.log('Lineage saved successfully:', response);
        this.toastNotificationService.success('Lineage Saved successfully');
      },
      error: (err) => {
        console.error('Failed to save lineage:', err);
      }
    });
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
    this.graph.fromJSON(JSON.parse(json));
    // this.scroller.centerContent();
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
