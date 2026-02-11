import { Component, signal, Signal } from '@angular/core';
import { AllServices } from '../service/all-services';
import { CommonModule, DatePipe } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../share/alert/alert.service';

@Component({
  selector: 'app-equiry-details',
  imports: [DatePipe, CommonModule, NgbPagination],
  templateUrl: './equiry-details.html',
  styleUrl: './equiry-details.css',
})
export class EquiryDetails {

  // Loading and error states
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  
  resData = signal<any[]>([]);
  totalRecords = signal(0);
  page = signal<any>(1);
  pageSize = signal<any>(12);


  constructor(private service: AllServices, private alertService :  AlertService) { }

  ngOnInit() {
    this.enquiriesDetails();
  }


  enquiriesDetails() {
    this.isLoading.set(true);
    this.errorMessage.set('');
    
    this.service.getEnquiries(this.page(), this.pageSize()).subscribe({
      next: (res: any) => {
        console.log('Enquiry API Response:', res);
        this.alertService.success(res.message);
        this.isLoading.set(false);
        
        if (res && res.data) {
          this.allData.set(res.data || []);
          this.totalRecords.set((res.data || []).length);
          this.page.set(1);
          this.setPageData();
        } else {
          this.errorMessage.set('No data available');
          this.allData.set([]);
          this.pagedData.set([]);
          this.totalRecords.set(0);
        }
      },
      error: (err: any) => {
        console.error('Enquiry API Error:', err);
        this.isLoading.set(false);
        this.alertService.error(err.message);
        this.errorMessage.set(err.message || 'Failed to load enquiry details');
        this.allData.set([]);
        this.pagedData.set([]);
        this.totalRecords.set(0);
      }
    });
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

  // Method to retry loading data
  retryLoad() {
    this.enquiriesDetails();
  }

}
