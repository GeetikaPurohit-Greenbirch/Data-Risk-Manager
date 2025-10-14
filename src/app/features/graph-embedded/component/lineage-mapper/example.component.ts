
import { dia } from '@joint/plus';
import { Link, Constant, Concat, GetDate, Record, SingleBlock } from './shapes.component';

// Import blockDefinitions from its separate file
import { blockDefinitions } from './block-definitions';


type Port = {
    id: string;
    name: string;
    group?: 'in' | 'out';
    type?: 'interface' | 'system' | string;
    interfaceId?: string;
    interfaceName?: string;
};

type ParentNode = {
    id: string;
    label: string;
    icon: string;
    items: Array<{ id: string; label: string; icon: string, type?: string }>;
    group?: string;
};

type BuildResult = {
    ports: Port[];               // ports missing `type`
    items: [ParentNode[], ParentNode[]]; // [inParents, outParents]
};

/** Sanitize a slightly-broken JSON (fix `,,` and trailing comma before ] or }) */
function sanitizeJson(s: string): string {
    return s
        .replace(/,\s*,/g, ',')      // fix double commas
        .replace(/,\s*([\]}])/g, '$1'); // remove trailing commas before ] or }
}

type RecordItem = { id: string; label: string; icon?: string };
// type ParentNode = { id: string; label: string; icon?: string; items: RecordItem[] };

type Hierarchy = {
    in: ParentNode[];
    out: ParentNode[];
    noType: Port[];                // ports missing/empty `type` (if you want to inspect)
};

export function buildTypeHierarchy(raw: Port[]): Hierarchy {
    const noType: Port[] = [];
    const inMap = new Map<string, ParentNode>();
    const outMap = new Map<string, ParentNode>();

    const slug = (v: any) =>
        String(v ?? '')
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '');

    type G = 'in' | 'out';
    const makeId = (g: G, ...parts: (string | number | null | undefined)[]) =>
        `${g}__${parts.map(slug).filter(Boolean).join('_')}`;

    const ensureParent = (
        map: Map<string, ParentNode>,
        key: string,
        g: G,
        idTokens: (string | number | null | undefined)[],
        label: string,
        icon = ' '
    ): ParentNode => {
        let p = map.get(key);
        if (!p) {
            p = { id: makeId(g, ...idTokens), label, icon, items: [] };
            map.set(key, p);
        }
        p.group = 'disabled'
        return p;
    };

    for (const p of raw) {
        const hasType = typeof p?.type === 'string' && p.type.trim().length > 0;
        if (!hasType) {
            noType.push(p);
            continue;
        }

        const g: G = p.group === 'out' ? 'out' : 'in';
        const target = g === 'in' ? inMap : outMap;
        const typeNorm = String(p.type).trim().toLowerCase();

        let parentKey: string;
        let parentLabel: string;
        let idTokens: (string | number | null | undefined)[];

        if (typeNorm === 'interface') {
            const id = p.interfaceId ?? 'unknown';                    // used for ID
            const name = (p.interfaceName ?? '').trim();              // used for label
            const label = name || `#${id}`;

            parentKey = `interface:${slug(id)}`;                      // use ID for grouping
            idTokens = ['interface', id];                             // use ID for makeId()
            parentLabel = label;                                      // keep label as name
        }
        else if (typeNorm === 'system') {
            parentKey = 'system';
            idTokens = ['system'];
            parentLabel = 'System'; // 👈 keep System (not SYSTEM)
        } else {
            const t = String(p.type).trim();
            parentKey = `type:${slug(t)}`;
            idTokens = ['type', t];
            parentLabel = t.charAt(0).toUpperCase() + t.slice(1);
        }

        const parent = ensureParent(target, parentKey, g, idTokens, parentLabel);
        parent.items.push({
            id: String(p.id ?? parent.items.length),  // 👈 Only use original port id
            label: String(p.name ?? '').trim() || String(p.id ?? ''),
            icon: ' ',
            type: p.type
        });

    }

    return {
        in: Array.from(inMap.values()),
        out: Array.from(outMap.values()),
        noType
    };
}


const getColorByTab = (type: string) => {
    switch (type) {
        case 'Source':
            return '#fe4365';
        case 'System':
            return '#14bc9b';
        case 'Target':
            return '#4a90e2';
        case 'Controls':
            return '#f5d300';
        default:
            return '#ccc'; // Default color if type doesn't match any case
    }
}




