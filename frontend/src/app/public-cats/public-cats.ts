import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CatService, Cat } from '../services/cat';

@Component({
  selector: 'app-public-cats',
  templateUrl: './public-cats.html',
  styleUrls: ['./public-cats.css'],
  standalone: false,
})
export class PublicCatsComponent implements OnInit {
  cats: Cat[] = [];
  loading = false;
  
  filters = {
    owner: '',
    hairiness: '',
    search: '',
    ordering: '-created_at'
  };
  
  hairinessOptions = [
    { value: '', label: 'Все' },
    { value: 'bald', label: 'Лысые' },
    { value: 'fluffy', label: 'Пушистые' },
    { value: 'medium', label: 'Средние' }
  ];
  
  orderingOptions = [
    { value: '-created_at', label: 'Новые сначала' },
    { value: 'name', label: 'По имени (А-Я)' },
    { value: '-likes_count', label: 'По популярности' },
    { value: 'age', label: 'По возрасту' }
  ];
  
  private debounceTimer: any;

  constructor(
    private catService: CatService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.loading = true;
    const params: any = {};
    if (this.filters.owner) params.owner = this.filters.owner;
    if (this.filters.hairiness) params.hairiness = this.filters.hairiness;
    if (this.filters.search) params.search = this.filters.search;
    if (this.filters.ordering) params.ordering = this.filters.ordering;
    
    this.catService.getPublicCats(params).subscribe({
      next: (data) => {
        this.cats = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Ошибка загрузки котов:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange(): void {
    this.loadCats();
    this.cdr.detectChanges();
  }

  onSearchInput(): void {
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.loadCats();
      this.cdr.detectChanges();
    }, 500);
  }

  toggleLike(cat: Cat): void {
    if (cat.is_liked) {
      this.catService.unlikeCat(cat.id!).subscribe({
        next: () => {
          cat.is_liked = false;
          cat.likes_count = (cat.likes_count || 0) - 1;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка снятия лайка:', err)
      });
    } else {
      this.catService.likeCat(cat.id!).subscribe({
        next: () => {
          cat.is_liked = true;
          cat.likes_count = (cat.likes_count || 0) + 1;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка лайка:', err)
      });
    }
  }
}