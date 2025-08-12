export const L001 ={
  "cells": [
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "a7ed17df-a5a3-4062-a65c-0d1c552115ce",
        "port": "out1"
      },
      "target": {
        "id": "d6591706-1793-4343-988e-09ef0bd17433",
        "port": "in1"
      },
      "id": "4adda5f6-ab2c-4a27-932c-2f6d51a5b38d",
      "attrs": {
        "line": {
          "stroke": "#FF9800",
          "strokeWidth": 2,
          "strokeDasharray": "10 5"
        }
      }
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "a7ed17df-a5a3-4062-a65c-0d1c552115ce",
        "port": "out1"
      },
      "target": {
        "id": "6716b895-2fa8-4597-96d6-38621da0b71a",
        "port": "in1"
      },
      "id": "c5774d08-71fb-43d1-8158-b22438267870",
      "attrs": {
        "line": {
          "stroke": "#000000"
        }
      }
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "d6591706-1793-4343-988e-09ef0bd17433",
        "port": "out2"
      },
      "target": {
        "id": "3641373f-c5f8-4399-af31-3b2cfaf10a1a",
        "port": "investmentFirmCoveredByDirective"
      },
      "id": "7af1f0e8-1395-47a6-a770-9ef976076403",
      "attrs": {
        "line": {
          "stroke": "#FF9800",
          "strokeWidth": 2,
          "strokeDasharray": "10 5"
        }
      }
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "6716b895-2fa8-4597-96d6-38621da0b71a",
        "port": "out2"
      },
      "target": {
        "id": "3641373f-c5f8-4399-af31-3b2cfaf10a1a",
        "port": "submittingEntityIdentificationCode"
      },
      "id": "3240afaf-0884-4628-8222-e68ec7639419",
      "attrs": {
        "line": {
          "stroke": "#000000"
        }
      }
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "6716b895-2fa8-4597-96d6-38621da0b71a",
        "port": "out2"
      },
      "target": {
        "id": "3641373f-c5f8-4399-af31-3b2cfaf10a1a",
        "port": "otcPostTradeIndicator"
      },
      "id": "3340afaf-0884-4628-8222-e68ec7639419",
      "attrs": {
        "line": {
          "stroke": "#000000"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/database.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "FXALL GUI",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "out1",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "Output",
                "fontSize": 14,
                "fill": "#00FA00"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 44,
        "y": 168
      },
      "angle": 0,
      "id": "a7ed17df-a5a3-4062-a65c-0d1c552115ce",
      "z": 1,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "label": {
          "text": "Source"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/system.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "Trade Enricher",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in1",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out2",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 298,
        "y": 103
      },
      "angle": 0,
      "id": "d6591706-1793-4343-988e-09ef0bd17433",
      "z": 2,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "System"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/system.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "Kraken",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in1",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out2",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 304,
        "y": 243
      },
      "angle": 0,
      "id": "6716b895-2fa8-4597-96d6-38621da0b71a",
      "z": 3,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "System"
        }
      }
    },
    {
      "type": "mapping.Record",
      "itemHeight": 20,
      "itemOffset": 15,
      "itemMinLabelWidth": 90,
      "itemAboveViewSelector": "header",
      "itemBelowViewSelector": "footer",
      "padding": {
        "top": 35,
        "left": 15,
        "right": 10,
        "bottom": 10
      },
      "scrollTop": 0,
      "size": {
        "width": 400,
        "height": 200
      },
      "itemOverflow": true,
      "items": [
        [
          {
            "id": "reportStatus",
            "label": "Report Status"
          },
          {
            "id": "transactionReferenceNumber",
            "label": "Transaction Reference Number"
          },
          {
            "id": "tradingVenueTransactionIdentificationCode",
            "label": "Trading Venue Transaction Identification Code"
          },
          {
            "id": "executingEntityIdentificationCode",
            "label": "Executing Entity Identification Code"
          },
          {
            "id": "investmentFirmCoveredByDirective",
            "label": "Investment Firm covered by Directive 2004/39/EC or Directive 2014/65/EU"
          },
          {
            "id": "submittingEntityIdentificationCode",
            "label": "Submitting Entity Identification Code"
          },
          {
            "id": "buyerIdentificationCode",
            "label": "Buyer Identification Code"
          },
          {
            "id": "sellerIdentificationCode",
            "label": "Seller Identification Code"
          },
          {
            "id": "transmissionOfOrderIndicator",
            "label": "Transmission of Order Indicator"
          },
          {
            "id": "tradingDateTime",
            "label": "Trading Date Time"
          },
          {
            "id": "tradingCapacity",
            "label": "Trading Capacity"
          },
          {
            "id": "quantity",
            "label": "Quantity"
          },
          {
            "id": "quantityCurrency",
            "label": "Quantity Currency"
          },
          {
            "id": "derivativeNotionalIncreaseOrDecrease",
            "label": "Derivative Notional Increase/Decrease"
          },
          {
            "id": "price",
            "label": "Price"
          },
          {
            "id": "priceCurrency",
            "label": "Price Currency"
          },
          {
            "id": "venue",
            "label": "Venue"
          },
          {
            "id": "countryOfBranchMembership",
            "label": "Country of the Branch Membership"
          },
          {
            "id": "complexTradeComponentId",
            "label": "Complex Trade Component ID"
          },
          {
            "id": "instrumentIdentificationCode",
            "label": "Instrument Identification Code"
          },
          {
            "id": "investmentDecisionWithinFirm",
            "label": "Investment Decision Within Firm"
          },
          {
            "id": "investmentDecisionBranchCountry",
            "label": "Country of the Branch Responsible for Investment Decision"
          },
          {
            "id": "executionWithinFirm",
            "label": "Execution Within Firm"
          },
          {
            "id": "executionBranchCountry",
            "label": "Country of the Branch Supervising Execution"
          },
          {
            "id": "waiverIndicator",
            "label": "Waiver Indicator"
          },
          {
            "id": "otcPostTradeIndicator",
            "label": "OTC Post-Trade Indicator"
          },
          {
            "id": "securitiesFinancingTransactionIndicator",
            "label": "Securities Financing Transaction Indicator"
          }
        ]
      ],
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "position": {
        "x": 545,
        "y": 82
      },
      "angle": 0,
      "icon": "assets/icons/target.svg",
      "ports": [],
      "id": "3641373f-c5f8-4399-af31-3b2cfaf10a1a",
      "z": 4,
      "attrs": {
        "headerIcon": {
          "xlink:href": "assets/icons/target.svg"
        },
        "headerLabel": {
          "textWrap": {
            "text": "RTS 22"
          }
        }
      }
    }
  ]
}
export const L002 ={
  "cells": [
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
        "port": "out1"
      },
      "target": {
        "id": "213fad01-9638-4816-9e01-f44b77ec4738",
        "port": "in2"
      },
      "id": "7648df42-d972-44e5-94bc-5bfab95a32de",
      "attrs": {}
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
        "port": "out1"
      },
      "target": {
        "id": "665fa08b-930d-4b6c-abbd-798d7c0a0aff",
        "port": "in2"
      },
      "id": "1a949e5f-4d0b-4f19-ad1c-55798c5689c3",
      "attrs": {}
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
        "port": "out1"
      },
      "target": {
        "id": "855fd8f2-3968-4d39-8281-010d736809fe",
        "port": "in1"
      },
      "id": "999ae894-07cf-4844-95a3-96b662ec3378",
      "attrs": {}
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/database.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "FXALL GUI",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "out1",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "Output",
                "fontSize": 14,
                "fill": "#00FA00"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 52,
        "y": 206
      },
      "angle": 0,
      "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
      "z": 1,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "label": {
          "text": "Source"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/controls.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "Kraken",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in2",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "Input",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out3",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "Output",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 341,
        "y": 205
      },
      "angle": 0,
      "id": "665fa08b-930d-4b6c-abbd-798d7c0a0aff",
      "z": 2,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "Controls"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/controls.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "DealFeed",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in2",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "Input",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out3",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "Output",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 338,
        "y": 73
      },
      "angle": 0,
      "id": "213fad01-9638-4816-9e01-f44b77ec4738",
      "z": 3,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "Controls"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/system.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "Trade Enricher",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in1",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out2",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 350,
        "y": 342
      },
      "angle": 0,
      "id": "855fd8f2-3968-4d39-8281-010d736809fe",
      "z": 4,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "System"
        }
      }
    }
  ]
}

