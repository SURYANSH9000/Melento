export class Product {
  subscribe(arg0: (assessment: any) => void) {
    throw new Error('Method not implemented.');
  }
  id: string;
  aName: string;
  aDes: string;
  aImgSrc: string;
  aPrice: number;
  marks: number;
  time: number;
  course_id: string;
  faculty_id: string;
  isActive: boolean;
  itinery: Itinery[] = [];

  constructor(
    id: string,
    aName: string,
    aDes: string,
    aImgSrc: string,
    aPrice: number,
    faculty_id: string,
    isActive:boolean,
    marks: number,
    time: number,
    course_id: string,
    itin: Itinery[]
  ) {
    this.id = id;
    this.aName = aName;
    this.aDes = aDes;
    this.aImgSrc = aImgSrc;
    this.aPrice = aPrice;
    this.marks = marks;
    this.time = time;
    this.course_id = course_id;
    this.itinery = itin;
    this.faculty_id = faculty_id;
    this.isActive = isActive;
  }
}

export class Itinery {
  id: string;
  category: string;
  question: string;
  options: any;
  correctAns: string;

  constructor(
    id: string,
    category: string,
    question: string,
    options: any,
    correctAns: string
  ) {
    this.id = id;
    this.category = category;
    this.question = question;
    this.options = options;
    this.correctAns = correctAns;
  }
}

export interface CartItem {
  item: Product;
  quantity: number;
}
// export class Activity {
//   id: number;
//   actName: string;

//   constructor(id: number, actNm: string) {
//     this.id = id;
//     this.actName = actNm;
//   }
// }
