import { Component, DestroyRef, computed, signal } from '@angular/core';
import { AllServices } from '../service/all-services';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AlertService } from '../../share/alert/alert.service';
import { createCategory, updateCategory } from '../service/api-requestbody';
import { validate } from '@angular/forms/signals';

@Component({
  selector: 'app-enquiry-category',
  imports: [ReactiveFormsModule, CommonModule],
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

  // Computed values for footer stats
  activeCount = computed(() => {
    return this.categoryDataRes().filter(item => item.isActive === true).length;
  });

  inactiveCount = computed(() => {
    return this.categoryDataRes().filter(item => item.isActive === false).length;
  });



  constructor(private service: AllServices, private alert: AlertService, private destroyRef: DestroyRef) { }


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

  resetForm() {
    this.isLoading = false;
    this.isEditMode = false;
    this.showForm.set(false);
    this.categoryForm.reset({ isActive: false });
    this.categoryDataDetails();
  }

  editCategory(item: any) {
    this.isEditMode = true;
    this.showForm.set(true);
    this.categoryForm.patchValue({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      isActive: item.isActive
    });
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
        this.categoryDataRes.set(res.data);
        console.log(this.categoryDataRes);
      }, error(err) {
        alert(err.error.message);
      },
    })
  }

}