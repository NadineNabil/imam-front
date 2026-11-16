import { inject, Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router } from "@angular/router";
import { AUTH_BUSINESS_TOKEN, IAuthBusiness } from "src/app/domain/business-contracts";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router
  ) {}
  authBusiness = inject<IAuthBusiness>(AUTH_BUSINESS_TOKEN);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const allowedRoles = route.data['roles'] as string[];
   const userRoles = this.authBusiness.getCurrentUser()?.roles ?? [];

    if (allowedRoles.some(role=>userRoles.includes(role))) {
      return true;
    }

    this.router.navigate(['']);
    return false;
  }
}