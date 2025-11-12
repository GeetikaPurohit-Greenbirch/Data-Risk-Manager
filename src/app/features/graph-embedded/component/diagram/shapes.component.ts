
import { shapes, util, dia } from '@joint/plus';

export class Link extends shapes.standard.Link {
    override defaults() {
        return util.defaultsDeep({
            type: 'mapping.Link',
            z: -1,
            router: { name: 'normal' },
            connector: { name: 'smooth' },
            attrs: {
                line: {
                    stroke: '#708090',
                    strokeWidth: 1,
                    targetMarker: {
                        'type': 'path',
                        'd': 'M 10 -5 0 0 10 5 z'
                    },
                    sourceMarker: {
                        'type': 'path',
                        'd': 'M 0 -5 10 0 0 5 z'
                    },
                }
            },
        }, super.defaults);
    }
}

export class Constant extends shapes.standard.BorderedRecord {
    override defaults() {
        return util.defaultsDeep({
            type: 'mapping.Constant',
            itemHeight: 40,
            itemOffset: 5,
            itemMinLabelWidth: 30,
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                    magnet: false,
                    stroke: '#EBEEF0',
                    strokeWidth: 2
                },
                tabColor: {
                    height: 5,
                    x: 0,
                    y: 0,
                    width: 'calc(w)',
                    fill: '#fe4365',
                    stroke: '#fe4365'
                },
                icon: {
                    'xlink:href': '',
                    x: 8,
                    y: 8,
                    width: 24,
                    height: 24
                },
                itemLabels: {
                    fontSize: 12,
                    fontFamily: 'Sans-serif'
                },
                itemLabels_1: {
                    magnet: false
                },
                itemBodies_0: {
                    stroke: '#7C90A6'
                },
                itemBodies: {
                    stroke: 'none'
                }
            },
            items: [
                [{
                    id: 'icon',
                    icon: ''
                }],
                [{ id: 'value', label: '', span: 2 }],
                []
            ],
            portMarkup: [
                {
                    tagName: 'circle',
                    selector: 'portBody'
                }
            ],
            ports: {
                groups: {
                    in: {
                        position: { name: 'left' },
                        attrs: {
                            portBody: {
                                magnet: 'passive',
                                r: 3,
                                fill: '#000',
                                stroke: '#fff',
                                strokeWidth: 1
                            }
                        },
                        label: {
                            position: {
                                name: 'left',
                                args: { y: 0 }
                            }
                        }
                    },
                    out: {
                        position: { name: 'right' },
                        attrs: {
                            portBody: {
                                magnet: true,
                                r: 3,
                                fill: '#000',
                                stroke: '#fff',
                                strokeWidth: 1
                            }
                        },
                        label: {
                            position: {
                                name: 'right',
                                args: { y: 0 }
                            }
                        }
                    }
                }
            },
        }, super.defaults);
    }

    override preinitialize(): void {
        this.markup = [
            { tagName: 'rect', selector: 'body' },
            { tagName: 'rect', selector: 'tabColor' },
            { tagName: 'g', selector: 'inPorts', groupSelector: 'in' },
            { tagName: 'g', selector: 'outPorts', groupSelector: 'out' }
        ];
    }

    setValue(value: string, opt?: object) {
        const items = this.prop('items');
        for (let row = 0; row < items.length; row++) {
            const col = items[row].findIndex((item: any) => item.id === 'value');
            if (col !== -1) {
                return this.prop(['items', row, col, 'label'], value, opt);
            }
        }
        throw new Error('Item with id "value" not found.');
    }

    setIcon(iconPath: string, opt?: object) {
        // The path to the 'icon' property of the first item in the first group
        return this.prop(['items', 0, 0, 'icon'], iconPath, opt);
    }

    getDefaultItem() {
        return {
            id: util.uuid(),
            label: '""',
            icon: 'assets/images/clipboard.svg'
        };
    }

    getItemTools() {
        return [
            { action: 'edit', content: 'Edit Constant' }
        ];
    }

    getTools() {
        return [
            { action: 'remove', content: warning('Remove Constant') }
        ];
    }

    getInspectorConfig() {
        return {
            label: {
                label: 'Label',
                type: 'content-editable'
            }
        };
    }
}

