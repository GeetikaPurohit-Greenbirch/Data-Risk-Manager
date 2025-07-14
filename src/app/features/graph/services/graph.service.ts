
import { Injectable } from '@angular/core';
import * as joint from 'jointjs';
declare module 'jointjs' {
  namespace shapes {
    const processor: any;
  }
}

@Injectable({ providedIn: 'root' })
export class GraphService {
  constructor() {}

registerCustomShapesbackup(): void {
  const shapes = (joint as any).shapes;
  shapes.processor = shapes.processor || {};

  if (!shapes.processor.Block) {
    shapes.processor.Block = 
    
    joint.dia.Element.define(
      'processor.Block',
      {
        type: 'processor.Block',
        size: { width: 120, height: 90 },
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#fff',
            stroke: '#000',
            strokeWidth: 1,
            rx: 6,
            ry: 6
          },
          label: {
            text: 'Block',
            refX: '50%',
            refY: '50%',
            textAnchor: 'middle',
            yAlignment: 'middle',
            fontSize: 13,
            fontWeight: 'bold',
            fill: '#000'
          },
          'remove-icon': {
            text: '✕',
            ref: 'body',
            refX: '100%',
            refY: '0%',
            x: -12,
            y: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            event: 'element:delete',
            visibility: 'hidden',
            fill: 'red'
          },
          'remove-title': {
            text: 'Delete node'
          }
        },
        ports: {
          groups: {
            in: {
              position: { name: 'left' },
              attrs: {
                portLabel: {
                  text: 'Input',
                  fontSize: 10,
                  fill: '#000',
                  textAnchor: 'start',
                  ref: 'portBody',
                  refX: 10,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none' // 🔐 Prevent label from blocking events
                },
                portBody: {
                  r: 6,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true // ✅ magnet must be on the circle only
                }
              },
              markup: [
                { tagName: 'text', selector: 'portLabel' },  // label first
                { tagName: 'circle', selector: 'portBody' }  // circle (magnet) on top
              ]
            },
            out: {
              position: { name: 'right' },
              attrs: {
                portLabel: {
                  text: 'Output',
                  fontSize: 10,
                  fill: '#000',
                  textAnchor: 'end',
                  ref: 'portBody',
                  refX: -10,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none' // 🔐 Prevent label from blocking events
                },
                portBody: {
                  r: 6,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true // ✅ magnet must be on the circle only
                }
              },
              markup: [
                { tagName: 'text', selector: 'portLabel' },  // label first
                { tagName: 'circle', selector: 'portBody' }  // circle (magnet) on top
              ]
            }
          }
        }
      },
      {
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'text', selector: 'label' },
          {
            tagName: 'g',
            selector: 'remove-group',
            children: [
              { tagName: 'text', selector: 'remove-icon' },
              { tagName: 'title', selector: 'remove-title' }
            ]
          }
        ]
      }
    );
  }
}

