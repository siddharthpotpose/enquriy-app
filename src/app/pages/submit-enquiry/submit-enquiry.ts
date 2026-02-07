import { Component, signal, Signal } from '@angular/core';
import { AllServices } from '../service/all-services';
import { createEnquiry } from '../service/api-requestbody';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-submit-enquiry',
  imports: [ReactiveFormsModule],
  templateUrl: './submit-enquiry.html',
  styleUrl: './submit-enquiry.css',
})
export class SubmitEnquiry {

  category = signal<any[]>([]);
  status = signal<any[]>([]);

  EnquiryObj = new createEnquiry()

  constructor(private service: AllServices) { }

  ngOnInit() {
    this.getCategory();
    this.getStatus();
  }

  enquiryForm = new FormGroup({
    enquiryId: new FormControl(0),
    customerName: new FormControl('', Validators.required),
    customerEmail: new FormControl('', Validators.required),
    customerPhone: new FormControl('', Validators.required),
    message: new FormControl('', Validators.required),
    categoryId: new FormControl('', Validators.required),
    statusId: new FormControl('', Validators.required),
    enquiryType: new FormControl('', Validators.required),
    isConverted: new FormControl('', Validators.required),
    enquiryDate: new FormControl('', Validators.required),
    followUpDate: new FormControl('', Validators.required),
    feedback: new FormControl('', Validators.required)
  })


  getCategory() {
    this.service.getAllCategory().subscribe({
      next: (res: any) => {
        this.category.set(res.data);
        console.log(this.category);
      }
    })
  }

  getStatus() {
    this.service.getAllStatus().subscribe({
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

    this.service.createEnquiry(formData).subscribe({
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