export class Concat extends shapes.standard.HeaderedRecord {
    override defaults() {
        return util.defaultsDeep({
            type: 'mapping.Concat',
            itemHeight: 20,
            itemOffset: 5,
            padding: { top: 35, left: 10, right: 0, bottom: 0 },
            itemMinLabelWidth: 100,
            scrollTop: 0,
            itemOverflow: true,
            collapsed: false,
            expandedSize: null,
            attrs: {
                root: { magnet: false },
                body: { stroke: '#EBEEF0' },
                header: { height: 35, fill: '#FFFFFF', stroke: '#EBEEF0' },
                tabColor: { height: 5, x: 0, y: 0, width: 'calc(w)', fill: '#FF4365', stroke: '#FF4365' },

                // caret toggle icon inside header (click target)
                caret: {
                  ref: 'header',
                  refX: '85%',
                  refY: 14,
                  width: 12,
                  height: 12,
                  cursor: 'pointer',
                  d: 'M 0 0 L 12 0 L 6 8 z', // ▼
                  fill: '#6B7280',
                  event: 'element:caret:pointerdown',
                },
                buttonsGroups: {
                    stroke: '#7C90A6'
                },
                forksGroups: {
                    stroke: 'lightgray'
                },

                headerIcon: {
                    'xlink:href': '',
                    x: 8, y: 10, width: 14, height: 14
                },
                headerLabel: {
                    y: 5,
                    fontFamily: 'Sans-serif',
                    fontWeight: 50,
                    margin: 10,
                    fontSize: 12,
                    textWrap: { ellipsis: true, height: 30, width: 120 }
                },
                headerIcon2: {
                    'xlink:href': '',
                    x: 8, y: -20, width: 14, height: 14
                },
                 controlnames: {                    
                   textWrap: { ellipsis: true, height: 20, width: 120 },
                },
                headerLabel2: {
                    x: 35,
                    y: -10,
                    fontFamily: 'Sans-serif',
                    fontWeight: 50,
                    margin: 10,
                    fontSize: 12,
                    cursor: 'pointer',
                    textWrap: { ellipsis: true, height: 20, width: 120 },
                    event: 'element:controlnameclick'
                },
                remove_icon: {
                    ref: 'body',
                    refX: '100%',
                    refY: -25,
                    width: 14,
                    height: 14,
                    cursor: 'pointer',
                    'xlink:href': 'assets/images/remove.svg', // or inline SVG path below
                    visibility: 'visible',
                    event: 'element:remove:pointerdown'
                },

                headerAction1: {
                    ref: 'header',
                    refX: '80%',
                    refY: 14,
                    // refDx: -32,    
                    width: 14,
                    height: 14,       // 32px from the right edge
                    cursor: 'pointer',
                    'xlink:href': '',
                    event: 'element:action1:pointerdown',
                    // x: 10, 
                    // y: 10, 
                    // width: 14,
                    // height: 14
                },
                headerAction2: {
                    ref: 'header',
                    refX: '82%',
                    refY: 14,
                    width: 14,
                    height: 14,
                    cursor: 'pointer',
                    'xlink:href': '',
                    event: 'element:action2:pointerdown'
                },
                itemLabels: { magnet: 'passive', fontSize: 12, fontFamily: 'Sans-serif' },
                itemLabels_0: { magnet: 'passive', cursor: 'pointer' },
                itemBodies_0: { magnet: 'passive' }
            },
            portMarkup: [{ tagName: 'circle', selector: 'portBody' }],
            ports: {
                groups: {
                    in: {
                        position: { name: 'left', args: { y: 17 } },   // ≈ headerHeight / 2
                        attrs: {
                            portBody: { magnet: 'passive', r: 3, fill: '#000', stroke: '#000', strokeWidth: 1 }
                        },
                        label: { position: { name: 'left', args: { y: 0 } } }
                    },
                    out: {
                        position: { name: 'right', args: { y: 17 } },  // ≈ headerHeight / 2
                        attrs: {
                            portBody: { magnet: true, r: 3, fill: '#000', stroke: '#000', strokeWidth: 1 }
                        },
                        label: { position: { name: 'right', args: { y: 0 } } }
                    }
                }
            },
            items: [],
            id: ''
        }, super.defaults);
    }

