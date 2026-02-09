import { Component, signal, Signal } from '@angular/core';
import { AllServices } from '../service/all-services';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-equiry-details',
  imports: [DatePipe, CommonModule, NgbPagination],
  templateUrl: './equiry-details.html',
  styleUrl: './equiry-details.css',
})
export class EquiryDetails {


  resData = signal<any[]>([]);
  totalRecords = signal(0);
  page = signal<any>(1);
  pageSize = signal<any>(12);


  constructor(private service: AllServices) { }

  ngOnInit() {
    this.enquiriesDetails();
  }


  enquiriesDetails() {
    this.service.getEnquiries(this.page(), this.pageSize()).subscribe(({
      next: (res: any) => {
        // alert('details fetch');
        //  this.resData.set(res.data)
        // console.log(this.resData());
        //  this.totalRecords.set(res.data.length);
        //  this.setPageData();
        this.allData.set(res.data);               // ✅ store full data
        this.totalRecords.set(res.data.length);   // ✅ total records
        this.page.set(1);                         // optional reset
        this.setPageData();
      }
    }))
  }

  allData = signal<any[]>([]);
  pagedData = signal<any[]>([]);

  setPageData() {
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();

    this.pagedData.set(
      this.allData().slice(start, end)
    );
  }

  onPageChange(page: number) {
    this.page.set(page);
    this.setPageData();
  }

}