export const loadExample = function (graph: dia.Graph, selectedValue: any, droppedBlockData: any, selectedItem: any, applyMaxHeight:any): void {

    console.log("Dropped block data:Dropped block data:Dropped block data:Dropped block data:Dropped block data:", selectedItem);

    let typeOfBlock = ""

    if (selectedItem.type === "source") {
        typeOfBlock = "sources"

    } else if (selectedItem.type === "system") {
        typeOfBlock = "systems"
    } else if (selectedItem.type === "target") {
        typeOfBlock = "targets"
    } else if (selectedItem.type === "control") {
        typeOfBlock = "controls"
    }

    const blockDefinition: any = blockDefinitions.find((b: any) => b.typeName === typeOfBlock);

    if(applyMaxHeight){
        blockDefinition.size= { width: blockDefinition.size.width, height: 500}
    }

    if (!blockDefinition) {
        console.warn("Block definition not found for typeName: ${droppedBlockData.typeName}");
        return;
    }

    // Get the drop coordinates from the block data passed from DiagramComponent
    const dropX = selectedValue.x !== undefined ? selectedValue.x : 100;
    const dropY = selectedValue.y !== undefined ? selectedValue.y : 100;

    let newCell: dia.Element | null = null;
    switch (blockDefinition.type) {
        case 'Constant':
            newCell = new Constant({
                position: { x: dropX, y: dropY },
                size: blockDefinition.size,
                // icon: blockDefinition?.sicon,
                attrs: {
                    label: { text: blockDefinition.label || blockDefinition.typeName },
                    body: { fill: blockDefinition.color || '#fff', border: '2px solid #cfd8dc' },
                    tabColor: {
                        height: 5,
                        x: 0,
                        y: 0,
                        width: 'calc(w)',
                        fill: blockDefinition.label === 'Source' ? '#fe4365' : '#14bc9b',
                        stroke: blockDefinition.label === 'Source' ? '#fe4365' : '#14bc9b'
                    },
                },
                // ports: blockDefinition.ports || []
            }).setValue(selectedValue);
            // Set the icon after the cell is created
            if (blockDefinition?.sicon) {
                (newCell as Constant).setIcon(blockDefinition.sicon);
            }

            if (blockDefinition.ports?.length) {
                newCell.addPorts(blockDefinition.ports);
            }

            break;

        case 'Record':
            newCell = new Record({
                position: { x: dropX, y: dropY },
                icon: blockDefinition?.sicon,
                items: [
                    droppedBlockData?.allItems
                ]
                ,
                ports: blockDefinition.ports || [],
            }).setName(selectedValue || blockDefinition.typeName)
            // Set the icon after the cell is created
            if (blockDefinition?.sicon) {
                (newCell as Record).setIcon(blockDefinition.sicon);
            }
            break;

        case 'Concat':
            let result = buildTypeHierarchy(selectedItem?.ports || []);
            let targetData: any = []
            let sourceData: any = []
            if (selectedItem?.type === "target") {
                targetData = result.in[0].items
            }
            if(selectedItem?.type === "source"){
                sourceData = result.out[0]?.items || []
            }           

            let dataToPass = []

            if(selectedItem?.type === "source"){
                dataToPass=[[],[...sourceData]]
            }else if(selectedItem?.type === "target"){
                dataToPass=[targetData]
            }else{
                dataToPass=[result.in,result.out]
            }

            //console.log(dataToPass, result, "resultresultresultresultresultresultresultresultresultresultresultresultresultresult")

            console.log(result, "buildPortsAndItems result", blockDefinition)
            newCell = new Concat({
                position: { x: dropX, y: dropY },
                size: blockDefinition.size,
                typeName: blockDefinition.typeName,
                id: selectedItem?.id,
                attrs: {
                    label: { text: blockDefinition.label || blockDefinition.typeName },
                    typeName: blockDefinition.typeName,
                    body: { fill: blockDefinition.color || '#fff', border: '2px solid #cfd8dc' },
                    tabColor: {
                        height: 5,
                        x: 0,
                        y: 0,
                        width: 'calc(w)',
                        fill: getColorByTab(blockDefinition.label),
                        stroke: getColorByTab(blockDefinition.label),
                    },
                },


            }).setName(selectedItem.name || blockDefinition.typeName)
                .setItems(dataToPass)
            //   .addPorts(result.noType)

            //   newCell.attr('forksGroups/stroke', 'lightgray');
            //     .setName(selectedValue || blockDefinition.typeName)
            //     .addPorts(result.ports)

            //  (newCell as Concat).setName(selectedValue || blockDefinition.typeName);
            if (blockDefinition?.sicon) {
                (newCell as Concat).setIcon(blockDefinition.sicon);
            }

            break;

        case 'GetDate':
            newCell = new GetDate({
                position: { x: dropX, y: dropY },
                size: blockDefinition.size,
                attrs: { label: { text: blockDefinition.label || blockDefinition.typeName } }
            });
            break;

        case 'SingleBlock':
            newCell = new SingleBlock({
                position: { x: dropX, y: dropY },
                size: blockDefinition.size,
                attrs: {
                    title: { text: selectedValue || blockDefinition.typeName }
                }
            });

            if (blockDefinition.ports?.length) {
                newCell.addPorts(selectedItem?.ports);
            }


            break;

        default:
            console.warn("Unsupported JointJS shape type for instantiation: ${blockDefinition.type}");
            break;
    }

    if (newCell) {
        console.log("New cell created:", newCell);
        graph.addCell(newCell);

    }

}
