export class AssessmentPlot {
  id: string;
  attemptId: string;
  plotSource: string;

  constructor(id: string, attemptId: string, plotSource: string) {
    this.id = id;
    this.attemptId = attemptId;
    this.plotSource = plotSource;
  }
}
