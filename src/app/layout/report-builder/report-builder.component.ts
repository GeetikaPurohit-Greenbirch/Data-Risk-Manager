import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-report-builder',
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.scss']
})
export class ReportBuilderComponent {
  @Input() position = { x: 40, y: 100 };
  @Input() visible = false;
  @Input() gridRows: any[] = [];
  @Output() build = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  options = {
    contents: {
      coverPage: false,
      synopsis: false,
      useCaseName: false,
      targetName: false,
      targetStatus: false,
      individualControlReports: false,
      dataFieldDetail: false
    },
    attributes: {
      fieldId: false,
      fieldName: false,
      fieldDescription: false,
      dataType: false,
      length: false,
      sourceName: false,
      sourceType: false,
      accuracyRisk: false,
      accuracyRiskComment: false,
      completenessRisk: false,
      completenessRiskComment: false,
      timelinessRisk: false,
      timelinessRiskComment: false,
      criticality: false,
      controlId: false,
      controlStatus: false,
      postControlAccuracy: false,
      postControlCompleteness: false,
      postControlTimeliness: false
    }
  };
  

  includeSampleRows = true;

  onBuild() {
    const options = { contents: this.options.contents, attributes: this.options.attributes, includeSampleRows: this.includeSampleRows };
    this.build.emit(options);
  }

  onClose() {
    this.close.emit();
  }
}