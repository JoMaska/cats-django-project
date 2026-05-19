import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatService, Cat } from '../services/cat';
import { CatFormComponent } from './cat-form/cat-form';

@Component({
  selector: 'app-cats',
  templateUrl: './cats.html',
  styleUrls: ['./cats.css'],
  standalone: false,
})
export class CatsComponent implements OnInit {
  cats: Cat[] = [];
  displayedColumns: string[] = ['name', 'age', 'breed', 'hairiness', 'actions'];

  constructor(
    private catService: CatService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.catService.getCats().subscribe({
      next: (data) => {
        this.cats = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки котов:', err);
      }
    });
  }

  openForm(cat?: Cat): void {
    const dialogRef = this.dialog.open(CatFormComponent, {
      width: '500px',
      data: cat || { name: '', age: 0, breed: '', hairiness: 'medium' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCats();
      }
    });
  }

  deleteCat(id: number): void {
    if (confirm('Удалить кота?')) {
      this.catService.deleteCat(id).subscribe({
        next: () => {
          this.loadCats();
        },
        error: (err) => {
          console.error('Ошибка удаления:', err);
        }
      });
    }
  }
}