registerCustomShapes12(): void {
  const shapes = (joint as any).shapes;
  shapes.processor = shapes.processor || {};

  if (!shapes.processor.Block) {
    shapes.processor.Block = joint.dia.Element.define(
      'processor.Block',
      {
        type: 'processor.Block',
        size: { width: 180, height: 160 },
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#ffffff',
            stroke: '#2c3e50',
            strokeWidth: 1,
            rx: 1,
            ry: 1
          },
          title: {
            text: '',
            refX: '20%',
            refY: 10,
            textAnchor: 'middle',
            fontSize: 13,
            fontWeight: 'bold',
            fill: '#2c3e50'
          },
          label: {
            text: 'Interface 1',
            // refX: '50%',
            // refY: '-15%',
            textAnchor: 'middle',
            yAlignment: 'top',      // vertical alignment (JointJS extension)
            refX: 50,
            refY: -30 ,
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#000'
          },
          'remove-icon': {
            text: '✕',
            ref: 'body',
            refX: '100%',
            refY: '0%',
            x: -12,
            y: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            event: 'element:delete',
            visibility: 'hidden',
            fill: 'red'
          },
          'remove-title': {
            text: 'Delete node'
          }
        },
        ports: {
          groups: {
            in: {
              position: { name: 'left' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#000',
                  textAnchor: 'top',
                  ref: 'portBody',
                  // refX: 30,
                  // refY: 5,
                  yAlignment: 'top',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 0,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 0,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'text', selector: 'portLabel' },
                { tagName: 'circle', selector: 'portBody' }
              ]
            },
            out: {
              position: { name: 'right' },
              attrs: {
                portLabel: {
                  fontSize: 14,
                  fill: '#000',
                  textAnchor: 'end',
                  ref: 'portBody',
                  refX: -5,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 1,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'text', selector: 'portLabel' },
                { tagName: 'circle', selector: 'portBody' }
              ]
            }
          }
        }
      },
      {
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'text', selector: 'title' },
          { tagName: 'text', selector: 'label' },
          {
            tagName: 'g',
            selector: 'remove-group',
            children: [
              { tagName: 'text', selector: 'remove-icon' },
              { tagName: 'title', selector: 'remove-title' }
            ]
          }
        ]
      }
    );
  }
}

registerCustomShapes3(): void {
  const shapes = (joint as any).shapes;
  shapes.processor = shapes.processor || {};

  // Shape 1: Single column (in / out)
  if (!shapes.processor.SingleBlock) {
    shapes.processor.SingleBlock = joint.dia.Element.define(
      'processor.SingleBlock',
      {
        type: 'processor.SingleBlock',
        size: { width: 180, height: 160 },
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#ffffff',
            stroke: '#2c3e50',
            strokeWidth: 1,
            rx: 1,
            ry: 1
          },
          title: {
            text: '',
            refX: '20%',
            refY: 10,
            textAnchor: 'middle',
            fontSize: 13,
            fontWeight: 'bold',
            fill: '#2c3e50'
          },
          label: {
            text: 'Interface 1',
            textAnchor: 'middle',
            yAlignment: 'top',
            refX: 50,
            refY: -30,
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#000'
          },
          'remove-icon': {
            text: '✕',
            ref: 'body',
            refX: '100%',
            refY: '0%',
            x: -12,
            y: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            event: 'element:delete',
            visibility: 'hidden',
            fill: 'red'
          },
          'remove-title': {
            text: 'Delete node'
          }
        },
        ports: {
          groups: {
            in: {
              position: { name: 'left' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#000',
                  textAnchor: 'start',
                  ref: 'portBody',
                  refX: 30,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'text', selector: 'portLabel' },
                { tagName: 'circle', selector: 'portBody' }
              ]
            },
            out: {
              position: { name: 'right' },
              attrs: {
                portLabel: {
                  fontSize: 14,
                  fill: '#000',
                  textAnchor: 'end',
                  ref: 'portBody',
                  refX: -5,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'text', selector: 'portLabel' },
                { tagName: 'circle', selector: 'portBody' }
              ]
            }
          }
        }
      },
      {
        markup: [
          { tagName: 'rect', selector: 'body' },
          { tagName: 'text', selector: 'title' },
          { tagName: 'text', selector: 'label' },
          {
            tagName: 'g',
            selector: 'remove-group',
            children: [
              { tagName: 'text', selector: 'remove-icon' },
              { tagName: 'title', selector: 'remove-title' }
            ]
          }
        ]
      }
    );
  }

  // Shape 2: Two-column (leftColumn / rightColumn)
  if (!shapes.processor.DualBlock) {
    shapes.processor.DualBlock = joint.dia.Element.define(
      'processor.DualBlock',
      {
        type: 'processor.DualBlock',
        size: { width: 220, height: 180 },
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#3f51b5',
            stroke: '#000',
            strokeWidth: 1,
            rx: 1,
            ry: 1
          },
          title: {
            text: '',
            refX: '50%',
            refY: 10,
            textAnchor: 'middle',
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#000'
          },
          'remove-icon': {
            text: '✕',
            ref: 'body',
            refX: '100%',
            refY: '0%',
            x: -12,
            y: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            event: 'element:delete',
            visibility: 'hidden',
            fill: 'red'
          }
        },
        ports: {
          groups: {
            leftColumn: {
              position: { name: 'absolute' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#000',
                  textAnchor: 'start',
                  refX: 10,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'circle', selector: 'portBody' },
                { tagName: 'text', selector: 'portLabel' }
              ]
            },
            rightColumn: {
              position: { name: 'absolute' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#000',
                  textAnchor: 'end',
                  refX: -10,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
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
              { tagName: 'text', selector: 'remove-icon' },
              { tagName: 'title', selector: 'remove-title' }
            ]
          }
        ]
      }
    );
  }
}

