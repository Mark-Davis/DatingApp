import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RolesModalComponent } from '../roles-modal/roles-modal.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[];
  modalRef: BsModalRef;

  constructor(private admin: AdminService,
    private alertify: AlertifyService,
    private modalService: BsModalService) { }

  ngOnInit() {
    this.getUsersWithRoles();
  }

  getUsersWithRoles()
  {
    this.admin.getUsersWithRoles().subscribe((users: User[]) => {
      this.users = users;
    }, error => {
      this.alertify.error(error);
    });
  }

  editRolesModal(user: User) {
    const initialState = {
      user,
      roles: this.getRoles(user)
    };

    this.modalRef = this.modalService.show(RolesModalComponent, {initialState});
    this.modalRef.content.selectedRoles.subscribe(values => {
      const rolesToUpdate = {
        roleNames: [...values.filter(e => e.checked === true).map(e => e.name)]
      }
      if (rolesToUpdate) {
        this.admin.updateUserRoles(user, rolesToUpdate).subscribe(() => {
          user.roles = [...rolesToUpdate.roleNames];
          this.alertify.success('Updated user roles');
        }, error => {
          this.alertify.error(error);
        })
      }
    });
  }

  getRoles(user) {
    const userRoles = user.roles;
    const availableRoles: any[] = [
      {name: 'Admin', value: 'Admin', checked: false},
      {name: 'Moderator', value: 'Moderator', checked: false},
      {name: 'Member', value: 'Member', checked: false},
      {name: 'VIP', value: 'VIP', checked: false}
    ];

    for (let i = 0; i < availableRoles.length; i++) {
      for (let j = 0; j < userRoles.length; j++) {
        if (availableRoles[i].name === userRoles[j]) {
          availableRoles[i].checked = true;
          break;
        }
      }
    }

    return availableRoles;
  }

}
