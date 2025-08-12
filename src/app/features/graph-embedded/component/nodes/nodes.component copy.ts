import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nodes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss'],
})
export class NodesComponent {
  search = '';

//  categoriesbackup = [
//   {
//     label: 'FILTERS',
//     collapsed: false,
//     blocks: [
//       {
//         label: 'Source',
//         icon: '🎛',
//         size: { width: 120, height: 60 },
//         color: '#fff',
//         ports: [
//           { id: 'img', group: 'in', attrs: { portLabel: { text: 'Image' } } },
//           { id: 'resized', group: 'out', attrs: { portLabel: { text: 'Output' } } }
//         ]
//       },
//       {
//         label: 'Interface 1',
//         icon: '🌓',
//         size: { width: 150, height: 200 },
//         color: '#fff',
//         ports: [
//           { id: 'img', group: 'in', attrs: { portLabel: { text: 'Image' } } },
//           { id: 'width', group: 'in', attrs: { portLabel: { text: 'Width' } } },
//           { id: 'height', group: 'in', attrs: { portLabel: { text: 'Height' } } },
//           { id: 'x', group: 'in', attrs: { portLabel: { text: 'X' } } },
//           { id: 'y', group: 'in', attrs: { portLabel: { text: 'Y' } } },
//           { id: 'result', group: 'out', attrs: { portLabel: { text: 'Image' } } }
//         ]
//       },
//       {
//         label: 'System A',
//         icon: '🌫',
//         color: '#fff',
//         size: { width: 120, height: 60 },
//         ports: [
//           { id: 'img', group: 'in', attrs: { portLabel: { text: 'Image' } } },
//           { id: 'width', group: 'in', attrs: { portLabel: { text: 'Width' } } },
//           { id: 'X', group: 'out', attrs: { portLabel: { text: 'X' } } },
//         ]
//       },
//       {
//         label: 'Interface 2',
//         icon: '🌓',
//         color: '#fff',
//         ports: [
//           { id: 'img', group: 'in', attrs: { portLabel: { text: 'Image' } } },
//           { id: 'width', group: 'in', attrs: { portLabel: { text: 'Width' } } },
//           { id: 'height', group: 'out', attrs: { portLabel: { text: 'Height' } } },
//         ]
//       },
//        {
//         label: 'System B',
//         icon: '🌫',
//         color: '#fff',
//          size: { width: 120, height: 60 },
//         ports: [
//           { id: 'img', group: 'in', attrs: { portLabel: { text: 'Image' } } },
//           { id: 'width', group: 'out', attrs: { portLabel: { text: 'Width' } } },
//           { id: 'Y', group: 'out', attrs: { portLabel: { text: 'Y' } } },

//         ]
//       },
//       {
//         label: 'Target',
//         icon: '↔️',
//         color: '#fff',
//         ports: [
//           { id: 'width', group: 'in', attrs: { portLabel: { text: 'Width' } } },
//           { id: 'x', group: 'in', attrs: { portLabel: { text: 'X' } } },
//           { id: 'y', group: 'in', attrs: { portLabel: { text: 'Y' } } },
//           { id: 'result', group: 'out', attrs: { portLabel: { text: 'Image' } } }
//         ]
//       }
//     ]
//   },

// ];



// categories1 = [
//   {
//     label: 'CUSTOM BLOCKS',
//     collapsed: false,
//     blocks: [
//       // 🔹 Single Block with basic input/output
//       {
//         type: 'SingleBlock',
//         label: 'Source 4',
//         icon: '📥',
//         size: { width: 100, height: 90 },
//         color: '#4472C4',
//         ports: [
//           { id: 'out1', group: 'out',args: { x: 85, y: 30 }, attrs: { portLabel: { text: 'Field01', fill: '#00FA00',fontSize: 16 } } },
//           { id: 'out2', group: 'out',args: { x: 85, y: 50 }, attrs: { portLabel: { text: 'Field07', fill: '#00FA00',fontSize: 16 } } }
//         ]
//       },

//        {
//         type: 'SingleBlock',
//         label: 'Source 7',
//         icon: '📥',
//         size: { width: 100, height: 90 },
//         color: '#4472C4',
//         ports: [
//           { id: 'out1', group: 'out',args: { x: 85, y: 30 }, attrs: { portLabel: { text: 'Field15', fill: '#00FA00',fontSize: 16 } } },
//           { id: 'out2', group: 'out',args: { x: 85, y: 50 }, attrs: { portLabel: { text: 'Field21', fill: '#FCF66E',fontSize: 16 } } }
//         ]
//       },
//        {
//         type: 'SingleBlock',
//         label: 'Source 8',
//         icon: '📥',
//         size: { width: 100, height: 90 },
//         color: '#4472C4',
//         ports: [
//           { id: 'out1', group: 'out',args: { x: 85, y: 30 }, attrs: { portLabel: { text: 'Field02', fill: '#FF0000',fontSize: 16 } } },
//           { id: 'out2', group: 'out',args: { x: 85, y: 50 }, attrs: { portLabel: { text: 'Field03', fill: '#FF0000',fontSize: 16 } } },
//           { id: 'out3', group: 'out',args: { x: 85, y: 70 }, attrs: { portLabel: { text: 'Field05', fill: '#FF0000',fontSize: 16 } } }

//         ]
//       },

//       // 🔸 Dual Block (custom layout with leftColumn/rightColumn)
//      {
//         type: 'DualBlock',
//         label: 'System 3',
//         icon: '⚙️',
//         size: { width: 220, height: 180 },
//         color: '#4472C4',
//         ports: [
//           // Left column ports (input side)
//           { id: 'input1', group: 'leftColumn', args: { x: 0, y: 20 }, attrs: { portLabel: { text: 'Interface09 ',fontSize: 12, fill: '#000',textDecoration: 'underline' } } },
//           { id: 'input2', group: 'leftColumn', args: { x: 0, y: 40 }, attrs: { portLabel: { text: 'Field01',fontSize: 12, fill: '#000' } } },
//           { id: 'input3', group: 'leftColumn', args: { x: 0, y: 60 }, attrs: { portLabel: { text: 'Field02',fontSize: 12, fill: '#000' } } },

//           // Right column ports (output side)
//           { id: 'output1', group: 'rightColumn', args: { x: 135, y: 20 }, attrs: { portLabel: { text: '     Interface11', fill: '#000',textDecoration: 'underline' } } },
//           { id: 'output2', group: 'rightColumn', args: { x: 135, y: 40 }, attrs: { portLabel: { text: '     Field01', fill: '#000' } } },
//           { id: 'output3', group: 'rightColumn', args: { x: 135, y: 60 }, attrs: { portLabel: { text: '     Field02', fill: '#000' } } },
//           { id: 'output4', group: 'rightColumn', args: { x: 135, y: 80 }, attrs: { portLabel: { text: '     Field03*', fill: '#000' } } },
//           { id: 'output5', group: 'rightColumn', args: { x: 135, y: 100 }, attrs: { portLabel: { text: '     Field04*', fill: '#000' } } },
//           { id: 'output6', group: 'rightColumn', args: { x: 135, y: 120 }, attrs: { portLabel: { text: '     Field05*', fill: '#000',  } } },


//         ]
//       },

//         // 🔸 Dual Block (custom layout with leftColumn/rightColumn)
//       {
//         type: 'DualBlock',
//         label: 'System 4',
//         icon: '⚙️',
//         size: { width: 220, height: 180 },
//         color: '#4472C4',
//         ports: [
//           // Left column ports (input side)
//           { id: 'input1', group: 'leftColumn', args: { x: 0, y: 20 }, attrs: { portLabel: { text: 'Interface12 ',fontSize: 12, fill: '#000',textDecoration: 'underline' } } },
//           { id: 'input2', group: 'leftColumn', args: { x: 0, y: 40 }, attrs: { portLabel: { text: 'Field01',fontSize: 12, fill: '#000' } } },
//           { id: 'input3', group: 'leftColumn', args: { x: 0, y: 60 }, attrs: { portLabel: { text: 'Field02',fontSize: 12, fill: '#000' } } },
//           { id: 'input4', group: 'leftColumn', args: { x: 0, y: 80 }, attrs: { portLabel: { text: 'Field03',fontSize: 12, fill: '#000' } } },

//           // Right column ports (output side)
//           { id: 'output1', group: 'rightColumn', args: { x: 135, y: 20 }, attrs: { portLabel: { text: '     Interface18', fill: '#000',textDecoration: 'underline' } } },
//           { id: 'output2', group: 'rightColumn', args: { x: 135, y: 40 }, attrs: { portLabel: { text: '     Field01', fill: '#000' } } },
//           { id: 'output3', group: 'rightColumn', args: { x: 135, y: 60 }, attrs: { portLabel: { text: '     Field02', fill: '#000' } } },
//           { id: 'output4', group: 'rightColumn', args: { x: 135, y: 80 }, attrs: { portLabel: { text: '     Field03', fill: '#000' } } },
//           { id: 'output5', group: 'rightColumn', args: { x: 135, y: 100 }, attrs: { portLabel: { text: '     Field04*', fill: '#000' } } },
//           { id: 'output6', group: 'rightColumn', args: { x: 135, y: 120 }, attrs: { portLabel: { text: '     Field05*', fill: '#000',  } } },


//         ]
//       },
//       // 🔻 Target with vertical stacking
//       {
//         type: 'SingleBlock',
//         label: 'Target',
//         icon: '🎯',
//         size: { width: 90, height: 150 },
//         color: '#4472C4',
//         ports: [
//           { id: 'field1', group: 'in',args: { x: 20, y: 30 }, attrs: { portLabel: { text: 'Field1', fill: '#00FA00',fontSize: 16 } } },
//           { id: 'field2', group: 'in',args: { x: 20, y: 55 }, attrs: { portLabel: { text: 'Field2', fill: '#00FA00',fontSize: 16 } } },
//           { id: 'field3', group: 'in',args: { x: 20, y: 75 }, attrs: { portLabel: { text: 'Field3', fill: '#FF0000',fontSize: 16 } } },
//           { id: 'field4', group: 'in',args: { x: 20, y: 95 }, attrs: { portLabel: { text: 'Field4', fill: '#FCF66E',fontSize: 16 } } },
//           { id: 'field5', group: 'in',args: { x: 20, y: 115 }, attrs: { portLabel: { text: 'Field5', fill: '#FF0000',fontSize: 16} } }

//         ]
//       }
//     ]
//   }
// ];

categories = [
  {
    label: 'Sources',
    collapsed: false,
    blocks: [
      // 🔹 Single Block with basic input/output
      {
        type: 'SingleBlock',
        label: 'FXALL GUI',
        icon: '📥',
        typeName: 'Source',
        size: { width: 100, height: 40 },
        color: '#fff',
        ports: [
          { id: 'out1', group: 'out', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
        ]
      }
  
    ]
  },
   {
    label: 'Systems',
    collapsed: false,
    blocks: [
            {
        type: 'SingleBlock',
        label: 'TradeEnricher',
        icon: '📥',
        typeName: 'System',
        size: { width: 130, height: 40 },
        color: '#fff',
        ports: [
         
          { id: 'int1', group: 'in', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
          { id: 'out2', group: 'out', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
        ]
      },
             {
        type: 'SingleBlock',
        label: 'Kraken',
        icon: '📥',
        size: { width: 100, height: 40 },
        color: '#fff',
        ports: [
          { id: 'in2', group: 'in', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
          
          { id: 'out3', group: 'out', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
        ]
      },
             {
        type: 'SingleBlock',
        label: 'DealFeed',
        icon: '📥',
        size: { width: 100, height: 40 },
        color: '#fff',
        ports: [
          
          { id: 'in3', group: 'in', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
          { id: 'out4', group: 'out', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
        ]
      }
    ]
  },
  {
    label: 'Targets',
    collapsed: false,
    blocks: [
             {
        type: 'SingleBlock',
        label: 'ESMA / RTS 22',
        icon: '📥',
        size: { width: 170, height: 40 },
        color: '#fff',
  //         attrs: {
  //   title: {
  //     text: 'ESMA / RTS 22',
  //     refX: '10%',
  //     refY: '20%',
  //     textAnchor: 'start',
  //     fontSize: 14,
  //     fill: '#000'
  //   }
  // },
        ports: [
          { id: 'in', group: 'in', attrs: { portLabel: { text: '', fill: '#00FA00',fontSize: 16 } } },
        ]
      },
             {
        type: 'SingleBlock',
        label: 'RTS 22',
        icon: '📥',
        size: { width: 200, height: 40 },
        color: '#fff',
        ports: [
          { id: 'in4', group: 'in',args: { x: 25, y: 50 }, attrs: { portLabel: { text: 'Report Status', fill: '#000',fontSize: 14,  event: 'port:reportStatus' } } },
          { id: 'in5', group: 'in',args: { x: 25, y: 80 }, attrs: { portLabel: { text: 'Transaction Reference', fill: '#000',fontSize: 14, event: 'port:transactionReference' } } },
          { id: 'in6', group: 'in',args: { x: 25, y: 110 }, attrs: { portLabel: { text: 'Trading Venue', fill: '#000',fontSize: 14, event: 'port:tradingVenue' } } }
        ],
        attrs: {
    title: {
      text: 'RTS 22',
      refX: '40%',
      refY: '10%',
      textAnchor: 'start',
      fontSize: 14,
      fill: '#000'
    }
  }
      },
   
  
    ]
  }
];


  toggleCategory(category: any) {
    category.collapsed = !category.collapsed;
  }

  filteredBlocks(category: any) {
    return category.blocks.filter((b: any) =>
      (b.label ?? '').toLowerCase().includes((this.search ?? '').toLowerCase())
    );
  }

  dragStart(event: DragEvent, block: any) {
    event.dataTransfer?.setData('block', JSON.stringify(block));
  }
}
