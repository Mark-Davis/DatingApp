import { Directive, Input, ViewContainerRef, TemplateRef, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';

@Directive({
  selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
  @Input() appHasRole: string[];

  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private authService: AuthService) { }

    ngOnInit() {
      if (this.authService.hasRole(this.appHasRole)) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      } else {
          this.viewContainerRef.clear();
       }
    }
}