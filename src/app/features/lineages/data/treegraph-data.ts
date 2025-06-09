export const TREEGRAPH_DATA = [
  {
    id: 'A',
    name: 'Root Source',
    marker: { symbol: 'triangle' },
  },
  {
    id: 'B',
    parent: 'A',
    name: 'Intermediate Node',
    marker: { symbol: 'square' },
  },
  {
    id: 'C',
    parent: 'B',
    name: 'Child 1',
    marker: { symbol: 'circle' },
  },
  {
    id: 'D',
    parent: 'B',
    name: 'Child 2',
    marker: { symbol: 'circle' },
  }
];
