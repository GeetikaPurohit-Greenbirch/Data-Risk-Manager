import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nodes',
  templateUrl: './nodes.component.html',
  styleUrls: ['./nodes.component.scss']
})
export class NodesComponent implements OnInit {
  blocks = blocks;

  ngOnInit(): void {
    // Init logic here
  }

  dragStart(event: DragEvent, block: any) {
    event.dataTransfer?.setData('block', JSON.stringify(block));
  }
}

// Define `blocks` AFTER the component class
const blocks = [
  {
    type: 'Concat',
    label: 'Source',
    icon: '<i class="fa fa-database" aria-hidden="true"></i>',
    sicon: 'assets/icons/database.svg',
    typeName: 'sources',
    color: '#fff',
    args: { x: 15, y: 50 },
    size: { width: 120, height: 40 },
    ports: [
      { id: 'in1', group: 'in', attrs: { portLabel: { text: 'Input', fontSize: 14, fill: '#00FA00' } } },
      { id: 'out1', group: 'out', attrs: { portLabel: { text: 'Output', fontSize: 14, fill: '#00FA00' } } }
    ],
    items: [{ id: 'FXALLGUI', label: 'FXALL GUI' }]
  },
  {
    type: 'Concat',
    label: 'System',
    icon: '<i class="fa fa-cogs" aria-hidden="true"></i>',
    sicon: 'assets/icons/system.svg',
    typeName: 'systems',
    color: '#fff',
    args: { x: 115, y: 50 },
    size: { width: 120, height: 40 },
    // ports: [
    //   { id: 'in1', group: 'in', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } },
    //   { id: 'out2', group: 'out', attrs: { portLabel: { text: '', fontSize: 14, fill: '#000' } } }
    // ],
       allItems: [
  // 50 "Field" items
  Array.from({ length: 3 }, (_, i) => ({
    id: `value_${i + 1}`,
    label: `${i==2?'System':'Interface'}${i + 1}`,
    items: Array.from({ length: 1 }, (_, j) => ({ id: `value_${i + 1}_sub_${j + 1}`, label: `Subfield ${j + 1}`}))
  })),

  // 50 "out" items
  Array.from({ length: 1 }, (_, i) => ({
    id: `value_${i + 51}`,
    label: `Inteface 3`,
    items: Array.from({ length: 2 }, (_, j) => ({ id: `value_${i + 51 + 1}_sub_${j + 51 + 1}`, label: `Subfield ${j + 51 + 1}`}))
  })),
],
    items: [{ id: 'tradeEnricher', label: 'Trade Enricher' }, { id: 'kraken', label: 'Kraken' }, { id: 'dealfeed', label: 'Deal Feed' }]
  },
  // {
  //   type: 'Constant',
  //   label: 'Control',
  //   args: { x: 215, y: 50 },
  //   icon: '<i class="fa fa-sliders" aria-hidden="true"></i>',
  //   sicon: 'assets/icons/controls.svg',
  //   typeName: 'controls',
  //   color: '#fff',
  //   size: { width: 120, height: 40 },
  //   ports: [
  //     { id: 'in2', group: 'in', attrs: { portLabel: { text: 'Input', fontSize: 14, fill: '#000' } } },
  //     { id: 'out3', group: 'out', attrs: { portLabel: { text: 'Output', fontSize: 14, fill: '#000' } } }
  //   ],
  //   items: [{ id: 'Kraken', label: 'Kraken' }, { id: 'dealFeed', label: 'DealFeed' }]
  // },
  {
    type: 'Record',
    label: 'Target',
    icon: '<i class="fa fa-bullseye" aria-hidden="true"></i>',
    sicon: 'assets/icons/target.svg',
    typeName: 'targets',
    args: { x: 400, y: 100 },
    color: '#fff',
    size: { width: 200, height: 400 },
    items: [{ id: 'RTS22', label: 'RTS22' }],
    allItems: [
    //   { id: 'reportStatus', label: 'Report Status' },
    //   { id: 'transactionReferenceNumber', label: 'Transaction Reference Number' },
    //   { id: 'tradingVenueTransactionIdentificationCode', label: 'Trading Venue Transaction Identification Code' },
    //   { id: 'executingEntityIdentificationCode', label: 'Executing Entity Identification Code' },
    //   { id: 'investmentFirmCoveredByDirective', label: 'Investment Firm covered by Directive 2004/39/EC or Directive 2014/65/EU' },
    //   { id: 'submittingEntityIdentificationCode', label: 'Submitting Entity Identification Code' },
    //   { id: 'buyerIdentificationCode', label: 'Buyer Identification Code' },
    //   { id: 'sellerIdentificationCode', label: 'Seller Identification Code' },
    //   { id: 'transmissionOfOrderIndicator', label: 'Transmission of Order Indicator' },
    //   { id: 'tradingDateTime', label: 'Trading Date Time' },
    //   { id: 'tradingCapacity', label: 'Trading Capacity' },
    //   { id: 'quantity', label: 'Quantity' },
    //   { id: 'quantityCurrency', label: 'Quantity Currency' },
    //   { id: 'derivativeNotionalIncreaseOrDecrease', label: 'Derivative Notional Increase/Decrease' },
    //   { id: 'price', label: 'Price' },
    //   { id: 'priceCurrency', label: 'Price Currency' },
    //   { id: 'venue', label: 'Venue' },
    //   { id: 'countryOfBranchMembership', label: 'Country of the Branch Membership' },
    //   { id: 'complexTradeComponentId', label: 'Complex Trade Component ID' },
    //   { id: 'instrumentIdentificationCode', label: 'Instrument Identification Code' },
    //   { id: 'investmentDecisionWithinFirm', label: 'Investment Decision Within Firm' },
    //   { id: 'investmentDecisionBranchCountry', label: 'Country of the Branch Responsible for Investment Decision' },
    //   { id: 'executionWithinFirm', label: 'Execution Within Firm' },
    //   { id: 'executionBranchCountry', label: 'Country of the Branch Supervising Execution' },
    //   { id: 'waiverIndicator', label: 'Waiver Indicator' }
    ]
    },
//      {
//     type: 'Concat',
//     label: 'systems',
//     icon: '<i class="fa fa-bullseye" aria-hidden="true"></i>',
//     sicon: 'assets/icons/target.svg',
//     typeName: 'systems',
//     args: { x: 400, y: 100 },
//     color: '#fff',
//     size: { width: 200, height: 300 },
//     items: [{ id: 's1', label: 's1' }],
//     allItems: [
//   // 50 "Field" items
//   Array.from({ length: 3 }, (_, i) => ({
//     id: `value_${i + 1}`,
//     label: `${i==2?'System':'Interface'}${i + 1}`,
//     items: Array.from({ length: 1 }, (_, j) => ({ id: `value_${i + 1}_sub_${j + 1}`, label: `Subfield ${j + 1}`}))
//   })),

//   // 50 "out" items
//   Array.from({ length: 1 }, (_, i) => ({
//     id: `value_${i + 51}`,
//     label: `Inteface 3`,
//     items: Array.from({ length: 2 }, (_, j) => ({ id: `value_${i + 51 + 1}_sub_${j + 51 + 1}`, label: `Subfield ${j + 51 + 1}`}))
//   })),
// ]
//     },
  ]
