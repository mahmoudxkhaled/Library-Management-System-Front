import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/modules/books/services/books.service';
import { ReadBookDto } from '../../models/ReadBookDto';
import { PagedResult } from 'src/app/shared/Models/PagedResult';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { CategoryService } from 'src/app/modules/admin/components/categories/services/category.service';
import { AuthorService } from 'src/app/modules/admin/services/author.service';
import { ICategory } from 'src/app/modules/admin/components/categories/models/ICategory';
import { Author } from 'src/app/modules/admin/models/Author';
import { BookParams } from '../../models/BookParams';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss'
})
export class BooksListComponent implements OnInit {
  loading: boolean = true;
  search: string = '';
  sortFiled: string = '';
  booksResult: ApiResult
  totalRecords: number;
  categories: ICategory[] = [];
  authors: Author[];
  categoryId: number;
  authorId: number;
  reloadPage = { first: 0, rows: 10, sortField: null, sortOrder: 1 }
  bookParams: BookParams;
  constructor(private BooksService: BooksService, private categoryService: CategoryService, private authorService: AuthorService) { }
  ngOnInit() {
    this.loadBooks();
    this.loadCategories();
    this.loadAuthors();
  }
  onPageChange(event) {
    this.reloadPage.first = event.first;
    this.reloadPage.rows = event.rows;
    this.bookParams.sortOrder = this.reloadPage.sortOrder;
    this.bookParams.Search = this.search;
    this.bookParams.authorId = this.authorId;
    this.bookParams.categoryId = this.categoryId;

    this.getBooksPaged();
  }
  onAuthorChange(event: any) {
    this.bookParams.authorId = event.value;
    this.reloadPage.first = 0;
    this.reloadPage.rows = 10;
    this.getBooksPaged()
  }
  onAuthorClear() {
    this.bookParams.authorId = 0;
    this.reloadPage.first = 0;
    this.reloadPage.rows = 10;
    this.getBooksPaged()

  }
  onCategoryChange(event: any) {
    this.bookParams.categoryId = event.value;
    this.reloadPage.first = 0;
    this.reloadPage.rows = 10;
    this.getBooksPaged()
  }
  onCategoryClear() {
    this.bookParams.categoryId = 0;
    this.reloadPage.first = 0;
    this.reloadPage.rows = 10;
    this.getBooksPaged()

  }
  onFilter(event: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.search = inputValue;
    this.reloadPage.first = 0;
    this.bookParams.Search = this.search;
    this.getBooksPaged();
  }
  getBooksPaged() {
    this.BooksService.getBooksPaged(this.reloadPage.first, this.reloadPage.rows, this.bookParams).subscribe(booksResult => {
      this.booksResult = booksResult;
    }, err => {
      console.log("err", err);
    });
    this.loadAuthors();
    this.loadCategories();
  }


  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data;
      },
    })

  }
  loadAuthors() {
    this.authorService.getAllAuthors().subscribe(res => {
      this.authors = res.data;
    }, err => {

    })
  }

  loadBooks() {
    this.loading = true;
    this.bookParams = {
      sortOrder: this.reloadPage.sortOrder,
      sortField: this.reloadPage.sortField,
      Search: this.search,
      authorId: this.authorId,
      categoryId: this.categoryId
    }
    this.BooksService.getBooksPaged(this.reloadPage.first, this.reloadPage.rows, this.bookParams).subscribe({
      next: (res) => {
        this.booksResult = res;
        this.totalRecords = res.data.totalCount;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading books:', error);
        this.loading = false;
      }
    });
  }
}