import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { TrendingBooksService } from '../../services/trending-books.service';
import { TrendingBook } from '../../models/ITrendingBook';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';

@Component({
  selector: 'app-trending-book-list',
  templateUrl: './trending-book-list.component.html',
  styleUrls: ['./trending-book-list.component.scss']
})
export class TrendingBookListComponent implements OnInit, AfterViewChecked, OnDestroy {

  tableLoadingSpinner: boolean = true;
  subs: Subscription = new Subscription();

  trendingBooks: TrendingBook[] = [];
  selectedTrendingBook: TrendingBook | null = null;

  menuItems: MenuItem[] = [];

  constructor(
    private trendingBooksServ: TrendingBooksService,
    private messageService: MessageService,
    private ref: ChangeDetectorRef,
    private tableLoadingService: TableLoadingService,
  ) { }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.loadTrendingBooks();

    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });

    const incrementBtn = {
      label: 'Increment',
      icon: 'pi pi-fw pi-arrow-up',
      command: () => this.incrementBorrowCount(this.selectedTrendingBook!.bookId),
    };

    this.menuItems = [];
    this.menuItems.push(incrementBtn);
  }

  assignCurrentSelect(trendingBook: TrendingBook) {
    this.selectedTrendingBook = trendingBook;
  }

  loadTrendingBooks() {
    this.tableLoadingService.show();
    this.subs.add(
      this.trendingBooksServ.getAllTrendingBooks().subscribe((data) => {
        this.trendingBooks = data.data;
        this.ref.detectChanges();
        this.tableLoadingService.hide();
      })
    );
  }

  incrementBorrowCount(bookId: string) {
    this.subs.add(
      this.trendingBooksServ.incrementTrendingBook(bookId).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Borrow count incremented',
            life: 3000,
          });
          this.loadTrendingBooks();
          this.ref.detectChanges();
        },
      })
    );
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}