    override preinitialize(): void {
        this.markup = [
            { tagName: 'rect', selector: 'body' },
            { tagName: 'rect', selector: 'header' },
            { tagName: 'rect', selector: 'tabColor' },
            { tagName: 'path', selector: 'caret' },               // <— caret
            { tagName: 'image', selector: 'headerIcon' },
            { tagName: 'text', selector: 'headerLabel' },
            { tagName: 'image', selector: 'headerAction1' },   // ← new
            //{ tagName: 'image', selector: 'headerAction2' },   // ← new
            { tagName: 'g', selector: 'inPorts', groupSelector: 'in' },
            { tagName: 'g', selector: 'outPorts', groupSelector: 'out' },
            { tagName: 'image', selector: 'headerIcon2' },
            { tagName: 'text', selector: 'headerLabel2' },
            { tagName: 'image', selector: 'remove_icon' },
            { tagName: 'text', selector: 'controlnames' },

        ];
    }

    // ---------- convenience ----------
    private get headerHeight(): number {
        return (this.attr('header/height') as number) ?? 35;
    }

    setName2(name: string, opt?: object) {
        return this.attr(['headerLabel2', 'textWrap', 'text'], name, opt);
    }
    setIcon2(iconPath: string, opt?: object) {
        return this.attr('headerIcon2/xlink:href', iconPath, opt);
    }
    setRmoveIcon(iconPath: string, opt?: object) {
        return this.attr('remove_icon/xlink:href', iconPath, opt);
    }
    setItems(items: any[]) {
        return this.prop('items', items);
    }

    setName(name: string, opt?: object) {
        return this.attr(['headerLabel', 'textWrap', 'text'], name, opt);
    }

    setIcon(iconPath: string, opt?: object) {
        return this.attr('headerIcon/xlink:href', iconPath, opt);
    }

    setHeaderActions(icon1: string, icon2: string, opt?: object) {
        this.attr('headerAction1/xlink:href', icon1, opt);
        // this.attr('headerAction2/xlink:href', icon2, opt);
    }

    setName2WithTooltip(names: string[], opt?: object) {
        //const visibleText = names.length > 1 ? `${names[0]} (+${names.length - 1})` : names[0] || '';
        const tooltipText = names.join('\n');
        //console.log("visibleText",visibleText);
        this.attr(['controlnames', 'textWrap', 'text'], tooltipText, opt);
        //this.attr(['headerLabel2', 'title'], tooltipText, opt); // store tooltip text for Paper to read
        return this;
    }

    setControlNames(names: string[], opt?: object) {
       
        const tooltipText = names.join('\n');       
        this.attr(['controlnames', 'textWrap', 'text'], tooltipText, opt);       
        return this;
    }
    
   
    setCaretIcon() {
        return this.attr('caret', {
            ref: 'header',
            refX: '90%',
            refY: 16,
            width: 14,
            height: 14,
            cursor: 'pointer',
            d: 'M 0 0 L 12 0 L 6 8 z', // ▼
            fill: '#6B7280',
            event: 'element:caret:pointerdown',
        })
    }

    getNumberOfValues() {
        return this.prop(['items', 0]).length;
    }

    getDefaultItem() {
        return { id: util.uuid(), label: 'Value ' + (this.getNumberOfValues() + 1), icon: 'assets/images/link.svg' };
    }

    getItemTools(itemId: string) {
        const groupIndex = this.getItemGroupIndex(itemId);
        if (groupIndex !== 0) return null;
        const tools = [{ action: 'edit', content: 'Edit Value' }, { action: 'add-next-sibling', content: 'Add Value' }];
        if (this.getNumberOfValues() > 2) tools.push({ action: 'remove', content: warning('Remove Value') });
        return tools;
    }

    getTools() {
        return [{ action: 'add-item', content: 'Add Value' }, { action: 'remove', content: warning('Remove Concat') }];
    }

    getInspectorConfig(itemId: string) {
        const groupIndex = this.getItemGroupIndex(itemId);
        if (groupIndex !== 0) return null;
        return { label: { label: 'Label', type: 'content-editable' } };
    }

    // ---------- collapse logic ----------
    collapse() {
        if (this.get('collapsed')) return;

        // remember full size
        const fullSize = this.size();
        this.set('expandedSize', fullSize);

        // hide everything except header
        this.attr('body/display', 'none');
        this.attr('items/display', 'none');
        this.attr('footer/display', 'none');
        this.attr('caret/transform', 'rotate(-90 6 6)');
        this.attr('wrapper/display', 'none');


        // shrink to header height
        this.resize(fullSize.width, this.headerHeight);
        this.set('collapsed', true);
    }


