export class Assessment {
  id: number;
  imgSrc: string;
  cardTitle: string;
  cardDes: string;
  active: string;
  constructor(
    aid: number,
    aimgSrc: string,
    acardTitle: string,
    acardDes: string,
    aactive: string
  ) {
    this.id = aid;
    this.imgSrc = aimgSrc;
    this.cardTitle = acardTitle;
    this.cardDes = acardDes;
    this.active = aactive;
  }
}
