export class Question {
  id: number;
  qText: string;
  options: string[];
  answer: string;
  qType: string;

  constructor(
    id: number,
    qText: string,
    options: string[],
    answer: string,
    qType: string
  ) {
    this.id = id;
    this.qText = qText;
    this.options = options;
    this.answer = answer;
    this.qType = qType;
  }
}
