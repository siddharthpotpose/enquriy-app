import { Component, DestroyRef, signal } from '@angular/core';
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

  resetForm() {
    this.isLoading = false;
    this.isEditMode = false;
    this.categoryForm.reset({ isActive: false });
    this.categoryDataDetails();
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




  editCategory(item: any) {
    this.isEditMode = true;
    this.categoryForm.patchValue({
      categoryId: item.categoryId,
      categoryName: item.categoryName,
      isActive: item.isActive,
    });
  }


  // deleteCategory(){
  //   this.service.deleteCateory().subscribe({
  //     next:(res:any)=>{
  //       this.alert.success(res.data.message);
  //     }
  //   })
  // }

  deleteCategory(id: number) {
    if (!confirm('Are you sure you want to delete this category?')) {
      return;
    }

    this.isLoading = true;

    this.service.deleteCateory(id).subscribe({
      next: (res: any) => {
        this.alert.success(res.message || 'Category deleted');
        this.isLoading = false;
        this.categoryDataDetails(); // refresh table
      },
      error: (err: any) => {
        this.isLoading = false;
        this.alert.error(err.error?.message || 'Delete failed');
      },
    });
  }






}
