import { dia, shapes, util } from '@joint/plus';

/* ================================
 * HEADER SHAPE
 * ================================ */
export class Header extends dia.Element {

    override defaults(): dia.Element.Attributes {
        return {
            ...super.defaults,
            type: 'kanban.Header',

            markup: [
                { tagName: 'text', selector: 'label' },
                { tagName: 'rect', selector: 'marker' }
            ],

            attrs: {
                root: { pointerEvents: 'none' },

                label: {
                    x: 'calc(0.5 * w)',
                    fontSize: 24,
                    fontFamily: 'Helvetica',
                    fontWeight: 'Normal',
                    stroke: 'none',
                    textAnchor: 'middle',
                    textVerticalAnchor: 'top'
                },

                marker: {
                    y: 'calc(h - 10)',
                    height: 10,
                    width: 'calc(w)',
                    stroke: 'none'
                }
            },

            z: -2
        };
    }

    static isHeader(cell: dia.Cell): boolean {
        return cell.get('type') === 'kanban.Header';
    }
}

/* ================================
 * TASK SHAPE
 * ================================ */
export class Task extends dia.Element {

    override defaults() {
        return {
            ...super.defaults,
            type: 'kanban.Task',

            markup: [
                { tagName: 'rect', selector: 'body' },
                { tagName: 'rect', selector: 'header' },
                { tagName: 'text', selector: 'headerText' },
                { tagName: 'text', selector: 'bodyText' }
            ],

            attrs: {
                body: {
                    fill: '#FFF',
                    height: 'calc(h)',
                    width: 'calc(w)',
                    strokeWidth: 2,
                    rx: 4,
                    ry: 4,
                    stroke: '#DDDDDD'                    
                },

                header: {
                    fill: 'transparent',
                    stroke: 'none',
                    height: 65,
                    width: 'calc(w)'
                },

                headerText: {
                    cursor: 'text',
                    x: 20,
                    y: 20,
                    // fontWeight: 'Bold',
                    fontFamily: 'Helvetica',
                    textVerticalAnchor: 'top',
                    textAnchor: 'start',
                    fontSize: 11,
                    fill: '#FFF',

                    textWrap: {
                        maxLineCount: 3,
                        ellipsis: false,
                        width: -60
                    }
                },

                bodyText: {
                    cursor: 'text',
                    x: 20,
                    y: 55,
                    fontFamily: 'Helvetica',
                    lineHeight: '1.5em',
                    textAnchor: 'start',
                    textVerticalAnchor: 'top',
                    fontWeight: 'Normal',
                    fontSize: 12,
                    fill: '#666',

                    textWrap: {
                        width: -40,
                        ellipsis: true,
                        height: -55
                    }
                }
            },

            z: 2
        };
    }

    static isTask(cell: dia.Cell): boolean {
        return cell.get('type') === 'kanban.Task';
    }
}

/* ================================
 * DEPENDENCY LINK
 * ================================ */
const color = '#F93943';

export class Dependency extends shapes.standard.Link {

    override defaults() {
        return util.defaultsDeep({
            type: 'kanban.Dependency',
            z: 3,

            attrs: {
                line: {
                    stroke: color,
                    strokeDasharray: '5,5',
                    targetMarker: { d: 'M 0 0 7 5 7 -5' }                     
                }
            },

            labels: [
                {
                    position: 0.5,
                    attrs: {
                        text: {
                            text: '',
                            fill: 'white',
                            fontSize: 6,
                            fontFamily: 'sans-serif'
                        },
                        rect: {
                            fill: color,
                            stroke: color,
                            strokeWidth: 5,
                            rx: 1,
                            ry: 1
                        }
                    }
                }
            ]
        }, super.defaults);
    }
}

/* ================================
 * ANIMATED ELEMENT VIEW
 * ================================ */
export class AnimatedElementView extends dia.ElementView {
    private move?: Animation;

    override updateTransformation(): void {
        const { el, model } = this;

        const pos = model.get('position') as dia.Point | undefined;
        const x = pos?.x ?? 0;
        const y = pos?.y ?? 0;

        const transform = `translate(${x}px, ${y}px)`;
        const keyframes = { transform: [transform] };

        // Reuse animation if exists
        if (this.move) {
            const move = this.move;
            (move.effect as KeyframeEffect).setKeyframes(keyframes);

            move.currentTime = 0;
            move.play();
            return;
        }

        // Create new animation
        const move = el.animate(keyframes, {
            easing: 'ease-in-out',
            fill: 'forwards',
            duration: 200
        });

        move.onfinish = () => {
            // Avoid "invalid target element" error
            if (el.isConnected) {
                try {
                    move.commitStyles();
                } catch (_) {}
            }
        };

        this.move = move;
    }
}
