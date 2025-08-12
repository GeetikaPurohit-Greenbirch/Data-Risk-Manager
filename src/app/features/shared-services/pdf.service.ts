import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';

@Injectable()
export class PdfService {
  constructor() { }

  generatePdf(options: any, gridRows: any[] = []) {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' });

    let y = 40;
    doc.setFontSize(18);
    doc.text('DQA Target Report', 40, y);
    y += 30;

    doc.setFontSize(12);
    // Contents section
    if (options.contents) {
      doc.text('Contents:', 40, y);
      y += 18;
      if (options.contents.coverPage) { doc.text('- Cover Page', 60, y); y += 14; }
      if (options.contents.synopsis) { doc.text('- Synopsis', 60, y); y += 14; }
      if (options.contents.dataFieldDetail) { doc.text('- DataField Detail', 60, y); y += 14; }
      y += 6;
    }

    // DataField attributes
    if (options.attributes) {
      doc.text('DataField Attributes Selected:', 40, y);
      y += 18;
      const keys = Object.keys(options.attributes).filter(k => options.attributes[k]);
      if (keys.length === 0) {
        doc.text('- (none)', 60, y); y += 14;
      } else {
        keys.forEach(k => { doc.text('- ' + this.friendlyName(k), 60, y); y += 14; });
      }
      y += 6;
    }

    // Example: include first few grid rows if requested
    if (options.includeSampleRows && gridRows?.length > 0) {
      y += 10;
      doc.text('Sample Rows:', 40, y); y += 18;
      const rowsToPrint = gridRows.slice(0, 10);
      rowsToPrint.forEach(row => {
        const line = Object.keys(row).map(k => `${k}: ${row[k]}`).join(' | ');
        doc.text(line.substring(0, 120), 60, y);
        y += 12;
        if (y > 750) { doc.addPage(); y = 40; }
      });
    }

    doc.save('DQA-Report.pdf');
  }

  private friendlyName(key: string) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }
}