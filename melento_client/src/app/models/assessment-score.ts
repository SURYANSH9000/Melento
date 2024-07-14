export class AssessmentScore {
  id: string;
  assessmentName: string | undefined;
  totalMarks: number | undefined;
  assessmentId: string | undefined;
  userId: string;
  score: number;
  marksArray: number[] | undefined;

  constructor(
    id: string,
    assessmentId: string,
    userId: string,
    score: number,
    assessmentName: string,
    totalMarks: number,
    marksArray: number[]
  ) {
    this.id = id;
    this.assessmentId = assessmentId;
    this.userId = userId;
    this.score = score;
    this.assessmentName = assessmentName;
    this.totalMarks = totalMarks;
    this.marksArray = marksArray;
  }
}
