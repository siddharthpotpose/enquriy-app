import { ChangeDetectorRef, Component, computed, signal, Signal } from '@angular/core';
import { AllServices } from '../service/all-services';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { AlertService } from '../../share/alert/alert.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';


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
 private searchSubject = new Subject<string>();


  resData = signal<any[]>([]);
  totalRecords = signal(0);
  isConvertedT = signal<any>(0);
  isConvertedF = signal<any>(0);
  page = signal<any>(1);
  pageSize = signal<any>(12);


  constructor(private service: AllServices, private alertService: AlertService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.enquiriesDetails();

  this.searchSubject.pipe(
    debounceTime(400),
    distinctUntilChanged()
  ).subscribe(term => {
    this.searchTerm.set(term.trim());
    this.page.set(1);
    this.setPageData();
  });
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
    isConverted: new FormControl('', [Validators.required]),
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
          // this.isConvertedT.set((res.data.isConverted == true || []).length );
          // this.isConvertedF.set((res.data.isConverted == false || []).length);
          this.isConvertedT.set(res.data.filter((item: any) => item.isConverted == true).length);
          this.isConvertedF.set(res.data.filter((item: any) => item.isConverted == false).length);
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
      isConverted: item.isConverted || '',
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
      this.filterData().slice(start, end)
    );
    this.totalRecords.set(this.filterData().length);

  }



  onPageChange(page: number) {
    this.page.set(page);
    this.setPageData();
  }

  // Method to retry loading data
  retryLoad() {
    this.enquiriesDetails();
  }


  searchTerm = signal<string>('');
  convertedFilter = signal<'all' | 'isConvertedT' | 'isConvertedF'>('all')

  filterData = computed(() => {
    const search = this.searchTerm().toLowerCase().trim();
    const filter = this.convertedFilter();

    const data = this.allData();

    let filtered = data;


    if (filter == 'isConvertedT') {
      filtered = data.filter(item => item.isConverted == true)
    } else if (filter == 'isConvertedF') {
      filtered = data.filter(item => item.isConverted == false)
    }

    // if (search) {
    //   filtered = filtered.filter(item => item.categoryName.toLowerCase().includes(search))
    // }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item =>
        item?.customerName?.toLowerCase()?.includes(searchLower)
      );
    }


    return filtered;

  })


  // Set status filter
  setStatusFilter(filter: 'all' | 'isConvertedT' | 'isConvertedF') {
    this.isLoading.set(true);
    setTimeout(() => {
      this.convertedFilter.set(filter);
      this.page.set(1); // Reset to first page when filter changes
      this.setPageData();
      this.cdr.markForCheck();
      this.isLoading.set(false)
    }, 300);
  }

  // Search methods
  setSearchTerm(term: string) {
    this.searchSubject.next(term);

      // this.searchTerm.set(term);
      // this.page.set(1); // Reset to first page when search changes
      // this.setPageData();
      // this.cdr.markForCheck();
  

  }

  clearSearch() {
    this.searchTerm.set('');
    this.page.set(1);
    this.setPageData();
    this.cdr.markForCheck();
  }

  // Refresh/Reset all filters
  refreshData() {
    this.searchTerm.set('');
    this.pageSize.set(12);
    this.page.set(1);
    this.allData
    this.setStatusFilter('all');
    this.enquiriesDetails();
    this.cdr.markForCheck();
  }

  // Set page size
  setPageSize(size: number) {
    this.isLoading.set(true);
    setTimeout(() => {
      this.pageSize.set(size);
      this.page.set(1); // Reset to first page when page size changes
      this.setPageData();
      this.cdr.markForCheck();
      this.isLoading.set(false);
    }, 300);
  }


  deleteRemark = signal<string>('');
  showDeleteModal = signal<boolean>(false);


  openDeleteModal(categoryId: number) {
    this.editingEnquiry.set(categoryId);
    this.deleteRemark.set('');
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.editingEnquiry.set(null);
    this.deleteRemark.set('');
  }

  confirmDelete() {
    const categoryId = this.editingEnquiry();
    if (categoryId) {
      const remark = this.deleteRemark() || undefined;
      this.service.deleteEnquiry(categoryId,remark).subscribe({
        next: (res: any) => {
          this.alertService.success(res.message || 'Category deleted');
          this.closeDeleteModal();
          this.enquiriesDetails();
        },
        error: (err: any) => {
          this.alertService.error(err.error?.message || 'Delete failed');
          this.closeDeleteModal();
        }
      });
    }
  }



}
