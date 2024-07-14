import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../models/add-assessment';
import { ProductService } from '../../services/add-assessment.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  arrProducts: Product[] = [];
  lastThreeProducts: Product[] = [];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe((data: Product[]) => {
      this.arrProducts = data;
      this.lastThreeProducts = this.arrProducts.slice(-3); // Get the last three products
      console.log(this.lastThreeProducts);
    });
  }

  isActive(active: string) {
    return active === 'true';
  }

  displayDetails(aid: string) {
    console.log(aid);
    this.router.navigate(['view-assessment']);
  }
}
