
import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Inject,
  PLATFORM_ID,
  Output,
  EventEmitter,
  ViewEncapsulation
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
import { Router, ActivatedRoute } from '@angular/router';
import { Link, Constant, Concat, GetDate, Record } from './shapes.component';
import { Decorator } from './highlighter.component';
import { SourceArrowhead, TargetArrowhead, Button, NavigateButton } from './link-tools.component';
import { routerNamespace } from './routers.component';
import { anchorNamespace } from './anchors.component';
import { loadExample } from './example.component';
import { MatDialog } from '@angular/material/dialog';
import { NodeDropModalComponent } from 'src/app/node-drop-modal/node-drop-modal.component';
import { L001, L002, L003 } from './diagrams';
import { map, filter, switchMap, catchError, takeUntil } from 'rxjs/operators';
import { Subject, of } from 'rxjs';
import { LineageService } from '../../services/lineage.service';
import { ToastnotificationService } from 'src/app/features/shared-services/toastnotification.service';
import { finalize } from 'rxjs/operators';



type Records = Constant | Concat | GetDate | Record;

export type LineageRecord = {
  createdBy: string;
  createdAt: string;   // ISO string
  updatedAt: string;   // ISO string
  id: number;
  name: string;        // e.g. "L005"
  use_case_id: number; // e.g. 7
  lineage_json: string; // JSON string of the graph
};