    expand() {
        if (!this.get('collapsed')) return;

        this.removeAttr('body/display');
        this.removeAttr('items/display');
        this.removeAttr('footer/display');
        this.removeAttr('caret/transform');
        this.removeAttr('wrapper/display');

        const sz = this.get('expandedSize') || { width: this.size().width, height: 200 };
        this.resize(sz.width, sz.height);
        this.set('collapsed', false);
    }

    toggleCollapse() {
        this.get('collapsed') ? this.expand() : this.collapse();
    }

    override toJSON() {
        const json: any = super.toJSON();
        json.collapsed = this.get('collapsed');
        json.expandedSize = this.get('expandedSize');
        return json;
    }

    fromJSON(json: any) {
        if (json.collapsed) this.collapse();
    }
}


// export class Concat extends shapes.standard.HeaderedRecord {
//    override  defaults() {
//         return util.defaultsDeep({
//             type: 'mapping.Concat',
//             itemHeight: 20,
//             itemOffset: 5,
//             padding: { top: 35, left: 10, right: 0, bottom: 0 },
//             itemMinLabelWidth: 100,
//             itemOverflow: true,
//             attrs: {
//                 root: {
//                     magnet: false
//                 },
//                 body: {
//                     stroke: '#EBEEF0'
//                 },
//                 header: {
//                     height: 35,
//                     fill: '#F8FAFC',
//                     stroke: '#EBEEF0'
//                 },
//                 tabColor: {
//                     height: 5,
//                     x: 0,
//                     y: 0,
//                     width: 'calc(w)',
//                     fill: '#FF4365',
//                     stroke: '#FF4365'
//                 },
//                   headerIcon: {
//                     'xlink:href': '',
//                     x: 10,
//                     y: 10,
//                     width: 14,  // <--- Changed from 20 to 24 (example)
//                     height: 14, // <--- Changed from 20 to 24 (example)
//                 },
//                  headerLabel: {
//                     y: 5,
//                     fontFamily: 'Sans-serif',
//                     fontWeight: 50,
//                     margin:10,
//                     fontSize: 12,
//                     textWrap: {
//                         ellipsis: false,
//                         height: 30
//                     }
//                 },
//                 itemLabels: {
//                     magnet: true,
//                     fontSize: 12,
//                     fontFamily: 'Sans-serif',
//                 },
//                 itemLabels_0: {
//                     magnet: 'passive',
//                     cursor: 'pointer'
//                 },
//                 itemBodies_0: {
//                     stroke: '#EBEEF0'
//                 }
//             },
//               portMarkup: [
//                 {
//                     tagName: 'circle',
//                     selector: 'portBody'
//                 }
//             ],
//             ports: {
//                 groups: {
//                     in: {
//                         position: { name: 'left' },
//                         attrs: {
//                             portBody: {
//                                 magnet: 'passive',
//                                 r: 3,
//                                 fill: '#000',
//                                 stroke: '#000',
//                                 strokeWidth: 1
//                             }
//                         },
//                         label: {
//                             position: {
//                                 name: 'left',
//                                 args: { y: 0 }
//                             }
//                         }
//                     },
//                     out: {
//                         position: { name: 'right' },
//                         attrs: {
//                             portBody: {
//                                 magnet: true,
//                                 r: 3,
//                                 fill: '#000',
//                                 stroke: '#000',
//                                 strokeWidth: 1
//                             }
//                         },
//                         label: {
//                             position: {
//                                 name: 'right',
//                                 args: { y: 0 }
//                             }
//                         }
//                     }
//                 }
//             },
//             items: [ ]
//         }, super.defaults);
//     }

//     override preinitialize(): void {
//         this.markup = [{
//             tagName: 'rect',
//             selector: 'body'
//         }, {
//             tagName: 'rect',
//             selector: 'header'
//         }, {
//             tagName: 'rect',
//             selector: 'tabColor'
//         },
//          {
//             tagName: 'image', // Add the image element for the icon
//             selector: 'headerIcon'
//         },
//         {
//             tagName: 'text',
//             selector: 'headerLabel'
//         },
//         { tagName: 'g', selector: 'inPorts', groupSelector: 'in' },
//         { tagName: 'g', selector: 'outPorts', groupSelector: 'out' }
//     ];
//     }

