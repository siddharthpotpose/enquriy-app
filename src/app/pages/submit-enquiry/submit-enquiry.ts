import { Component, DestroyRef, signal, Signal } from '@angular/core';
import { AllServices } from '../service/all-services';
import { createEnquiry } from '../service/api-requestbody';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { commonImport } from '../../../global.constant';
import { maxLength } from '@angular/forms/signals';

@Component({
  selector: 'app-submit-enquiry',
  imports: [commonImport],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})
export class SubmitEnquiry {

  category = signal<any[]>([]);
  status = signal<any[]>([]);

  EnquiryObj = new createEnquiry()

  constructor(private service: AllServices, private destroyRef : DestroyRef) {
     this.destroyRef.onDestroy(() => {
      console.log('Component destroyed 🚨');
    });
   }

  ngOnInit() {
    this.getCategory();
    this.getStatus();
  }

  enquiryForm = new FormGroup({
    enquiryId: new FormControl(0),
    customerName: new FormControl('',[ Validators.required,Validators.minLength(5),Validators.maxLength(50)]),
    customerEmail: new FormControl('', Validators.required),
    customerPhone: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    statusId: new FormControl('', Validators.required),
    enquiryType: new FormControl('', Validators.required),
    isConverted: new FormControl('', Validators.required),
    enquiryDate: new FormControl('', Validators.required),
    followUpDate: new FormControl('', Validators.required),
    feedback: new FormControl('')
  })


  getCategory() {
    this.service.getAllCategory().pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res: any) => {
        this.category.set(res.data);
        console.log(this.category);
      }
    })
  }

  getStatus() {
    this.service.getAllStatus().pipe(takeUntilDestroyed(this.destroyRef))
    .subscribe({
      next: (res: any) => {
        this.status.set(res.data);
        console.log(this.status);
      }
    })
  }


  submitForm(){
    if(this.enquiryForm.invalid){
          this.enquiryForm.markAllAsTouched();
          return;
    }

    const formData = this.enquiryForm.value;
     delete formData.enquiryId;

    this.service.createEnquiry(formData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next:(res:any)=>{
        console.log(res,'formData');
           alert('successfully saved');
           this.enquiryForm.reset();
      },error(err) {
        alert(err.error.message);
      },
    })
  }

}