@Component({
  selector: 'app-diagram',
  templateUrl: './diagram.component.html',
  styleUrls: ['./diagram.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DiagramComponent implements AfterViewInit {

  @Output() toggle = new EventEmitter<void>();


  @ViewChild('canvas') canvas!: ElementRef;
  hasGraph: boolean = false;
  graph!: dia.Graph;
  paper!: dia.Paper;
  scroller!: ui.PaperScroller;
  scale: number = 1;
  scaleDisplay: number = 100;
  diagramCollapsed = false;
  use_case_id!: string;
  private freeTransform?: ui.FreeTransform;


  constructor(
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private lineageService: LineageService,
    private toastNotificationService: ToastnotificationService,
    @Inject(PLATFORM_ID) private platformId: Object,


  ) { }

  loading = false;
  errorMsg = '';
  lineages: LineageRecord | null = {
    createdBy: '',
    createdAt: '',
    updatedAt: '',
    id: 0,
    name: '',
    use_case_id: 0,
    lineage_json: ''

  };

  private destroy$ = new Subject<void>();



  public ngOnInit(): void {


    this.route.paramMap.pipe(
      // Try both common param names; keep whichever your route uses
      map(params => params.get('usecaseId') ?? params.get('use_case_id') ?? params.get('id')),
      filter((id): id is string => !!id && id.trim().length > 0),
      switchMap((usecaseId: string) =>
        this.lineageService.getLineageByUseCaseId(usecaseId).pipe(
          catchError(err => {
            console.error('Failed to fetch lineages by usecaseId:', err);
            this.errorMsg = 'Could not load lineage data.';
            return of<LineageRecord | null>(null);
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe((lineages: LineageRecord | null) => {
      this.lineages = lineages;
      console.log('Fetched lineages:', lineages);
      const useCaseId = lineages?.use_case_id ?? null;
      console.log('Use Case ID:', useCaseId);

      this.loadGraphFromJSON(lineages?.lineage_json || {});
      this.loading = false;


      // If you also need to feed AG Grid or a graph lib, do it here:
      // this.gridApi?.setRowData(this.lineages);
      // this.graph.loadFromLineages(this.lineages);
    });

  }

  public onNavigate(link: dia.Link) {
    // Pull anything you want to pass along (optional)

    this.saveGraph(true); // Save current state before navigating

    const source = link.get('source');
    const target = link.get('target');

    const linkId = link.id as string;
    const sourceId = (source?.id ?? source?.cell ?? null) as string | null;
    const targetId = (target?.id ?? target?.cell ?? null) as string | null;

    console.log(link.getSourceElement()?.attributes['typeName'], source, sourceId, target, targetId, 'Navigating with link');


    const path = this.router.url.split('?')[0].split('#')[0];
    const segments = path.split('/').filter(Boolean);
    const layoutId = (segments[segments.length - 1] || '').toUpperCase();
    const useCaseId = (segments[segments.length - 2] || '').toUpperCase();
    const sourceType = `source-${link.getSourceElement()?.attributes['typeName'] || `${link.getSourceElement()?.attributes?.attrs?.['label']?.text?.toLowerCase()}s`}`
    const targetType = `target-${link.getTargetElement()?.attributes['typeName'] || `${link.getTargetElement()?.attributes?.attrs?.['label']?.text?.toLowerCase()}s`}`

    this.router.navigate([
      '/graph-embedded/lineage-mapping/',
      useCaseId,
      layoutId
    ],
      {
        queryParams: {
          linkId: linkId,
          [sourceType]: source.port.split('-')[0],
          [targetType]: target.port.split('-')[0],
        }
      }
    );
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
        }),
        new NavigateButton({
          distance: '50%',
          action: () => {
            this.onNavigate(linkView.model as Link); // ✅ 'this' is now bound correctly
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

  public normalizeTypeName(typeName: string) {
    switch (typeName.toLowerCase()) {
      case "sources":
        return "SOURCE";
      case "systems":
        return "SYSTEM";
      case "interfaces":
        return "INTERFACE";
      case "targets":
        return "TARGET";
      case "control":
        return "CONTROLS";
      default:
        return typeName.toUpperCase();
    }
  }

  public enrichLinksWithNormalizedTypeName(json: any) {
    const idToNormalizedTypeName: any = {};

    // Step 1: Map Concat node IDs to normalized typeNames
    json.cells.forEach((cell: any) => {
      if (cell.type === "mapping.Concat" && cell.id && cell.attrs?.typeName) {
        const rawTypeNameObj = cell.attrs.typeName;
        const rawTypeName = Object.values(rawTypeNameObj).join(""); // e.g., {0:'s',1:'y'...} → "systems"
        const normalized = this.normalizeTypeName(rawTypeName);
        idToNormalizedTypeName[cell.id] = normalized;
      }
    });

    // Step 2: Add normalized typeNames to link source/target
    json.cells.forEach((cell: any) => {
      if (cell.type === "mapping.Link") {
        if (cell.source?.id && idToNormalizedTypeName[cell.source.id]) {
          cell.source.type = idToNormalizedTypeName[cell.source.id];
        }
        if (cell.target?.id && idToNormalizedTypeName[cell.target.id]) {
          cell.target.type = idToNormalizedTypeName[cell.target.id];
        }
      }
    });

    return json;
  }


  public tracePathNew(element: dia.Element, portId: string): boolean {
    const incomingLinks = this.graph.getConnectedLinks(element, {
      inbound: true
    });
    const filteredLinks = incomingLinks.filter(link => {
      const target = link.get('target');
      return target?.port === portId;
    });
    for (const link of incomingLinks) {
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

    (shapes as any).mapping = (shapes as any).mapping || {};
    (shapes as any).mapping.Concat = Concat;
    const container = this.canvas.nativeElement;
    const width = container.clientWidth || 1000;
    const height = container.clientHeight || 700;

    container.addEventListener('dragover', (e: DragEvent) => e.preventDefault());

    // --- Initialize Graph, Paper, and Scroller ONCE ---
    this.graph = new dia.Graph({

    }, { cellNamespace: shapes });

    this.paper = new dia.Paper({
      model: this.graph,
      // background: {
      //   color: '#F8F9FA',
      // },
      height,
      width,
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
      validateMagnet: (cellView: dia.CellView, magnetEl: SVGElement) => {
        // If it's not a Concat element, don’t constrain here
        if (cellView.model.get('type') !== 'mapping.Concat') return true;

        const sel = magnetEl.getAttribute('joint-selector') || '';
        // Allow only the actual port graphic, not item labels/bodies/etc.
        return sel === 'portBody';
      },

      // Allow connecting ONLY to ports on Concat; disallow items
      validateConnection: (sv, sm, tv, tm) => {
        // Require both magnets
        if (!sm || !tm) return false;

        // If source is a Concat, its magnet must be the port circle
        if (sv && sv.model.get('type') === 'mapping.Concat') {
          const sSel = sm.getAttribute('joint-selector') || '';
          if (sSel !== 'portBody') return false;
        }

        // If target is a Concat, its magnet must be the port circle
        if (tv && tv.model.get('type') === 'mapping.Concat') {
          const tSel = tm.getAttribute('joint-selector') || '';
          if (tSel !== 'portBody') return false;
        }

        // otherwise OK
        return true;
      },

    });

    this.paper.setDimensions(500, 500);

    this.scroller = new ui.PaperScroller({
      paper: this.paper,
      autoResizePaper: true, // important: disables scroll management
      padding: 0,
      // baseWidth: 500,
      // baseHeight: 500,
      cursor: 'grab'
    });

    // Create tooltip element once
    const tooltipEl = document.createElement('div');
    tooltipEl.id = 'jointjs-tooltip';
    tooltipEl.style.position = 'fixed';
    tooltipEl.style.background = '#333';
    tooltipEl.style.color = '#fff';
    tooltipEl.style.padding = '6px 10px';
    tooltipEl.style.borderRadius = '6px';
    tooltipEl.style.fontSize = '12px';
    tooltipEl.style.whiteSpace = 'pre'; // preserve line breaks
    tooltipEl.style.pointerEvents = 'none';
    tooltipEl.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
    tooltipEl.style.zIndex = '9999';
    tooltipEl.style.display = 'none';
    document.body.appendChild(tooltipEl);

    // Tooltip events
    this.paper.on('cell:mouseenter',  (cellView, evt) => {
      const target = evt.target as SVGElement;
      const selector = target.getAttribute('joint-selector');

      if (selector === 'headerLabel2') {
        const tooltipText = cellView.model.attr('headerLabel2/title');
        if (tooltipText) {
          tooltipEl.textContent = tooltipText;
          tooltipEl.style.display = 'block';
        }
      }
    });

    this.paper.on('cell:mousemove', (cellView, evt) => {
      const target = evt.target as SVGElement;
      const selector = target.getAttribute('joint-selector');

      if (selector === 'headerLabel2') {
        tooltipEl.style.left = evt.clientX + 10 + 'px';
        tooltipEl.style.top = evt.clientY + 10 + 'px';
      }
    });

    this.paper.on('cell:mouseleave', () => {
      tooltipEl.style.display = 'none';
    });

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
      //attachFreeTransform(elementView);
    });

    this.paper.on('element:remove:pointerdown', function (elementView, evt) {
      evt.stopPropagation();
      const cell = elementView.model;
      cell.remove(); // removes from graph
    });

    this.paper.on('element:pointerdblclick', (elementView, evt) => {
      evt.stopPropagation();
      const node = elementView.model;
      console.log("elementViewNode", node);
      const nodeId = node.id.toString();
      if (nodeId) {
        const parts = nodeId.split("-");
        const type = parts[0]; // "SYS"
        const id = parts[1]; // "21"
        const isBacktolineage=true;
        if (type == "S") {
          this.router.navigate(['sources/edit-source/', id,isBacktolineage]);
        }
        else if (type == "SYS") {
          
          this.router.navigate(['systems/edit-system/', id,isBacktolineage]);
        }
        else if (type == "TGT") {
          this.router.navigate(['targets/edit-target/', id,isBacktolineage]);
        }
      }
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

    // Collapse/expand on header or caret click (works with our Concat.toggleCollapse)
    this.paper.on('element:pointerdown', (view: dia.ElementView, evt: dia.Event) => {
      const model = view.model as any;
      if (model.get?.('type') !== 'mapping.Concat') return;

      const targetEl = evt.target as Element;

      // helper: does the clicked node (or its ancestors) carry a given joint-selector?

      const hit = (sel: string) => !!targetEl.closest?.(`[joint-selector="${sel}"]`);

      // treat label/icon as header clicks too (they are siblings of the header rect)
      const clickedCaret = !!targetEl.closest?.('[joint-selector="caret"]');

      // const clickedHeader = hit('header') || hit('headerLabel') || hit('headerIcon');


      if (clickedCaret) {
        evt.preventDefault();
        evt.stopPropagation?.();
        if (typeof model.toggleCollapse === 'function') {
          model.toggleCollapse();
        } else {
          // fallback collapse/expand (path-form keeps TS happy)
          const collapsed = !!model.get('collapsed');
          if (!collapsed) {
            const sz = model.size();
            model.set('expandedSize', sz);
            model.attr('body/display', 'none');
            model.attr('items/display', 'none');
            model.attr('footer/display', 'none');
            model.attr('caret/transform', 'rotate(-90 6 6)');
            model.resize(sz.width, (model.attr('header/height') as number) || 35);
            model.set('collapsed', true);
          } else {
            model.removeAttr('body/display');
            model.removeAttr('items/display');
            model.removeAttr('footer/display');
            model.removeAttr('caret/transform');
            const esz = (model.get('expandedSize') as { width: number; height: number }) ?? {
              width: model.size().width,
              height: 200
            };
            model.resize(esz.width, esz.height);
            model.set('collapsed', false);
          }
        }
      }
    });

    this.paper.on('element:action1:pointerdown', (view: dia.ElementView, evt: dia.Event) => {
      const model = view.model as any;
      const targetId = model.get?.('id');
      this.toggle.emit(targetId);
    })

    this.paper.on('element:action2:pointerdown', (view: dia.ElementView, evt: dia.Event) => {
      console.log("helllllllllooo")

    })


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
      if (cell.get('type') === 'mapping.Concat') {
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


      ///below should be uncommentd



      // const path = this.router.url.split('?')[0].split('#')[0];
      // const segments = path.split('/').filter(Boolean);
      // const layoutId = (segments[segments.length - 1] || '').toUpperCase();
      // const useCaseId = (segments[segments.length - 2] || '').toUpperCase();

      // console.log(itemId,model,"modelmodelmodel")
      //  const selectedField = itemId ? itemId.split('_').pop() : '';

      //    this.router.navigate([
      //   '/graph-embedded/lineage-mapping/',
      //   useCaseId,
      //   layoutId
      // ],
      //   {
      //     queryParams: {
      //         selectedItem:selectedField,
      //         targetId: model?.get('id')

      //     }
      //   }
      // );

    });


    // --- Drop Event Listener (now only adds to existing graph) ---
    container.addEventListener('drop', (e: DragEvent) => {
      e.preventDefault();

      const block = JSON.parse(e.dataTransfer?.getData('block') || '{}');

      // Add the actual drop coordinates to the block data
      const paperLocalPoint = this.paper.clientToLocalPoint({ x: e.clientX, y: e.clientY });
      block.x = paperLocalPoint.x;
      block.y = paperLocalPoint.y;
      console.log('Dropped block:', block);

      this.lineageService.getAllByEntityType(block.typeName).subscribe({
        next: (data: any) => {

          const base = (block.label || '').toLowerCase(); // e.g., 'source'
          const nameKey = `${base}_name`; // 'source_name'
          const idKey = `${base}_id`;   // 'source_id'

          const items = (data ?? []).map((d: any) => {
            const row = d?.[`${base}Entity`] ?? d; // handle nested or flat
            return {
              label: String(row?.[nameKey] ?? '').trim(),
              value: row?.[idKey] ?? row?.id ?? row?.source_id // fallback if needed
            };
          });

          console.log('Fetched items for', block.typeName, items);
          const dialogRef = this.dialog.open(NodeDropModalComponent, {
            width: '360px',
            disableClose: true,
            data: { ...block, data, items }
          });

          dialogRef.afterClosed().subscribe((selectedValue: string | null) => {
            console.log('Dialog result:', selectedValue);
            if (!selectedValue) return; // User canceled

            const selectedItem = (data ?? []).map((d: any) => {
              const row = d?.[`${base}Entity`] ?? d;
              return {
                ...row
              };
            }).filter((item: any) => item?.[`${base}_name`] === selectedValue)[0];

            this.lineageService.getEntityById(block.typeName, selectedItem?.[`${base}_id`] ?? 0).subscribe({
              next: (fullData: any) => {
                console.log(fullData, "fullDat")
                const parsedData = JSON.parse(fullData.node)
                loadExample(this.graph, selectedValue, block, selectedItem, parsedData);
              },
              error: (error: any) => {
                console.log(error)
              }
            })


            // Add element to graph with the returned selection

          });


        },
        error: (err) => {
          console.error('Failed to fetch sources:', err);
        }
      })
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

  saveGraph(fromNavigation: boolean = false) {
    const json = this.graph.toJSON();

    const ddata = this.enrichLinksWithNormalizedTypeName(json);
    console.log('Graph JSON:', ddata);
    const jsonString = JSON.stringify(ddata, null, 2); // Pretty print

    // const blob = new Blob([jsonString], { type: 'application/json' });
    // const url = URL.createObjectURL(blob);

    // const link = document.createElement('a');
    // link.href = url;
    // link.download = 'diagram.json'; // Change name if needed
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
    // URL.revokeObjectURL(url); // Clean up


    this.lineageService.saveLineageById(this.lineages as any, jsonString).subscribe({
      next: (response) => {
        console.log("Lineage saved successfully:", response);
        if (fromNavigation) return; // Skip notification if from navigation
        this.toastNotificationService.success('Lineage Saved successfully');
      },
      error: (err) => {
        console.error("Failed to save lineage:", err);
      }
    });


  }

  goBack = () => {
    this.router.navigate(['/graph-embedded']);
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
    console.log('Loading graph from JSON:', json);
    if (json != undefined && json != "{}") {
      this.graph.fromJSON(JSON.parse(json));
      this.scroller.centerContent();
      this.hasGraph = true;
    }
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

  toggleDiagram() {
    this.diagramCollapsed = !this.diagramCollapsed;
  }
}


