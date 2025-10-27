// diagram.component.ts

import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  ViewEncapsulation
} from '@angular/core';
import {
  dia,
  ui,
  setTheme,
  shapes,
  util,
  format,
  elementTools,
} from '@joint/plus';
import { Subject, of, forkJoin, firstValueFrom } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Link, Constant, Concat, GetDate, Record } from './shapes.component';
import { SourceArrowhead, TargetArrowhead, Button } from '../diagram/link-tools.component';
import { routerNamespace } from '../diagram/routers.component';
import { anchorNamespace } from '../diagram/anchors.component';
import { buildTypeHierarchy, loadExample } from './example.component';
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
  styleUrls: ['./lineage.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LineageComponent implements AfterViewInit {
  @ViewChild('canvas') canvas!: ElementRef;
  hasGraph: boolean = false;
  graph!: dia.Graph;
  paper!: dia.Paper;
  scroller!: ui.PaperScroller;
  scale: number = 1;
  scaleDisplay: number = 100;
  private freeTransform?: ui.FreeTransform;


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private lineageService: LineageService,
    private toastNotificationService: ToastnotificationService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

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
    const linkId = this.route.snapshot.queryParamMap.get('linkId') || '';
    const usecaseId = (segments[segments.length - 2] || '');

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
        this.loadGraphFromJSON(lineageStr, source, target);
      } else {
        // Fall back (same behavior as when lineage_json has no length)
        try {
          const sourceParsed = JSON.parse(source.node);
          const targetParsed = JSON.parse(target.node);
          // this.paper.freeze();
          loadExample(this.graph, { x: 100, y: 90 }, this.source, sourceParsed, true);
          loadExample(this.graph, { x: 700, y: 90 }, this.target, targetParsed, true);
          // this.paper.unfreeze();
          // this.scroller.centerContent();
        } catch (e) {
          console.error('Failed to parse node JSON:', e);
          // this.toastNotificationService?.error?.('Invalid node JSON from API.');
        }
      }
    });
  }

  public widthByType(type: string): number {
    switch (type.toLowerCase()) {
      case 'sources':
        return 0;      // leftmost
      case 'systems':
        return 300;    // middle
      case 'targets':
        return 600;    // rightmost
      default:
        return 0;      // fallback
    }
  }

  public getUniqueEntitiesExcludingInterface(data: any) {
    const uniqueEntities = new Map();

    data.nodes.forEach((node: any) => {
      if (node.entity_type !== "INTERFACE") {
        const key = node.entity_id + "-" + node.entity_type;
        if (!uniqueEntities.has(key)) {
          uniqueEntities.set(key, {
            entity_id: node.entity_id,
            entity_type: node.entity_type,
            entity_name: node.entity_name || null
          });
        }
      } else {
        const key = node.attached_system_id + "-" + 'SYSTEM';
        if (!uniqueEntities.has(key)) {
          uniqueEntities.set(key, {
            entity_id: node.attached_system_id,
            entity_type: "SYSTEM",
            entity_name: node.entity_name || null
          });
        }

      }
    });

    return Array.from(uniqueEntities.values());
  }

  // 2) Fetch all entities in parallel and load them; WAIT for all to complete
  public async fetchEntitiesFromMapping(result: any[]) {
    const typeMap: any = {
      TARGET: 'targets',
      SYSTEM: 'systems',
      INTERFACE: 'systems',
      SOURCE: 'sources',
    };

    // layout bookkeeping
    const typeCounters: any = { sources: 0, systems: 0, targets: 0 };
    const xMap: any = { sources: 100, systems: 400, targets: 700 };
    const yStart = 90;
    const yStep = 220;

    for (const entity of result) {
      const apiType =
        typeMap[entity.entity_type] ||
        ((entity.entity_type?.toLowerCase?.() || '').concat('s'));

      // ensure counters/x exist for unseen types
      if (!(apiType in typeCounters)) typeCounters[apiType] = 0;
      if (!(apiType in xMap)) xMap[apiType] = 100; // default column if new type appears

      const x = xMap[apiType];
      const y = yStart + typeCounters[apiType] * yStep;

      try {
        const data = await firstValueFrom(
          this.lineageService.getEntityById(apiType, entity.entity_id)
        );
        const parsed = JSON.parse(data.node);

        // one-at-a-time: render after fetching, then increment Y for this type
        await loadExample(this.graph, { x, y }, data, parsed, false);

        typeCounters[apiType] += 1;
      } catch (err) {
        console.error(`Failed to fetch entity for ${apiType} (${entity.entity_id}):`, err);
        // optional: still bump so gaps don't collapse on failures
        // typeCounters[apiType] += 1;
      }
    }
  }


  buildFieldToEntityMap(nodes: any) {
    const map = new Map<number, { nodeId: string; portId: string; entityType: string }>();
    for (const n of nodes) {
      map.set(n.field_id, {
        nodeId: String(n.entity_id), // cell id is the entity_id
        portId: String(n.field_id),  // port id is the field_id
        entityType: n.entity_type
      });
    }
    return map;
  }

  /**
   * Create JointJS Link cells from mapping response.
   * Pass your Link constructor (e.g., `Link`) if it isn't globally available.
   */
  createLinksFromResponse(
    resp: any,
    LinkCtor: any /* e.g., Link class */
  ) {
    const fieldMap = this.buildFieldToEntityMap(resp.nodes);
    const links: any[] = [];
    const missing: any[] = [];

    for (const edge of resp.edges) {
      const from = fieldMap.get(edge.from_field_id);
      const to = fieldMap.get(edge.to_field_id);

      if (!from || !to) {
        // Capture missing mappings for debugging
        missing.push(edge);
        continue;
      }

      // Build the link exactly like your example
      const link = new LinkCtor({
        source: { id: from.nodeId, port: from.portId },
        target: { id: to.nodeId, port: to.portId }
      });

      links.push(link);
    }

    // Optional: log or return missing for diagnostics
    if (missing.length) {
      console.warn('Missing field mappings for edges:', missing);
    }

    return links;
  }

  /**
 * Create visual links between nodes in the graph from API response.
 * @param resp - The response containing edges (and possibly nodes)
 * @param LinkCtor - Optional custom JointJS link class to use
 */
  createLinksFromResponseNew(resp: any, LinkCtor: any) {
    if (!this.graph) {
      console.error('Graph not initialized — cannot create links.');
      return [];
    }

    const res_edges = resp?.edges || [];
    const nodes = resp?.nodes || [];
    const createdLinks: dia.Link[] = [];

    const edges = res_edges.filter(
      (item: { from_field_id: number }) => item.from_field_id === resp?.start.field_id
    );

    if (!edges.length) {
      console.warn('No edges found in response.');
      return [];
    }

    //let edge= edges.find((item: { field_id: number; }) => item.field_id === edge.from_field_id);

    console.log(`Creating ${edges.length} link(s) from response...`);

    for (const edge of edges) {
      try {

        const fromNode = nodes.find((item: { field_id: number; }) => item.field_id === edge.from_field_id);
        const toNode = nodes.find((item: { field_id: number; }) => item.field_id === edge.to_field_id);

        if (!fromNode || !toNode) {
          console.warn('Invalid edge — missing node IDs:', edge);
          continue;
        }
        let fromNodeId = (fromNode.entity_type.toLowerCase() == "source" ? "S-" : fromNode.entity_type.toLowerCase() == "target" ? "TGT-" : "SYS-");
        let toNodeId = (toNode.entity_type.toLowerCase() == "source" ? "S-" : toNode.entity_type.toLowerCase() == "target" ? "TGT-" : "SYS-");

        fromNodeId = (fromNode.entity_type.toLowerCase() == "source" || fromNode.entity_type.toLowerCase() == "target" || fromNode.entity_type.toLowerCase() == "system") ? fromNodeId + fromNode.entity_id : fromNodeId + fromNode.attached_system_id;
        toNodeId = (toNode.entity_type.toLowerCase() == "source" || toNode.entity_type.toLowerCase() == "target" || toNode.entity_type.toLowerCase() == "system") ? toNodeId + toNode.entity_id : toNodeId + toNode.attached_system_id;

        // const sourceElement = this.graph.getCell(fromNodeId.toString());
        // const targetElement = this.graph.getCell(toNodeId.toString());


        const sourceElement = this.graph.getCell(toNodeId.toString());
        const targetElement = this.graph.getCell(fromNodeId.toString());

        if (!sourceElement || !targetElement) {
          console.warn('Skipped edge — node not found in graph:', edge);
          continue;
        }

        // Optional: support port-level connections if present
        // const sourcePort = edge.from_field_id ? edge.from_field_id.toString() : undefined;
        // const targetPort = edge.to_field_id ? edge.to_field_id.toString() : undefined;

        const sourcePort = edge.to_field_id;
        const targetPort = edge.from_field_id;

        const link = new LinkCtor({});
        link.source({ id: sourceElement.id, port: sourcePort });
        link.target({ id: targetElement.id, port: targetPort });

        // const link = new LinkCtor({
        //   source: { id: targetElement.id, port: targetPort },
        //   target: { id: sourceElement.id, port: sourcePort }
        // });


        this.graph.addCell(link);
        createdLinks.push(link);
      } catch (err) {
        console.error('Failed to create link for edge:', edge, err);
      }
    }

    console.log(`✅ Created ${createdLinks.length}/${edges.length} link(s).`);
    return createdLinks;
  }

  createLinksFromEdges(edges: any, fieldIdToNodePortMap: any) {
    const links: dia.Link[] = [];

    edges.forEach((edge: any) => {
      const from = fieldIdToNodePortMap[edge.from_field_id];
      const to = fieldIdToNodePortMap[edge.to_field_id];

      if (from && to) {
        const link = new Link({
          source: { id: from.nodeId, port: from.portId },
          target: { id: to.nodeId, port: to.portId }
        });
        links.push(link);
      } else {
        console.warn('Missing mapping for edge:', edge);
      }
    });

    return links;
  }


  // 3) Now make the mapping flow async, await the API response, then await diagram load, THEN add links
  public async getTargetToSourceMapping(targetId: string, sourceId: string) {
    try {

      const path = this.router.url.split('?')[0].split('#')[0];
      const segments = path.split('/').filter(Boolean);
      const lineageId = (segments[segments.length - 1] || '');
      const usecaseId = (segments[segments.length - 2] || '');

      const response = await firstValueFrom(
        this.lineageService.getTargetToSourceMapping(usecaseId, sourceId)
      );

      console.log('Target to Source Mapping:', response);

      const uniqueEntities = this.getUniqueEntitiesExcludingInterface(response).reverse();
      console.log('Unique Entities to Fetch:', uniqueEntities);

      // Wait until all nodes are placed
      await this.fetchEntitiesFromMapping(uniqueEntities);

      // If you have a fieldIdToNodePortMap, build links from edges:
      // const links = this.createLinksFromEdges(response.edges, fieldIdToNodePortMap);

      // Example: manual link creation (replace ids/ports with real ones)
      // const links = this.createLinksFromResponse(response, Link); // <-- pass your Link class
      // links.forEach(l => this.graph.addCell(l));

      // console.log(links, this.graph.getCells(), 'cells after add');
      // console.log(this.graph.getLinks(), 'links after add');


      this.createLinksFromResponseNew(response, Link);
    } catch (err) {
      console.error('Failed to get target to source mapping:', err);
      this.toastNotificationService.error('Failed to fetch target to source mapping');
    }
  }


  public ngOnInit(): void {
    // This is a good place for initial setup that doesn't require DOM access

    const selectedItem = this.route.snapshot.queryParamMap.get('selectedItem') || '';
    const targetId = this.route.snapshot.queryParamMap.get('targetId') || '';

    if (selectedItem && targetId) {

      this.getTargetToSourceMapping(targetId, selectedItem)

    } else {
      this.loadData();
    }


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
    const lineageId = (segments[segments.length - 1] || '');
    const usecaseId = (segments[segments.length - 2] || '');
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
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 700;

    container.addEventListener('dragover', (e: DragEvent) => e.preventDefault());

    // --- Initialize Graph, Paper, and Scroller ONCE ---
    this.graph = new dia.Graph({}, { cellNamespace: shapes });

    this.paper = new dia.Paper({
      model: this.graph,
      height,
      width,
      gridSize: 10,
      background: { color: '#F3F7F6' },
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
      autoResizePaper: true, // important: disables scroll management
      padding: 0,
      cursor: 'grab'
    });
    this.scroller.positionContent('top-left');
    this.canvas.nativeElement.appendChild(this.scroller.el); // this.scroller.centerContent(); scroller to canvas


    this.paper.on('element:mousewheel', (recordView: dia.ElementView, evt: dia.Event, x: number, y: number, delta: number) => {
      evt.preventDefault();
      const record = recordView.model as any;
      if (!record.isEveryItemInView()) {
        record.setScrollTop(record.getScrollTop() + delta * 10);
      }
    });

    // assuming this.paper is already created and this.graph is set

    // Helper to attach FreeTransform to a clicked element
    const attachFreeTransform = (elementView: dia.ElementView) => {
      // Remove an existing FT first
      this.freeTransform?.remove();

      // Create a new FT for the selected element
      this.freeTransform = new ui.FreeTransform({
        cellView: elementView,
        // --- useful options ---
        allowRotation: false,              // show rotation handle
        allowOrthogonalResize: true,      // side handles
        preserveAspectRatio: false,       // set true for fixed aspect ratio
        useModelGeometry: true,           // respect model's size/angle
        minWidth: 50,
        minHeight: 30,
        maxWidth: 800,
        maxHeight: 600,
        rotateAngleGrid: 15,              // snap rotation to 15°
        scaleGrid: 10                     // snap resize in 10px increments
      });

      // Render and add to the paper DOM so it tracks the element position
      this.freeTransform.render();
      this.paper.el.appendChild(this.freeTransform.el);

      // (Optional) listen when user finishes actions
      this.freeTransform.on('action:stop', () => {
        const element = elementView.model as dia.Element;
        const size = element.size();
        const angle = element.get('angle');
        // Persist or react to new geometry here
        // console.log('Resized to', size, 'angle', angle);
      });
    };

    // Attach FT on click
    this.paper.on('element:pointerclick', (elementView: dia.ElementView) => {
      console.log("pointerclick", elementView);
      attachFreeTransform(elementView);
    });

    // Remove FT when clicking on blank area
    this.paper.on('blank:pointerdown', () => {
      console.log("pointerdown");
      this.freeTransform?.remove();
      this.freeTransform = undefined;
    });


    this.paper.on('link:mouseenter', (linkView: dia.LinkView) => {
      this.showLinkTools(linkView);
    });

    this.paper.on('link:mouseleave', (linkView: dia.LinkView) => {
      linkView.removeTools();
    });

    this.graph.on('add', (cell) => {
      if ((cell as any).get('type') === 'mapping.Concat') {
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
        // this.scroller.centerContent();
        this.scroller.positionContent('top-left');

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
    const idToNormalizedTypeName: any = {};
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
        let resolvedParentId = portParentMap?.[portId]?.split('_')[3] ? `${portParentMap?.[portId]?.split('_')[3]}-${portParentMap?.[portId]?.split('_')[4]}` : nodeId;

        if (resolved) {
          cell[endpoint] = { ...(ep || {}), type: resolved, parentId: resolvedParentId };
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
    const linkId = this.route.snapshot.queryParamMap.get('linkId') || '';
    const usecaseId = (segments[segments.length - 2] || '');

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

  loadGraphFromJSON(json: any, sourcedata: any, targetdata: any) {
    this.graph.clear();
    let graphJson = JSON.parse(json);
    let sourceJson = JSON.parse(sourcedata.node);
    let targetJson = JSON.parse(targetdata.node);
    console.log("graphJson", graphJson);
    console.log("sourceJson", sourceJson);
    console.log("targetJson", targetJson);
    // Example: change label text for system node
    graphJson.cells.forEach((cell: any) => {
      if (cell.id == sourceJson.id) {
        cell.attrs.headerLabel.textWrap.text = sourceJson.name;
        let newItems = this.getPortItems(sourceJson);
        cell.items = newItems;
      }
      else if (cell.id == targetJson.id) {
        cell.attrs.headerLabel.textWrap.text = targetJson.name;
        let newItems = this.getPortItems(targetJson);
        cell.items = newItems;
      }
    });

    // Load modified JSON into JointJS graph
    this.graph.fromJSON(graphJson);
    //this.graph.fromJSON(JSON.parse(json));   
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

  getPortItems(jsonObject: any) {
    let result = buildTypeHierarchy(jsonObject?.ports || []);
    let targetData: any = []
    let sourceData: any = []
    if (jsonObject?.type === "target") {
      targetData = result.in[0].items
    }
    if (jsonObject?.type === "source") {
      sourceData = result.out[0]?.items || []
    }

    let dataToPass = []

    if (jsonObject?.type === "source") {
      dataToPass = [[], [...sourceData]]
    } else if (jsonObject?.type === "target") {
      dataToPass = [targetData]
    } else {
      dataToPass = [result.in, result.out]
    }
    return dataToPass;
  }
}
