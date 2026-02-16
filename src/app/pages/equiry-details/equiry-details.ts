import { Component, signal, Signal } from '@angular/core';
import { AllServices } from '../service/all-services';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../share/alert/alert.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-equiry-details',
  imports: [DatePipe, CommonModule, NgbPagination, FormsModule, ReactiveFormsModule],
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


  constructor(private service: AllServices, private alertService: AlertService) { }

  ngOnInit() {
    this.enquiriesDetails();

  }

  categoryResData = signal<any[]>([])
  getCategoryList() {
    this.service.getAllCategory().subscribe({
      next: (res: any) => {
        this.categoryResData.set(res.data)
      }
    })
  }

  statusResData = signal<any[]>([])

  getStatus() {
    this.service.getAllStatus().subscribe({
      next: (res: any) => {
        this.statusResData.set(res.data);
      }
    })
  }


  editEnquiryForm = new FormGroup({
    enquiryId: new FormControl(''),
    customerName: new FormControl('', [Validators.required]),
    customerEmail: new FormControl('', [Validators.required, Validators.email]),
    customerPhone: new FormControl('', [Validators.required]),
    enquiryType: new FormControl(null, [Validators.required]),
    categoryId: new FormControl('', [Validators.required]),
    statusId: new FormControl('', [Validators.required]),
    enquiryDate: new FormControl('', [Validators.required]),
    followUpDate: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required])
  })



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

  // updateEnquiry(item: any) {
  //   this.service.updateEnquiry(item, id).subscribe({
  //     next: (res: any) => {
  //       const resData = res.data;
  //       console.log(resData);
  //       this.alertService.success(res.message || 'Successully updatd')
  //     }
  //   })
  // }

  editEnquiry(item: any) {
    this.getCategoryList();
    this.getStatus();
    this.isEditing.set(true);
    this.isLoading.set(true);
    const formatDate = (date: string) => {
      return date ? date.split('T')[0] : '';
    };
    this.editEnquiryForm.patchValue({
      enquiryId: item.enquiryId,
      customerName: item.customerName || '',
      customerEmail: item.customerEmail || '',
      customerPhone: item.customerPhone || '',
      enquiryType: item.enquiryType || '',
      categoryId: item.categoryId || '',
      statusId: item.statusId || '',
      enquiryDate: formatDate(item.enquiryDate || ''),
      followUpDate: formatDate(item.followUpDate || ''),
      message: item.message || ''
    });
    // If item has full details, set directly
    if (item && item.id) {
      // Optionally fetch by ID if more details needed
      this.service.getEnquiryById(item.id).subscribe({
        next: (res: any) => {
          this.editingEnquiry.set(res.data || item);
          this.isLoading.set(false);
        },
        error: (err: any) => {
          this.alertService.error(err.message || 'Failed to fetch enquiry details');
          this.isLoading.set(false);
        }
      });
    } else {
      this.editingEnquiry.set(item);
      this.isLoading.set(false);
    }
  }

  editingEnquiry = signal<any | null>(null);
  isEditing = signal<boolean>(false);

  // Call this to update enquiry
  submitUpdate() {

    if (this.editEnquiryForm.invalid) return;

    const enquiry = this.editingEnquiry();

    console.log("Editing enquiry:", enquiry); // Debug

    if (!enquiry?.enquiryId) {
      console.log("enquiryId missing!");
      return;
    }

    const updatedData = this.editEnquiryForm.value;

    this.isLoading.set(true);

    this.service.updateEnquiry(updatedData, enquiry.enquiryId).subscribe({
      next: (res: any) => {
        this.alertService.success(res.message || 'Successfully updated');
        this.isEditing.set(false);
        this.editingEnquiry.set(null);
        this.enquiriesDetails();
        this.isLoading.set(false);
      },
      error: (err: any) => {
        this.alertService.error(err.message || 'Update failed');
        this.isLoading.set(false);
      }
    });
  }


  // Cancel editing
  cancelEdit() {
    this.isEditing.set(false);
    this.editingEnquiry.set(null);
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