registerCustomShapesDualNode(): void {
  const shapes = (joint as any).shapes;
  shapes.processor = shapes.processor || {};

  if (!shapes.processor.SingleBlock) {
    shapes.processor.SingleBlock = joint.dia.Element.define(
      'processor.SingleBlock',
      {
        type: 'processor.SingleBlock',
        size: { width: 180, height: 160 },
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#3f51b5',
            stroke: '#000',
            strokeWidth: 1,
            rx: 1,
            ry: 1
          },
          title: {
            text: '',
            refX: '50%',
            refY: -20,
            textAnchor: 'middle',
            fontSize: 14,
            // fontWeight: 'no',
            fill: '#000'
          },
          'remove-icon': {
            text: '✕',
            ref: 'body',
            refX: '100%',
            refY: '0%',
            x: -12,
            y: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            event: 'element:delete',
            visibility: 'hidden',
            fill: 'red'
          }
        },
        ports: {
          groups: {
            in: {
              position: { name: 'left' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#fff',
                  textAnchor: 'start',
                  refX: 10,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'circle', selector: 'portBody' },
                { tagName: 'text', selector: 'portLabel' }
              ]
            },
            out: {
              position: { name: 'right' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#fff',
                  textAnchor: 'end',
                  refX: -10,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'circle', selector: 'portBody' },
                { tagName: 'text', selector: 'portLabel' }
              ]
            },
            verticalIn: {
              position: { name: 'top' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#fff',
                  textAnchor: 'middle',
                  refX: 0,
                  refY: -10,
                  yAlignment: 'bottom',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'circle', selector: 'portBody' },
                { tagName: 'text', selector: 'portLabel' }
              ]
            },
            verticalOut: {
              position: { name: 'bottom' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#fff',
                  textAnchor: 'middle',
                  refX: 0,
                  refY: 10,
                  yAlignment: 'top',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 4,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
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
              { tagName: 'text', selector: 'remove-icon' },
              { tagName: 'title', selector: 'remove-title' }
            ]
          }
        ]
      }
    );
  }

  if (!shapes.processor.DualBlock) {
    shapes.processor.DualBlock = joint.dia.Element.define(
      'processor.DualBlock',
      {
        type: 'processor.DualBlock',
        size: { width: 220, height: 180 },
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#6a1b9a',
            stroke: '#000',
            strokeWidth: 1,
            rx: 1,
            ry: 1
          },
          title: {
            text: '',
            refX: '50%',
            refY: -25,
            textAnchor: 'middle',
            fontSize: 14,
            // fontWeight: 'bold',
            fill: '#000'
          },
          'remove-icon': {
            text: '✕',
            ref: 'body',
            refX: '100%',
            refY: '0%',
            x: -12,
            y: 4,
            fontSize: 16,
            fontWeight: 'bold',
            cursor: 'pointer',
            event: 'element:delete',
            visibility: 'hidden',
            fill: 'red'
          }
        },
        ports: {
          groups: {
            // leftColumn: {
            //   position: { name: 'absolute' },
            //   attrs: {
            //     portLabel: {
            //       fontSize: 12,
            //       fill: '#fff',
            //       textAnchor: 'start',
            //       refX: 10,
            //       refY: 0,
            //       yAlignment: 'middle',
            //       pointerEvents: 'none'
            //     },
            //     portBody: {
            //       r: 1,
            //       fill: '#fff',
            //       stroke: '#000',
            //       strokeWidth: 1,
            //       magnet: true
            //     }
            //   },
            //   markup: [
            //     { tagName: 'circle', selector: 'portBody' },
            //     { tagName: 'text', selector: 'portLabel' }
            //   ]
            // },
            // rightColumn: {
            //   position: { name: 'absolute' },
            //   attrs: {
            //     portLabel: {
            //       fontSize: 12,
            //       fill: '#fff',
            //       textAnchor: 'end',
            //       refX: -10,
            //       refY: 0,
            //       yAlignment: 'middle',
            //       pointerEvents: 'none'
            //     },
            //     portBody: {
            //       r: 1,
            //       fill: '#fff',
            //       stroke: '#000',
            //       strokeWidth: 1,
            //       magnet: true
            //     }
            //   },
            //   markup: [
            //     { tagName: 'circle', selector: 'portBody' },
            //     { tagName: 'text', selector: 'portLabel' }
            //   ]
            // },
           
           
           leftColumn: {
  position: { name: 'absolute' },
  attrs: {
  portLabelBg: {
      width: 85,            // set your desired width
      height: 105,
      fill: '#D9D9D9',      // dark background for contrast
      rx: 0,
      ry: 0,
      ref: 'portLabel',     // position relative to label
      refX: -3,            // shift left based on width
      refY: -6
    },

    // portLabelBackground: {
    //   ref: 'portLabel',
    //   refWidth: '100%',
    //   refHeight: 14,
    //   x: 10,
    //   y: -7,
    //   fill: '#D9D9D9',  // Left column background (e.g., white)
    //   stroke: '#000',
    //   strokeWidth: 0,
    //   rx: 0,
    //   ry: 0
    // },
    portLabel: {
      fontSize: 12,
      fill: '#000',
      textAnchor: 'start',
      refX: 10,
      refY: 0,
      yAlignment: 'middle',
      pointerEvents: 'none'
    },
    portBody: {
      r: 4,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      magnet: true
    }
  },
  markup: [
    { tagName: 'circle', selector: 'portBody' },
    { tagName: 'rect', selector: 'portLabelBg' }, // background rect
    { tagName: 'text', selector: 'portLabel' }
  ]
},

            rightColumn: {
  position: { name: 'absolute' },
  attrs: {
     portLabelBg: {
      width: 85,            // set your desired width
      height: 65,
      fill: '#D9D9D9',      // dark background for contrast
      rx: 0,
      ry: 0,
      ref: 'portLabel',     // position relative to label
      refX: -3,            // shift left based on width
      refY: -6,
      strokeWidth: 1,
    },
   
    portLabel: {
      fontSize: 12,
      fill: '#000',
      textAnchor: 'start',
      refX: -7,
      refY: 0,
      yAlignment: 'middle',
      pointerEvents: 'none'
    },
    portBody: {
      r: 4,
      fill: '#fff',
      stroke: '#000',
      strokeWidth: 1,
      magnet: true
    }
  },
   markup: [
  { tagName: 'rect', selector: 'portLabelBg' },  // draw background first
  { tagName: 'circle', selector: 'portBody' },   // draw circle next (on top)
  { tagName: 'text', selector: 'portLabel' }     // draw label last
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
              { tagName: 'text', selector: 'remove-icon' },
              { tagName: 'title', selector: 'remove-title' }
            ]
          }
        ]
      }
    );
  }
}

