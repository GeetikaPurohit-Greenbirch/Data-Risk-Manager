// block-definitions.ts (create this new file)

export const blockDefinitions = [
    {
      type: 'Constant',
      label: 'Source',
      icon: '<i class="fa fa-database" aria-hidden="true"></i>',
      sicon: 'assets/icons/database.svg',
      typeName: 'Source',
      color: '#fff',
      args: { x: 15, y: 50 },
      size: { width: 120, height: 40 },
      ports: [
        { id: 'out1', group: 'out', attrs: { portLabel: { text: 'Output', fontSize: 14, fill: '#00FA00' } } }
      ],
    },
    {
      type: 'Constant',
      label: 'System',
      icon: '<i class="fa fa-cogs" aria-hidden="true"></i>',
      sicon: 'assets/icons/system.svg',
      typeName: 'System',
      color: '#fff',
      args: { x: 115, y: 50 },
      size: { width: 120, height: 40 },
      ports: [
        { id: 'in1', group: 'in', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } },
        { id: 'out2', group: 'out', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } }
      ],
    },
    {
      type: 'Constant',
      label: 'Controls',
      args: { x: 215, y: 50 },
      icon: '<i class="fa fa-sliders" aria-hidden="true"></i>',
      sicon: 'assets/icons/controls.svg',
      typeName: 'Controls',
      color: '#fff',
      size: { width: 120, height: 40 },
      ports: [
        { id: 'in2', group: 'in', attrs: { portLabel: { text: 'Input', fontSize: 14, fill: '#000' } } },
        { id: 'out3', group: 'out', attrs: { portLabel: { text: 'Output', fontSize: 14, fill: '#000' } } }
      ],
    },
    {
      type: 'Record',
      label: 'Target',
      icon: '<i class="fa fa-bullseye" aria-hidden="true"></i>',
      sicon: 'assets/icons/target.svg',
      typeName: 'Target',
      args: { x: 400, y: 100 },
      color: '#fff',
      size: { width: 200, height: 400 },
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
    }
  ];
  