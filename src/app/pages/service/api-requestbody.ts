export class createEnquiry{
  enquiryId: any;
  customerName: string= '';
  customerEmail: string= '';
  customerPhone: any= '';
  message: string= '';
  categoryId: any ='';
  statusId: any ='';
  enquiryType: string= '';
  isConverted: boolean = false;
  enquiryDate: any= '';
  followUpDate: any= '';
  feedback: string= '';
}

export class createCategory{
  categoryId: any ='';
  categoryName: string = '';
  isActive: Boolean =  false;
}

export class updateCategory{
  categoryId:any='';
  categoryName: string = '';
  isActive: Boolean = false;
}