registerCustomShapes(): void {
  const shapes = (joint as any).shapes;
  shapes.processor = shapes.processor || {};

  if (!shapes.processor.SingleBlock) {
    shapes.processor.SingleBlock = joint.dia.Element.define(
      'processor.SingleBlock',
      {
        type: 'processor.SingleBlock',
        size: { width: 180, height: 160 },
        attrs: {
          body: {
            refWidth: '100%',
            refHeight: '100%',
            fill: '#3f51b5',
            stroke: '#36454F',
            strokeWidth: 1,
            rx: 4,
            r: 2,
            ry: 4
          },
          title: {
            text: '',
            refX: '50%',
            refY: '40%',
            textAnchor: 'middle',
            fontSize: 14,
            fill: '#000'
          },
          // 'remove-icon': {
          //   text: '✕',
          //   ref: 'body',
          //   refX: '100%',
          //   refY: '0%',
          //   x: -12,
          //   y: 4,
          //   fontSize: 14,
          //   fontWeight: 'bold',
          //   cursor: 'pointer',
          //   event: 'element:delete',
          //   visibility: 'hidden',
          //   fill: 'red'
          // },
      'remove-icon': {
        d: 'M96 464c0 26.5 21.5 48 48 48h224c26.5 0 48-21.5 48-48V160H96v304zm64-240h32v208h-32V224zm96 0h32v208h-32V224zm96 0h32v208h-32V224zM432 32H312l-9.4-18.7C297.3 5.1 288.2 0 278.1 0h-44.2c-10.1 0-19.2 5.1-24.5 13.3L200 32H80C53.5 32 32 53.5 32 80v32c0 8.8 7.2 16 16 16h416c8.8 0 16-7.2 16-16V80c0-26.5-21.5-48-48-48z',
        fill: 'red',
        ref: 'body',
        refX: '95%',
        refY: '-5%',
        x: -18,
        y: 0,
        transform: 'scale(0.025)',  // Adjust scale as needed
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
          },
        


        },
        ports: {
          groups: {
            in: {
              position: { name: 'left' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#fff',
                  textAnchor: 'start',
                  refX: 10,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 5,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true
                }
              },
              markup: [
                { tagName: 'circle', selector: 'portBody' },
                { tagName: 'text', selector: 'portLabel' }
              ]
            },
            out: {
              position: { name: 'right' },
              attrs: {
                portLabel: {
                  fontSize: 12,
                  fill: '#fff',
                  textAnchor: 'start',
                  refX: 12,
                  refY: 0,
                  yAlignment: 'middle',
                  pointerEvents: 'none'
                },
                portBody: {
                  r: 5,
                  fill: '#fff',
                  stroke: '#000',
                  strokeWidth: 1,
                  magnet: true,
                  x: -10,
                  y: 0
                }
              },
              markup: [
                { tagName: 'circle', selector: 'portBody' },
                { tagName: 'text', selector: 'portLabel' }
              ]
            },
            // verticalIn: {
            //   position: { name: 'top' },
            //   attrs: {
            //     portLabel: {
            //       fontSize: 12,
            //       fill: '#fff',
            //       textAnchor: 'middle',
            //       refX: 0,
            //       refY: -10,
            //       yAlignment: 'bottom',
            //       pointerEvents: 'none'
            //     },
            //     portBody: {
            //       r: 5,
            //       fill: '#fff',
            //       stroke: '#000',
            //       strokeWidth: 1,
            //       magnet: true
            //     }
            //   },
            //   markup: [
            //     { tagName: 'circle', selector: 'portBody' },
            //     { tagName: 'text', selector: 'portLabel' }
            //   ]
            // },
            // verticalOut: {
            //   position: { name: 'bottom' },
            //   attrs: {
            //     portLabel: {
            //       fontSize: 12,
            //       fill: '#fff',
            //       textAnchor: 'middle',
            //       refX: 0,
            //       refY: 10,
            //       yAlignment: 'top',
            //       pointerEvents: 'none'
            //     },
            //     portBody: {
            //       r: 4,
            //       fill: '#fff',
            //       stroke: '#000',
            //       strokeWidth: 1,
            //       magnet: true
            //     }
            //   },
            //   markup: [
            //     { tagName: 'circle', selector: 'portBody' },
            //     { tagName: 'text', selector: 'portLabel' }
            //   ]
            // }
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
          { tagName: 'rect', selector: 'resize-handle' },
// 👈 Add this for resize
        ]
      }
    );
  }

  // You can copy the same logic to DualBlock if needed.
}






}


