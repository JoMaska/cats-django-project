import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileService, UserProfile } from '../services/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
  standalone: false,
})
export class ProfileComponent implements OnInit {
  profile: UserProfile | null = null;
  editMode = false;
  loading = false;
  saving = false;
  
  editData = {
    email: '',
    bio: '',
    website: '',
    location: ''
  };

  constructor(
    private profileService: ProfileService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (data) => {
        this.profile = data;
        this.editData = {
          email: data.email || '',
          bio: data.bio || '',
          website: data.website || '',
          location: data.location || ''
        };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки профиля:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  enableEdit(): void {
    this.editMode = true;
    this.cdr.detectChanges();
  }

  saveProfile(): void {
    this.saving = true;
    this.profileService.updateProfile(this.editData).subscribe({
      next: (data) => {
        this.profile = data;
        this.editMode = false;
        this.saving = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка сохранения:', err);
        this.saving = false;
        this.cdr.detectChanges();
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.profile) {
      this.editData = {
        email: this.profile.email || '',
        bio: this.profile.bio || '',
        website: this.profile.website || '',
        location: this.profile.location || ''
      };
    }
    this.cdr.detectChanges();
  }
}