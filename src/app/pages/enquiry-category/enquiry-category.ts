import { Component, DestroyRef, computed, signal, ChangeDetectorRef } from '@angular/core';
import { AllServices } from '../service/all-services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '../../share/alert/alert.service';
import { createCategory, updateCategory } from '../service/api-requestbody';
import { validate } from '@angular/forms/signals';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-enquiry-category',
  imports: [ReactiveFormsModule, CommonModule, NgbPagination, FormsModule],
  templateUrl: './enquiry-category.html',
  styleUrl: './enquiry-category.css',
})
export class EnquiryCategory {

  updateCategory = new updateCategory();

  categoryDataRes = signal<any[]>([]);
  isEditMode: Boolean = false;
  isLoading: boolean = false;
  categoryObj = new createCategory();
  
  // Form visibility control
  showForm = signal<boolean>(false);

  // Delete Modal State
  showDeleteModal = signal<boolean>(false);
  selectedCategoryId = signal<number | null>(null);
  deleteRemark = signal<string>('');

  // Filter state
  statusFilter = signal<'all' | 'active' | 'inactive'>('all');

  // Search term
  searchTerm = signal<string>('');

  // Filtered data based on status filter and search term
  filteredData = computed(() => {
    const filter = this.statusFilter();
    const search = this.searchTerm().toLowerCase().trim();
    const data = this.categoryDataRes();
    
    let filtered = data;
    
    if (filter === 'active') {
      filtered = data.filter(item => item.isActive === true);
    } else if (filter === 'inactive') {
      filtered = data.filter(item => item.isActive === false);
    }
    
    // Apply search filter
    if (search) {
      filtered = filtered.filter(item => 
        item.categoryName.toLowerCase().includes(search)
      );
    }
    
    return filtered;
  });

  // Computed values for footer stats
  activeCount = computed(() => {
    return this.categoryDataRes().filter(item => item.isActive === true).length;
  });

  inactiveCount = computed(() => {
    return this.categoryDataRes().filter(item => item.isActive === false).length;
  });

  // Method to get page start (alternative approach)
  getPageStart(): number {
    const total = this.totalRecords();
    if (total === 0) return 0;
    return (this.page() - 1) * this.pageSize() + 1;
  }

  // Method to get page end
  getPageEnd(): number {
    return Math.min(this.page() * this.pageSize(), this.totalRecords());
  }



  constructor(private service: AllServices, private alert: AlertService, private destroyRef: DestroyRef, 
    private cdr: ChangeDetectorRef) { }


  ngOnInit() {
    this.categoryDataDetails();
  }


  categoryForm = new FormGroup({
    categoryId: new FormControl(0),
    categoryName: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
    isActive: new FormControl(false)
  })


  submitForm() {
    if (this.categoryForm.invalid) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    const formData = this.categoryForm.value;
    this.isLoading = true;

    if (this.isEditMode) {
      // 🔄 UPDATE
      this.service
        .updateCategoryData(formData.categoryId, formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: any) => {
            this.alert.success(res.message || 'Category updated');
            this.resetForm();
            this.categoryDataDetails();
          },
          error: (err) => {
            this.isLoading = false;
            this.alert.error(err.error?.message || 'Update failed');
          },
        });
    } else {
      // ➕ CREATE
      this.service
        .createCategory(formData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (res: any) => {
            this.alert.success(res.message || 'Category created');
            this.resetForm();
            this.categoryDataDetails();
          },
          error: (err) => {
            this.isLoading = false;
            this.alert.error(err.error?.message || 'Create failed');
          },
        });
    }
  }

  toggleForm() {
    this.showForm.update(value => !value);
  }

  closeForm() {
    this.isLoading = false;
    this.isEditMode = false;
    this.showForm.set(false);
    this.categoryForm.reset({ isActive: false });
    this.categoryDataDetails();
  }

  resetForm() {
    this.isLoading = false;
    this.categoryForm.reset({ isActive: this.categoryForm.get('isActive')?.value || false });
  }

  editCategory(item: any) {
    this.isEditMode = true;
    this.showForm.set(true);
    this.categoryForm.patchValue({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      isActive: item.isActive
    });
    
    // Scroll to form section after data is set
    setTimeout(() => {
      const formSection = document.getElementById('categoryFormSection');
      if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  openDeleteModal(categoryId: number) {
    this.selectedCategoryId.set(categoryId);
    this.deleteRemark.set('');
    this.showDeleteModal.set(true);
  }

  closeDeleteModal() {
    this.showDeleteModal.set(false);
    this.selectedCategoryId.set(null);
    this.deleteRemark.set('');
  }

  confirmDelete() {
    const categoryId = this.selectedCategoryId();
    if (categoryId) {
      const remark = this.deleteRemark() || undefined;
      this.service.deleteCateory(categoryId, remark).subscribe({
        next: (res: any) => {
          this.alert.success(res.message || 'Category deleted');
          this.closeDeleteModal();
          this.categoryDataDetails();
        },
        error: (err: any) => {
          this.alert.error(err.error?.message || 'Delete failed');
          this.closeDeleteModal();
        }
      });
    }
  }

  categoryDataDetails() {
    this.service.getCategoryData().subscribe({
      next: (res: any) => {
        // this.alert.success(res.message);
        this.categoryDataRes.set(res.data || []);
        this.setPageData();
        console.log(this.categoryDataRes);
      },
      error: (err: any) => {
        this.alert.error(err.error?.message || 'Failed to load categories');
      },
    })
  }

  // Set status filter
  setStatusFilter(filter: 'all' | 'active' | 'inactive') {
    this.statusFilter.set(filter);
    this.page.set(1); // Reset to first page when filter changes
    this.setPageData();
    this.cdr.markForCheck();
  }

  // Search methods
  setSearchTerm(term: string) {
    this.searchTerm.set(term);
    this.page.set(1); // Reset to first page when search changes
    this.setPageData();
    this.cdr.markForCheck();
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
    this.pageSize.set(10);
    this.page.set(1);
    this.setStatusFilter('all');
    this.categoryDataDetails();
    this.cdr.markForCheck();
  }

  // Set page size
  setPageSize(size: number) {
    this.pageSize.set(size);
    this.page.set(1); // Reset to first page when page size changes
    this.setPageData();
    this.cdr.markForCheck();
  }

  totalRecords = signal(0);
  page = signal<number>(1);
  pageSize = signal<number>(10);

  // Get filtered total records
  getFilteredTotalRecords(): number {
    return this.filteredData().length;
  }

  pagedData = signal<any[]>([]);

  setPageData() {
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();

    this.pagedData.set(
      this.filteredData().slice(start, end)
    );
    this.totalRecords.set(this.filteredData().length);
  }

  onPageChange(page: number) {
    this.page.set(page);
    this.setPageData();
    this.cdr.markForCheck();
  }

  // Method to retry loading data
  retryLoad() {
    this.categoryDataDetails();
  }

}
