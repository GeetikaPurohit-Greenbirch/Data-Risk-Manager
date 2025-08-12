
import { dia } from '@joint/plus';
import { Link, Constant, Concat, GetDate, Record, SingleBlock } from './shapes.component';

// Import blockDefinitions from its separate file
import { blockDefinitions } from './block-definitions';

export const loadExample = function (graph: dia.Graph, selectedValue: string, droppedBlockData: any): void {

    const blockDefinition: any = blockDefinitions.find((b: any) => b.typeName === droppedBlockData.typeName);
    console.log(blockDefinition, "blockDefinition", selectedValue)

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
                attrs: {
                    label: { text: blockDefinition.label || blockDefinition.typeName },
                    body: { fill: blockDefinition.color || '#fff', border: '2px solid #cfd8dc' },
                     tabColor: {
                        height: 5,
                        x: 0,
                        y: 0,
                        width: 'calc(w)',
                        fill: blockDefinition.label==='Source'?'#fe4365':'#14bc9b',
                        stroke: blockDefinition.label==='Source'?'#fe4365':'#14bc9b'
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
            newCell = new Concat({
                position: { x: dropX, y: dropY },
                size: blockDefinition.size,
                attrs: { label: { text: blockDefinition.label || blockDefinition.typeName } },
                items: [
                    [{
                        id: 'value_1',
                        label: 'Value 1',
                        icon: 'assets/images/link.svg',
                    }, {
                        id: 'value_2',
                        label: 'Value 2',
                        icon: 'assets/images/link.svg',
                    }, {
                        id: 'value_3',
                        label: 'Value 3',
                        icon: 'assets/images/link.svg',
                    }], [{
                        id: 'result',
                        label: 'Result ⇛',
                        height: 40
                    }]
                ]
            });
            console.log("Concat block created with items:wwwwww ");
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
                newCell.addPorts(blockDefinition.ports);
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