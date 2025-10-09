// block-definitions.ts (create this new file)

export const blockDefinitions = [
    {
      type: 'Concat',
      label: 'Source',
      icon: '<i class="fa fa-database" aria-hidden="true"></i>',
      sicon: 'assets/icons/database.svg',
      cicon: 'assets/icons/controls.svg',
      typeName: 'sources',
      color: '#fff',
      args: { x: 15, y: 50 },
      size: { width: 150, height: 40 },
      ports: [
        { id: 'out1', group: 'out', attrs: { portLabel: { text: 'Output', fontSize: 14, fill: '#00FA00' } } }
      ],
    },
    {
      type: 'Concat',
      label: 'System',
      icon: '<i class="fa fa-cogs" aria-hidden="true"></i>',
      sicon: 'assets/icons/system.svg',
      cicon: 'assets/icons/controls.svg',
      typeName: 'systems',
      color: '#fff',
      args: { x: 115, y: 50 },
     size: { width: 200, height: 40 },
      ports: [
        { id: 'in1', group: 'in', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } },
        { id: 'out2', group: 'out', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } }
      ],
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
    },
    {
      type: 'Constant',
      label: 'Controls',
      args: { x: 215, y: 50 },
      icon: '<i class="fa fa-sliders" aria-hidden="true"></i>',
      sicon: 'assets/icons/controls.svg',
      typeName: 'controls',
      color: '#fff',
      size: { width: 120, height: 40 },
      ports: [
        { id: 'in2', group: 'in', attrs: { portLabel: { text: 'Input', fontSize: 14, fill: '#000' } } },
        { id: 'out3', group: 'out', attrs: { portLabel: { text: 'Output', fontSize: 14, fill: '#000' } } }
      ],
    },
    {
      type: 'Concat',
      label: 'Target',
      icon: '<i class="fa fa-bullseye" aria-hidden="true"></i>',
      sicon: 'assets/icons/target.svg',
      reportIcon: 'assets/icons/report.svg',
      detailIcon: 'assets/icons/details-more.svg',
      typeName: 'targets',
      args: { x: 400, y: 100 },
      color: '#fff',
      size: { width: 250, height: 200 },
      allItems: [
        { id: 'reportStatus', label: 'Report Status' },
        { id: 'reportStatus2', label: 'Report Status2' },
        { id: 'reportStatus3', label: 'Report Status3' },
        { id: 'reportStatus4', label: 'Report Status4' },
        { id: 'reportStatus5', label: 'Report Status5' },
        { id: 'reportStatus6', label: 'Report Status6' },
        { id: 'reportStatus7', label: 'Report Status7' },
        { id: 'reportStatus8', label: 'Report Status8' }
      ],
      items: [{id:1,label:'RTS 22'}, {id:2,label:'MiFIR'}, {id:3,label:'EMIR'}],
      itemMappings: {
        'RTS 22': ['reportStatus', 'reportStatus2'],
        'MiFIR': ['reportStatus3', 'reportStatus4', 'reportStatus5'],
        'EMIR': ['reportStatus6', 'reportStatus7', 'reportStatus8']
      }
    },
     {
      type: 'Concat',
      label: 'N1',
      icon: '<i class="fa fa-bullseye" aria-hidden="true"></i>',
      sicon: 'assets/icons/target.svg',
      typeName: 'N1',
      args: { x: 400, y: 100 },
      color: '#fff',
      size: { width: 200, height: 200 },
      allItems: [
                [{
                    id: 'value_1',
                    label: 'Value 1'
                }, {
                    id: 'value_2',
                    label: 'Value 2'
                }, {
                    id: 'value_3',
                    label: 'Value 3',
                }], [{
                    id: 'result',
                    label: 'Result ⇛',
                    height: 40
                }]
            ],
      items: [{id:'s1',label:'s1'}],
    }
  ];
  