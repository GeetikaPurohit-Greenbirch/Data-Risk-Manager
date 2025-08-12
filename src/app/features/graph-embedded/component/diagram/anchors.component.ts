import { dia, shapes, g, anchors } from '@joint/plus';

const mapping = function(view: dia.ElementView, magnet: SVGElement, ref: g.Point) {
    let anchor;
    const model = view.model as shapes.standard.HeaderedRecord;
    const bbox = view.getNodeUnrotatedBBox(magnet);
    const center = model.getBBox().center();
    const angle = model.angle();
    
    const itemId = view.findAttribute('item-id', magnet);
    const side = itemId ? model.getItemSide(itemId) : null;

    if (side === 'left') {
        anchor = bbox.leftMiddle();
    } else if (side === 'right') {
        anchor = bbox.rightMiddle();
    } else {
        let refPoint = ref;
        if (ref instanceof Element) {
            // @ts-ignore
            const refView = this.paper.findView(ref);
            refPoint = (refView) ? refView.getNodeBBox(ref).center() : new g.Point();
        }
        refPoint.rotate(center, angle);
        anchor = (refPoint.x <= (bbox.x + bbox.width / 2)) ? bbox.leftMiddle() : bbox.rightMiddle();
    }

    return anchor.rotate(center, -angle);
};

export const anchorNamespace = { ...anchors };

Object.assign(anchorNamespace, {
    mapping
});
