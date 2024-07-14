export class Attendance {
  id: string;
  userId: string;
  assessmentId: string;
  status: string;
  assessmentName: string;
  date: string;

  constructor(
    id: string,
    userId: string,
    assessmentId: string,
    status: string,
    assessmentName: string,
    date: string
  ) {
    this.id = id;
    this.userId = userId;
    this.assessmentId = assessmentId;
    this.status = status;
    this.assessmentName = assessmentName;
    this.date = date;
  }
}
