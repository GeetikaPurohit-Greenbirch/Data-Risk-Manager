import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-report-builder',
  templateUrl: './report-builder.component.html',
  styleUrls: ['./report-builder.component.scss']
})
export class ReportBuilderComponent {
  @Input() position = { x: 40, y: 80 };
  @Input() visible = false;
  @Input() gridRows: any[] = [];
  @Output() build = new EventEmitter<any>();
  @Output() close = new EventEmitter<void>();

  options = {
    contents: {
      coverPage: true,
      synopsis: true,
      useCaseId: true,
      useCaseName: true,
      targetName: true,
      targetStatus: true,
      individualControlReports: false,
      dataFieldDetail: false
    },
    attributes: {
      fieldId: false,
      fieldNo: false,
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
      controlName:false,
      controlStatus: false,
      postControlAccuracy: false,
      postControlCompleteness: false,
      postControlTimeliness: false,
      postControlAccuracyComment: false,
      postControlCompletenessComment: false,
      postControlTimelinessComment: false
    }
  };
  

  onDataFieldDetailChange() {
    if (this.options.contents.dataFieldDetail) {
      // If parent is checked → check & disable children
      this.options.attributes.fieldId = true;
      this.options.attributes.fieldName = true;
    } else {
      // If parent is unchecked → uncheck & enable children
      this.options.attributes.fieldId = false;
      this.options.attributes.fieldName = false;
    }
  }

  includeSampleRows = true;
  http: any;

  // onBuild() {
  //   const options = { contents: this.options.contents, attributes: this.options.attributes, includeSampleRows: this.includeSampleRows };
  //   this.build.emit(options);
  // }


  onBuild() {
    const payload = {
      use_case_id: this.options.contents.useCaseId,  // 👈 added here
      use_case_name: this.options.contents.useCaseName,
      target_name: this.options.contents.targetName,
      date_of_report: true,
  
      target_synopsis: this.options.contents.synopsis,
      target_status: this.options.contents.targetStatus,
      use_case_status: true,
      data_field_detail: this.options.contents.dataFieldDetail,
      individual_control_reports: this.options.contents.individualControlReports,
      target_owner: true,
      target_email: true,
      use_case_owner: true,
      use_case_email: false,
  
      target_data_quality_report_detail: {
        field_id: this.options.attributes.fieldId,
        field_no: this.options.attributes.fieldNo,
        field_name: this.options.attributes.fieldName,
        field_description: this.options.attributes.fieldDescription,
        data_type: this.options.attributes.dataType,
        source_name: this.options.attributes.sourceName,
        source_type: this.options.attributes.sourceType,
  
        accuracy_risk: this.options.attributes.accuracyRisk,
        accuracy_risk_comment: this.options.attributes.accuracyRiskComment,
        completeness_risk: this.options.attributes.completenessRisk,
        completeness_risk_comment: this.options.attributes.completenessRiskComment,
        timeliness_risk: this.options.attributes.timelinessRisk,
        timeliness_risk_comment: this.options.attributes.timelinessRiskComment,
  
        criticality: this.options.attributes.criticality,
        // control_id: this.options.attributes.controlId,
        control_name: this.options.attributes.controlName,
        control_status: this.options.attributes.controlStatus,
  
        post_control_risk_accuracy: this.options.attributes.postControlAccuracy,
        post_control_risk_completeness: this.options.attributes.postControlCompleteness,
        post_control_risk_timeliness: this.options.attributes.postControlTimeliness,
        post_control_risk_accuracyComment: this.options.attributes.postControlAccuracyComment,
        post_control_risk_completenessComment: this.options.attributes.postControlCompletenessComment,
        post_control_risk_timelinessComment: this.options.attributes.postControlTimelinessComment
      }
    };
  
    this.build.emit(payload);  // only emit, no API call here
  }
  

  

  onClose() {
    this.close.emit();
  }
}