//     setItems(items: any[]) {
//         return this.prop('items', items);

//     }

//       setName(name: string, opt?: object) {
//         return this.attr(['headerLabel', 'textWrap', 'text'], name, opt);
//     }

//       setIcon(iconPath: string, opt?: object) {
//         return this.attr('headerIcon/xlink:href', iconPath, opt);
//     }

//     getNumberOfValues() {
//         return this.prop(['items', 0]).length;
//     }

//     getDefaultItem() {
//         return {
//             id: util.uuid(),
//             label: 'Value ' + (this.getNumberOfValues() + 1),
//             icon: 'assets/images/link.svg'
//         };
//     }

//     getItemTools(itemId: string) {
//         const groupIndex = this.getItemGroupIndex(itemId);
//         if (groupIndex !== 0) return null;
//         const tools = [
//             { action: 'edit', content: 'Edit Value' },
//             { action: 'add-next-sibling', content: 'Add Value' }
//         ];
//         if (this.getNumberOfValues() > 2) {
//             tools.push({ action: 'remove', content: warning('Remove Value') });
//         }
//         tools.push();
//         return tools;
//     }

//     getTools() {
//         return [
//             { action: 'add-item', content: 'Add Value' },
//             { action: 'remove', content: warning('Remove Concat') }
//         ];
//     }

//     getInspectorConfig(itemId: string) {
//         const groupIndex = this.getItemGroupIndex(itemId);
//         if (groupIndex !== 0) return null;
//         return {
//             label: {
//                 label: 'Label',
//                 type: 'content-editable'
//             }
//         };
//     }
// }
export class GetDate extends shapes.standard.HeaderedRecord {
    override defaults() {
        return util.defaultsDeep({
            type: 'mapping.GetDate',
            itemHeight: 20,
            itemOffset: 5,
            padding: { top: 35, left: 10, right: 0, bottom: 0 },
            itemMinLabelWidth: 50,
            itemOverflow: true,
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                    stroke: '#EBEEF0'
                },
                header: {
                    height: 35,
                    fill: '#F8FAFC',
                    stroke: '#EBEEF0'
                },
                tabColor: {
                    height: 5,
                    x: 0,
                    y: 0,
                    width: 'calc(w)',
                    fill: '#00BC9A',
                    stroke: '#00BC9A'
                },
                headerLabel: {
                    y: 5,
                    fontFamily: 'Sans-serif',
                    fontWeight: 300,
                    textWrap: {
                        text: 'get-date',
                        ellipsis: true,
                        height: 30
                    }
                },
                itemLabels: {
                    magnet: true,
                    fontSize: 12,
                    fontFamily: 'Sans-serif',
                },
                itemLabels_0: {
                    magnet: 'passive',
                    cursor: 'pointer'
                },
                itemBodies: {
                    stroke: '#EBEEF0'
                }
            },
            items: [
                [{
                    id: 'value',
                    label: '⇛ Value',
                    height: 60
                }],
                [{
                    id: 'year',
                    label: 'year',
                    icon: 'assets/images/link.svg',
                }, {
                    id: 'month',
                    label: 'month',
                    icon: 'assets/images/link.svg',
                }, {
                    id: 'day',
                    label: 'day',
                    icon: 'assets/images/link.svg',
                }]
            ]
        }, super.defaults);
    }

    override preinitialize(): void {
        this.markup = [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'rect',
            selector: 'header'
        },
        {
            tagName: 'image', // Add the image element for the icon
            selector: 'headerIcon'
        }, {
            tagName: 'rect',
            selector: 'tabColor'
        }, {
            tagName: 'text',
            selector: 'headerLabel'
        }];
    }

    getDefaultItem() {
        return {
            id: util.uuid(),
            label: 'item',
            icon: 'assets/images/document.svg'
        };
    }

    getItemTools(): null {
        return null;
    }

    getTools() {
        return [
            { action: 'remove', content: warning('Remove GetDate') }
        ];
    }

    getInspectorConfig(): null {
        return null;
    }
}

