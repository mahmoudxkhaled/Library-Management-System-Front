import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { BookParams } from '../../models/BookParams';
import { ApiResult } from 'src/app/core/models/ApiResult';

interface Book {
  id: number;
  title: string;
  author: string;
  authorFullName: string;
  coverImageUrl: string;
  categoryName: string;
  availableCopies: number;
  totalCopies: number;
  description?: string;
  categoryId: number;
  authorId: number;
  publicationYear: number;
}

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss']
})
export class BooksListComponent implements OnInit {
  books: Book[] = [];
  loading: boolean = true;
  searchTerm: string = '';
  totalRecords: number = 0;
  pageSize: number = 12; // Number of books per page
  currentPage: number = 0;
  bookParams: BookParams;

  constructor(
    private booksService: BooksService,
    private router: Router
  ) {
    this.bookParams = {
      sortOrder: 1,
      sortField: 'title',
      Search: '',
      authorId: 0,
      categoryId: 0
    };
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.loading = true;
    this.booksService.getBooksPaged(this.currentPage, this.pageSize, this.bookParams).subscribe({
      next: (response: ApiResult) => {
        if (response.isSuccess) {
          this.books = response.data.result;
          this.totalRecords = response.data.totalCount;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.bookParams.Search = this.searchTerm;
    this.currentPage = 0; // Reset to first page
    this.loadBooks();
  }

  onPageChange(event: any): void {
    this.currentPage = event.first;
    this.pageSize = event.rows;
    this.loadBooks();
  }
}