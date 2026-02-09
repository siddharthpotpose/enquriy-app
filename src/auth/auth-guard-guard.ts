import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuardGuard: CanActivateFn = (route, state) => {
 const router = inject(Router)
  const loginDetails = localStorage.getItem('loginUser')
  if(loginDetails == null){
    router.navigateByUrl('/login');
    return false;
  }else{
    return true;
  }
};