export class Record extends shapes.standard.HeaderedRecord {
    override defaults() {
        return util.defaultsDeep({
            type: 'mapping.Record',
            itemHeight: 20,
            itemOffset: 15,
            itemMinLabelWidth: 90,
            itemAboveViewSelector: 'header',
            itemBelowViewSelector: 'footer',
            padding: { top: 35, left: 15, right: 10, bottom: 10 },
            scrollTop: 0,
            size: { height: 200, width: 400 },
            itemOverflow: true,
            attrs: {
                root: {
                    magnet: false
                },
                body: {
                    stroke: '#EBEEF0'
                },
                header: {
                    height: 35,
                    fill: '#F8FAFC',
                    stroke: '#EBEEF0',

                },
                tabColor: {
                    height: 5,
                    x: 0,
                    y: 0,
                    width: 'calc(w)',
                    fill: '#4566E5',
                    stroke: '#4566E5'
                },
                headerIcon: {
                    'xlink:href': '',
                    x: 10,
                    y: 10,
                    width: 14,  // <--- Changed from 20 to 24 (example)
                    height: 14, // <--- Changed from 20 to 24 (example)
                },
                headerLabel: {
                    y: 5,
                    fontFamily: 'Sans-serif',
                    fontWeight: 50,
                    fontSize: 12,
                    textWrap: {
                        ellipsis: false,
                        height: 30
                    }
                },
                footer: {
                    height: 10,
                    x: 0,
                    y: 'calc(h - 10)',
                    width: 'calc(w)',
                    fill: '#F8FAFC',
                    stroke: '#EBEEF0'
                },
                buttonsGroups: {
                    stroke: '#7C90A6'
                },
                forksGroups: {
                    stroke: 'lightgray'
                },
                itemBodies: {
                    itemHighlight: {
                        fill: 'none'
                    }
                },
                itemLabels: {
                    magnet: 'true',
                    cursor: 'pointer',
                    fontSize: 12,
                    fontFamily: 'Sans-serif',
                    itemHighlight: {
                        fill: '#4566E5'
                    },
                },
                itemLabels_disabled: {
                    magnet: null,
                    fill: '#AAAAAA',
                    cursor: 'not-allowed'
                },
                items: [


                ]
            }
        }, super.defaults);
    }

    override preinitialize(): void {
        this.markup = [{
            tagName: 'rect',
            selector: 'body'
        }, {
            tagName: 'rect',
            selector: 'header'
        }, {
            tagName: 'rect',
            selector: 'tabColor'
        }, {
            tagName: 'text',
            selector: 'headerLabel'
        },
        {
            tagName: 'image', // Add the image element for the icon
            selector: 'headerIcon'
        }, {
            tagName: 'rect',
            selector: 'footer'
        }];
    }

    setName(name: string, opt?: object) {
        return this.attr(['headerLabel', 'textWrap', 'text'], name, opt);
    }
    // setIcon(iconPath: string, opt?: object) {
    //     // The path to the 'icon' property of the first item in the first group
    //     return this.prop(['items', 0, 0, 'icon'], iconPath, opt);
    // }
    // Corrected setIcon method to target the headerIcon
    setIcon(iconPath: string, opt?: object) {
        return this.attr('headerIcon/xlink:href', iconPath, opt);
    }

    getDefaultItem() {
        return {
            id: util.uuid(),
            label: 'new_item',
            icon: 'assets/images/document.svg'
        };
    }

    getItemTools() {
        return [
            { action: 'edit', content: 'Edit Item' },
            { action: 'edit-decorator', content: 'Edit Decorator' },
            { action: 'add-child', content: 'Add Child' },
            { action: 'add-next-sibling', content: 'Add Next Sibling' },
            { action: 'add-prev-sibling', content: 'Add Prev Sibling' },
            { action: 'remove', content: warning('Remove Item') }
        ];
    }

    getTools() {
        return [
            { action: 'add-item', content: 'Add Child' },
            { action: 'remove', content: warning('Remove Record') }
        ];
    }

