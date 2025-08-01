import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BooksService } from '../../services/books.service';
import { BookParams } from '../../models/BookParams';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { ICategory } from 'src/app/modules/admin/components/categories/models/ICategory';
import { Author } from 'src/app/modules/admin/models/Author';
import { CategoryService } from 'src/app/modules/admin/components/categories/services/category.service';
import { AuthorService } from 'src/app/modules/admin/services/author.service';

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
  ActivateTrendingBooks: boolean = false;
  pageSize: number = 12; // Number of books per page
  currentPage: number = 0;
  bookParams: BookParams;
  categories: ICategory[] = [];
  authors: Author[];

  constructor(
    private booksService: BooksService,
    private categoryServ: CategoryService,
    private authorService: AuthorService,
    private router: Router
  ) {
    this.bookParams = {
      sortOrder: 1,
      sortField: 'title',
      Search: '',
      authorId: null,
      categoryId: null
    };
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadAuthors();
    this.loadBooks();
  }
  deactivateOrActivateTrendingBooks() {
        this.currentPage = 0;
    this.ActivateTrendingBooks = !this.ActivateTrendingBooks;
    this.loading = true;
    if (this.ActivateTrendingBooks) {
      console.log("GetAllTrendingBooks");
      
      this.booksService.GetAllTrendingBooks(this.currentPage, this.pageSize, this.bookParams).subscribe(response => {
        this.books = response.data.result;
        this.totalRecords = response.data.totalCount;
        this.loading = false;
      },
        (error) => {
          console.error('Error loading books:', error);
          this.loading = false;
        }
      )
    }
    else {
      console.log("getBooksPaged");
      
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
  }
  loadBooks(): void {
    this.loading = true;
    if (this.ActivateTrendingBooks) {
      this.booksService.GetAllTrendingBooks(this.currentPage, this.pageSize, this.bookParams).subscribe(response => {
        this.books = response.data.result;
        this.totalRecords = response.data.totalCount;
        this.loading = false;
      },
        (error) => {
          console.error('Error loading books:', error);
          this.loading = false;
        }
      )
    }
    else {
    this.booksService.getBooksPaged(this.currentPage, this.pageSize, this.bookParams).subscribe({
      next: (response: ApiResult) => {
        if (response.isSuccess) {
          console.log("response.data.result :", response.data.result)
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
  }

  onSearch(event: Event): void {
    this.currentPage = 0;
    this.loadBooks();
  }

  onPageChange(event: any): void {
    this.currentPage = event.first;
    this.pageSize = event.rows;
    this.loadBooks();
  }


  loadCategories() {
    this.categoryServ.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
    })
  }
  loadAuthors() {
    this.authorService.getAllAuthors().subscribe({
      next: (res) => {
        this.authors = res.data;
      },
    })
  }
}