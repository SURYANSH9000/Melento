export class Address {
  houseNo: string;
  street: string;
  area: string;
  state: string;
  country: string;
  pincode: string;

  constructor(
    houseNo: string,
    street: string,
    area: string,
    state: string,
    country: string,
    pincode: string
  ) {
    this.houseNo = houseNo;
    this.street = street;
    this.area = area;
    this.state = state;
    this.country = country;
    this.pincode = pincode;
  }
}
