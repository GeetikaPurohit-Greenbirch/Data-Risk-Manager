
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

// export function buildPortsAndItems(input: string | { ports: Port[] }): BuildResult {
//   let obj: any;

//   if (typeof input === 'string') {
//     try { obj = JSON.parse(input); }
//     catch { obj = JSON.parse(sanitizeJson(input)); }
//   } else {
//     obj = input;
//   }

//   const ports: Port[] = Array.isArray(obj?.ports) ? obj.ports : [];

//   const noType: Port[] = [];
//   const inMap = new Map<string, ParentNode>();
//   const outMap = new Map<string, ParentNode>();

//   type G = 'in' | 'out';

//   const slug = (v: any) =>
//     String(v ?? '')
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '_')
//       .replace(/^_+|_+$/g, '');

//   const makeId = (group: G, ...parts: (string | number | null | undefined)[]) =>
//     `${group}__${parts.map(slug).filter(Boolean).join('_')}`;

//   const ensureParent = (
//     map: Map<string, ParentNode>,
//     key: string,
//     group: G,
//     idTokens: (string | number | null | undefined)[],
//     label: string,
//     icon: string
//   ): ParentNode => {
//     let p = map.get(key);
//     if (!p) {
//       p = { id: makeId(group, ...idTokens), label, icon, items: [] };
//       map.set(key, p);
//     }
//     return p;
//   };

//   for (const p of ports) {
//     if (!p?.type) {
//       noType.push(p);
//       continue;
//     }

//     const group: G = p.group === 'out' ? 'out' : 'in';
//     const target = group === 'in' ? inMap : outMap;

//     let parentKey: string;
//     let parentLabel: string;
//     let idTokens: (string | number | null | undefined)[];

//     if (p.type === 'interface') {
//       // Group strictly by interfaceId; label with interfaceName
//     const iid = p.interfaceId ?? 'unknown';
//   parentKey = `interface:${iid}`;
//   idTokens = ['interface', iid];
//   parentLabel = String(p.interfaceName ?? `#${iid}`); 
//     } else if (p.type === 'system') {
//       parentKey = 'system';
//       idTokens = ['system'];
//       parentLabel = 'SYSTEM'; // 👈 keep SYSTEM
//     } else {
//       const t = String(p.type);
//       parentKey = `type:${t}`;
//       idTokens = ['type', t];
//       parentLabel = t.charAt(0).toUpperCase() + t.slice(1);
//     }

//     const parent = ensureParent(target, parentKey, group, idTokens, parentLabel, ' ');
//     parent.items.push({
//       id: makeId(group, 'port', p.id), // unique per group
//       icon: ' ',
//       label: String(p.name)
//     });
//   }

//   return {
//     ports: noType,
//     items: [Array.from(inMap.values()), Array.from(outMap.values())]
//   };
// }


// type Port = {
//   id?: string | number;
//   name?: string;
//   type?: string;                 // e.g., "INTERFACE" | "SYSTEM" | ...
//   group?: 'in' | 'out';
//   interfaceId?: string | number;
//   interfaceName?: string;
// };

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
            // Group by interfaceName; label should be interfaceName (fallback to #<id>)
            const name = (p.interfaceName ?? '').trim();
            const label = name || `#${p.interfaceId ?? 'unknown'}`;
            parentKey = `interface:${slug(label)}`;         // use name as key (so id/label align)
            idTokens = ['interface', label];
            parentLabel = label;
        } else if (typeNorm === 'system') {
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
            id: makeId(g, 'port', p.id ?? parent.items.length),
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




export const loadExample = function (graph: dia.Graph, selectedValue: string, droppedBlockData: any, selectedItem: any, selectedItemDetails: any): void {

    const blockDefinition: any = blockDefinitions.find((b: any) => b.typeName === droppedBlockData.typeName);
    console.log(blockDefinition, "blockDefinition", selectedValue, selectedItem, selectedItemDetails)

    if (!blockDefinition) {
        console.warn("Block definition not found for typeName: ${droppedBlockData.typeName}");
        return;
    }

    // Get the drop coordinates from the block data passed from DiagramComponent
    const dropX = droppedBlockData.x !== undefined ? droppedBlockData.x : 100;
    const dropY = droppedBlockData.y !== undefined ? droppedBlockData.y : 100;

    let newCell: dia.Element | null = null;
    let itemsToDisplay: any[] = []; // To hold the filtered items for Record types

    // Determine items to display for Record types (specifically the 'Target' block)
    if (blockDefinition.type === 'Record' && blockDefinition.typeName === 'Target' && blockDefinition.itemMappings) {
        const mappedItemIds = blockDefinition.itemMappings[selectedValue];
        if (mappedItemIds) {
            itemsToDisplay = (blockDefinition.allItems || []).filter((item: any) =>
                mappedItemIds.includes(item.id)
            );
        } else {
            console.warn("No item mapping found for selectedValue: ${selectedValue} in Target block. Displaying all items.");
            itemsToDisplay = blockDefinition.allItems || [];
        }
    }
    // Create the JointJS cell based on the block's 'type' property
    switch (blockDefinition.type) {
        case 'Constant':
            newCell = new Constant({
                position: { x: dropX, y: dropY },
                size: blockDefinition.size,
                // icon: blockDefinition?.sicon,
                id:selectedItemDetails?.id,
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
            const result = buildTypeHierarchy(selectedItemDetails?.ports || []);
            //console.log(result, "buildPortsAndItems result")

            let targetData: any = []
            if (selectedItemDetails?.type === "target") {
                targetData = result.in[0].items

            }
            const dataToPass = selectedItemDetails?.type === "target" ? [targetData] : [result.in, result.out]
            let controlName="";
            if(selectedItemDetails?.controls?.length>0)
            {
                 controlName = selectedItemDetails?.controls[0].name;
            }
            // if (result.ports.length === 0) {
            newCell = new Concat({
                position: { x: dropX, y: dropY },
                size: blockDefinition.size,
                typeName: blockDefinition.typeName,
                 id:selectedItemDetails?.id,
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
                    }                 
                },
            }).setName(selectedValue || blockDefinition.typeName)
            .setName2(controlName)              
            .addPorts(result.noType)

            newCell.attr('forksGroups/stroke', 'lightgray');
            //(newCell as Concat).setCaretIcon()
            //(newCell as Concat).setRmoveIcon("assets/images/remove.svg")

            if(selectedItemDetails?.type === "target"){
                (newCell as Concat).setItems(dataToPass)
            }

            //     .setName(selectedValue || blockDefinition.typeName)
            //     .addPorts(result.ports)

            //  (newCell as Concat).setName(selectedValue || blockDefinition.typeName);
            if (blockDefinition?.sicon) {
                (newCell as Concat).setIcon(blockDefinition.sicon);
            }
            if (blockDefinition?.cicon && controlName!="") {
                (newCell as Concat).setIcon2(blockDefinition.cicon);
            }
            if(blockDefinition?.reportIcon && blockDefinition?.detailIcon){
                (newCell as Concat).setHeaderActions(blockDefinition?.reportIcon,blockDefinition?.detailIcon);
                // (newCell as Concat).setHeaderActions2(blockDefinition?.detailIcon);        
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
                newCell.addPorts(selectedItemDetails?.ports);
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
