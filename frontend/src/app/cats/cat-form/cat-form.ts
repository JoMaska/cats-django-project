import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CatService, Cat } from '../../services/cat';

@Component({
  selector: 'app-cat-form',
  templateUrl: './cat-form.html',
  styleUrls: ['./cat-form.css'],
  standalone: false,
})
export class CatFormComponent {
  cat: Cat;
  hairinessOptions = [
    { value: 'bald', label: 'Лысый' },
    { value: 'fluffy', label: 'Пушистый' },
    { value: 'medium', label: 'Средний' }
  ];

  constructor(
    private dialogRef: MatDialogRef<CatFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cat,
    private catService: CatService
  ) {
    this.cat = { ...data };
  }

  save(): void {
    if (this.cat.id) {
      this.catService.updateCat(this.cat.id, this.cat).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Ошибка обновления:', err)
      });
    } else {
      this.catService.createCat(this.cat).subscribe({
        next: () => this.dialogRef.close(true),
        error: (err) => console.error('Ошибка создания:', err)
      });
    }
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}