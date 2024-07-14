export class Course {
  id: string;
  cName: string;
  cDescription: string;
  categoryId: string;

  constructor(id: string, cName: string, cDescription: string, categoryId: string) {
    this.id = id;
    this.cName = cName;
    this.cDescription = cDescription;
    this.categoryId = categoryId;
  }
}