    getInspectorConfig() {
        return {
            label: {
                label: 'Label',
                type: 'content-editable'
            },
            icon: {
                label: 'Icon',
                type: 'select-button-group',
                options: [{
                    value: 'assets/images/link.svg',
                    content: '<img height="42px" src="assets/images/link.svg"/>'
                }, {
                    value: 'assets/images/document.svg',
                    content: '<img height="42px" src="assets/images/document.svg"/>'
                }, {
                    value: 'assets/images/clipboard.svg',
                    content: '<img height="42px" src="assets/images/clipboard.svg"/>'
                }, {
                    value: 'assets/images/file.svg',
                    content: '<img height="42px" src="assets/images/file.svg"/>'
                }]
            },
            highlighted: {
                label: 'Highlight',
                type: 'toggle'
            }
        };
    }
}


export const SingleBlock = dia.Element.define(
    'mapping.SingleBlock',
    {
        type: 'mapping.SingleBlock',
        size: { width: 180, height: 160 },
        attrs: {
            body: {
                refWidth: '100%',
                refHeight: '100%',
                fill: '#3f51b5',
                stroke: '#36454F',
                strokeWidth: 1,
                rx: 4,
                ry: 4,
                magnet: false
            },
            title: {
                text: '',
                refX: '50%',
                refY: '40%',
                textAnchor: 'middle',
                fontSize: 14,
                fill: '#fff'
            },
            icon: {
                'xlink:href': '',
                x: 8,
                y: 8,
                width: 24,
                height: 24
            },
            'remove-icon': {
                d: 'M96 464c0 26.5 21.5 48 ...', // truncated path
                fill: 'red',
                ref: 'body',
                refX: '95%',
                refY: '-5%',
                x: -18,
                y: 0,
                transform: 'scale(0.025)',
                cursor: 'pointer',
                event: 'element:delete',
                visibility: 'hidden'
            },
            'resize-handle': {
                ref: 'body',
                refX: '100%',
                refY: '100%',
                x: -6,
                y: -6,
                width: 7,
                height: 7,
                fill: '#999',
                stroke: '#fff',
                strokeWidth: 1,
                cursor: 'se-resize',
                event: 'resize:drag',
                visibility: 'visible'
            }
        },
        ports: {
            groups: {
                in: {
                    position: { name: 'left' },
                    attrs: {
                        portBody: {
                            r: 6,
                            fill: '#fff',
                            stroke: '#000',
                            strokeWidth: 1,
                            magnet: 'passive',
                            opacity: 0
                        },
                        portLabel: {
                            fontSize: 12,
                            fill: '#fff',
                            textAnchor: 'start',
                            refX: 10,
                            refY: 0,
                            yAlignment: 'middle'
                        }
                    },
                    markup: [
                        { tagName: 'circle', selector: 'portBody' }
                    ]
                },
                out: {
                    position: { name: 'right' },
                    attrs: {
                        portBody: {
                            r: 6,
                            fill: '#fff',
                            stroke: '#000',
                            strokeWidth: 1,
                            magnet: true
                        },
                        portLabel: {
                            fontSize: 12,
                            fill: '#fff',
                            textAnchor: 'end',
                            refX: -10,
                            refY: 0,
                            yAlignment: 'middle'
                        }
                    },
                    markup: [
                        { tagName: 'circle', selector: 'portBody' },
                        { tagName: 'text', selector: 'portLabel' }
                    ]
                }
            }
        }
    },
    {
        markup: [
            { tagName: 'rect', selector: 'body' },
            { tagName: 'text', selector: 'title' },
            {
                tagName: 'g',
                selector: 'remove-group',
                children: [
                    { tagName: 'path', selector: 'remove-icon' },
                    { tagName: 'title', selector: 'remove-title' }
                ]
            },
            //   { tagName: 'rect', selector: 'resize-handle' },
            { tagName: 'image', selector: 'icon' }
        ]
    }
);


function warning(text: string) {
    return '<span style="color:#fe854f">' + text + '</span>';
}


const ConstantView = shapes.standard.RecordView; // This is actually for Record, not Constant
const ConcatView = shapes.standard.RecordView;
const GetDateView = shapes.standard.RecordView;
const RecordView = shapes.standard.RecordView;
export const SingleBlockView = dia.ElementView;


Object.assign(shapes, {
    mapping: {
        Link,
        Constant,
        ConstantView, // This might be problematic if Constant is not a RecordView
        Concat,
        ConcatView,
        GetDate,
        GetDateView,
        Record,
        RecordView,
        SingleBlock,
        SingleBlockView
    }
});