export const L003 = {
  "cells": [
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
        "port": "out1"
      },
      "target": {
        "id": "213fad01-9638-4816-9e01-f44b77ec4738",
        "port": "in2"
      },
      "id": "7648df42-d972-44e5-94bc-5bfab95a32de",
      "attrs": {}
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
        "port": "out1"
      },
      "target": {
        "id": "665fa08b-930d-4b6c-abbd-798d7c0a0aff",
        "port": "in2"
      },
      "id": "1a949e5f-4d0b-4f19-ad1c-55798c5689c3",
      "attrs": {}
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
        "port": "out1"
      },
      "target": {
        "id": "855fd8f2-3968-4d39-8281-010d736809fe",
        "port": "in1"
      },
      "id": "999ae894-07cf-4844-95a3-96b662ec3378",
      "attrs": {}
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "213fad01-9638-4816-9e01-f44b77ec4738",
        "port": "out3"
      },
      "target": {
        "id": "33f75d37-e561-45fd-bd8e-7394212d5909",
        "port": "executingEntityIdentificationCode"
      },
      "id": "27f54c83-afcd-4f01-b4e0-9240f1270ab6",
      "attrs": {}
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "665fa08b-930d-4b6c-abbd-798d7c0a0aff",
        "port": "out3"
      },
      "target": {
        "id": "33f75d37-e561-45fd-bd8e-7394212d5909",
        "port": "reportStatus"
      },
      "id": "04dbf313-c29a-4092-94d3-87d87757994c",
      "attrs": {}
    },
    {
      "type": "mapping.Link",
      "z": -1,
      "router": {
        "name": "normal"
      },
      "connector": {
        "name": "smooth"
      },
      "source": {
        "id": "855fd8f2-3968-4d39-8281-010d736809fe",
        "port": "out2"
      },
      "target": {
        "id": "33f75d37-e561-45fd-bd8e-7394212d5909",
        "port": "buyerIdentificationCode"
      },
      "id": "3697e141-9cc9-45f3-b614-69ad72b2de69",
      "attrs": {}
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/database.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "FXALL GUI",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "out1",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "Output",
                "fontSize": 14,
                "fill": "#00FA00"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 52,
        "y": 206
      },
      "angle": 0,
      "id": "90f670a3-70e7-46e2-958d-6656725d6a4b",
      "z": 1,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "label": {
          "text": "Source"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/controls.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "Kraken",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in2",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "Input",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out3",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "Output",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 341,
        "y": 205
      },
      "angle": 0,
      "id": "665fa08b-930d-4b6c-abbd-798d7c0a0aff",
      "z": 2,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "Controls"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/controls.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "DealFeed",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in2",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "Input",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out3",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "Output",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 338,
        "y": 73
      },
      "angle": 0,
      "id": "213fad01-9638-4816-9e01-f44b77ec4738",
      "z": 3,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "Controls"
        }
      }
    },
    {
      "type": "mapping.Constant",
      "itemHeight": 40,
      "itemOffset": 5,
      "itemMinLabelWidth": 30,
      "items": [
        [
          {
            "id": "icon",
            "icon": "assets/icons/system.svg"
          }
        ],
        [
          {
            "id": "value",
            "label": "Trade Enricher",
            "span": 2
          }
        ],
        []
      ],
      "portMarkup": [
        {
          "tagName": "circle",
          "selector": "portBody"
        }
      ],
      "ports": {
        "groups": {
          "in": {
            "position": {
              "name": "left"
            },
            "attrs": {
              "portBody": {
                "magnet": "passive",
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "left",
                "args": {
                  "y": 0
                }
              }
            }
          },
          "out": {
            "position": {
              "name": "right"
            },
            "attrs": {
              "portBody": {
                "magnet": true,
                "r": 3,
                "fill": "#000",
                "stroke": "#fff",
                "strokeWidth": 1
              }
            },
            "label": {
              "position": {
                "name": "right",
                "args": {
                  "y": 0
                }
              }
            }
          }
        },
        "items": [
          {
            "id": "in1",
            "group": "in",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          },
          {
            "id": "out2",
            "group": "out",
            "attrs": {
              "portLabel": {
                "text": "",
                "fontSize": 14,
                "fill": "#000"
              }
            }
          }
        ]
      },
      "padding": 0,
      "size": {
        "width": 159,
        "height": 40
      },
      "scrollTop": null,
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "itemOverflow": false,
      "itemAboveViewSelector": "root",
      "itemBelowViewSelector": "root",
      "position": {
        "x": 350,
        "y": 342
      },
      "angle": 0,
      "id": "855fd8f2-3968-4d39-8281-010d736809fe",
      "z": 4,
      "attrs": {
        "body": {
          "fill": "#fff",
          "border": "2px solid #cfd8dc"
        },
        "tabColor": {
          "fill": "#14bc9b",
          "stroke": "#14bc9b"
        },
        "label": {
          "text": "System"
        }
      }
    },
    {
      "type": "mapping.Record",
      "itemHeight": 20,
      "itemOffset": 15,
      "itemMinLabelWidth": 90,
      "itemAboveViewSelector": "header",
      "itemBelowViewSelector": "footer",
      "padding": {
        "top": 35,
        "left": 15,
        "right": 10,
        "bottom": 10
      },
      "scrollTop": 0,
      "size": {
        "width": 400,
        "height": 200
      },
      "itemOverflow": true,
      "items": [
        [
          {
            "id": "reportStatus",
            "label": "Report Status"
          },
          {
            "id": "transactionReferenceNumber",
            "label": "Transaction Reference Number"
          },
          {
            "id": "tradingVenueTransactionIdentificationCode",
            "label": "Trading Venue Transaction Identification Code"
          },
          {
            "id": "executingEntityIdentificationCode",
            "label": "Executing Entity Identification Code"
          },
          {
            "id": "investmentFirmCoveredByDirective",
            "label": "Investment Firm covered by Directive 2004/39/EC or Directive 2014/65/EU"
          },
          {
            "id": "submittingEntityIdentificationCode",
            "label": "Submitting Entity Identification Code"
          },
          {
            "id": "buyerIdentificationCode",
            "label": "Buyer Identification Code"
          },
          {
            "id": "sellerIdentificationCode",
            "label": "Seller Identification Code"
          },
          {
            "id": "transmissionOfOrderIndicator",
            "label": "Transmission of Order Indicator"
          },
          {
            "id": "tradingDateTime",
            "label": "Trading Date Time"
          },
          {
            "id": "tradingCapacity",
            "label": "Trading Capacity"
          },
          {
            "id": "quantity",
            "label": "Quantity"
          },
          {
            "id": "quantityCurrency",
            "label": "Quantity Currency"
          },
          {
            "id": "derivativeNotionalIncreaseOrDecrease",
            "label": "Derivative Notional Increase/Decrease"
          },
          {
            "id": "price",
            "label": "Price"
          },
          {
            "id": "priceCurrency",
            "label": "Price Currency"
          },
          {
            "id": "venue",
            "label": "Venue"
          },
          {
            "id": "countryOfBranchMembership",
            "label": "Country of the Branch Membership"
          },
          {
            "id": "complexTradeComponentId",
            "label": "Complex Trade Component ID"
          },
          {
            "id": "instrumentIdentificationCode",
            "label": "Instrument Identification Code"
          },
          {
            "id": "investmentDecisionWithinFirm",
            "label": "Investment Decision Within Firm"
          },
          {
            "id": "investmentDecisionBranchCountry",
            "label": "Country of the Branch Responsible for Investment Decision"
          },
          {
            "id": "executionWithinFirm",
            "label": "Execution Within Firm"
          },
          {
            "id": "executionBranchCountry",
            "label": "Country of the Branch Supervising Execution"
          },
          {
            "id": "waiverIndicator",
            "label": "Waiver Indicator"
          }
        ]
      ],
      "itemButtonSize": 10,
      "itemIcon": {
        "width": 16,
        "height": 16,
        "padding": 2
      },
      "position": {
        "x": 650,
        "y": 101
      },
      "angle": 0,
      "icon": "assets/icons/target.svg",
      "ports": [],
      "id": "33f75d37-e561-45fd-bd8e-7394212d5909",
      "z": 5,
      "attrs": {
        "headerIcon": {
          "xlink:href": "assets/icons/target.svg"
        },
        "headerLabel": {
          "textWrap": {
            "text": "RTS22"
          }
        }
      }
    }
  ]
}
