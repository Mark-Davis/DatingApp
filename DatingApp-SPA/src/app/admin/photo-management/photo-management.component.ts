import { Component, OnInit } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { AdminService } from 'src/app/_services/admin.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-photo-management',
  templateUrl: './photo-management.component.html',
  styleUrls: ['./photo-management.component.css']
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[];

  constructor(
    private admin: AdminService,
    private alertify: AlertifyService,
    private userService: UserService) { }

  ngOnInit() {
    this.getPhotosForModeration();
  }

  getPhotosForModeration() {
    this.admin.getPhotosForModeration().subscribe((photos: Photo[]) => {
      this.photos = photos;
    }, error => {
      this.alertify.error(error);
    });
  }

  approvePhoto(id: number) {
    this.admin.approvePhoto(id).subscribe( () => {
      const index = this.photos.findIndex(p => p.id === id);
      this.photos.splice(index, 1);
      this.alertify.success('Photo has been approved');
    });
  }

  rejectPhoto(id: number) {
    this.admin.rejectPhoto(id).subscribe( () => {
      const index = this.photos.findIndex(p => p.id === id);
      this.photos.splice(index, 1);
      this.alertify.success('Photo has been rejected');
    });
  }
}
