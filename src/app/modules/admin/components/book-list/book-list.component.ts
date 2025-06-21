import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MenuItem, MessageService } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { IBook } from '../../models/IBook';
import { BookService } from '../../services/book.service';
import { ICategory } from '../categories/models/ICategory';
import { CategoryService } from '../categories/services/category.service';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';
import { AuthorService } from '../../services/author.service';
import { Author } from '../../models/Author';
import { BooksService } from 'src/app/modules/books/services/books.service';
import { BookParams } from 'src/app/modules/books/models/BookParams';
import { SelectedFilter } from '../../models/SelectedFilters';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterViewChecked, OnDestroy {

  layout: string = 'list';
  sortField: string = 'publicationYear';
  sortOptions: any[] = [
    { label: 'Publication Year: Newest First', value: '!publicationYear' },
    { label: 'Publication Year: Oldest First', value: 'publicationYear' }
  ];
  tableLoadingSpinner: boolean = true;
  subs: Subscription = new Subscription();
  editBookDialog: boolean = false;
  bookDialog: boolean = false;
  deletionBookDialog: boolean = false;
  switchActivationBookDialog: boolean = false;
  submitted: boolean = false;
  books: IBook[] = [];
  search: string = '';
  categories: ICategory[] = [];
  selectedCategoryId: string = '';
  book: IBook;
  bookForm: FormGroup;
  editBookForm: FormGroup;
  selectedBookImage: File | null = null;
  imageUrl: string = '../../../../../assets/media/upload-photo.jpg';
  menuItems: MenuItem[] = [];
  authors: Author[];
  totalRecords: number;
  categoryId: number;
  authorId: number;
  reloadPage = { first: 0, rows: 10, sortField: null, sortOrder: 1 }
  sortOrder: number = -1
  bookParams: BookParams;
  filteredBooks: IBook[] = [];
  selectedBook: IBook | null = null;
  loading: boolean = true;
  isEditing: boolean = false;
  searchTerm: string = '';
  selectedFilters: SelectedFilter[]
  excelColumns: SelectedFilter[] = [{ name: "Title" }, { name: "Description" }, { name: "PublicationYear" }, { name: "AvailableCopies" }, { name: "TotalCopies" }, { name: "Category" }, { name: "Author" }]
  constructor(
    private bookServ: BookService, private bookService: BooksService,
    private categoryServ: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private tableLoadingService: TableLoadingService,
    private authorService: AuthorService
  ) {
    this.selectedFilters = this.excelColumns;
    this.initBookModelAndForm();
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.loadCategories();
    this.loadAuthors();
    this.bookParams = { sortField: null, sortOrder: 1, authorId: 0, categoryId: 0, Search: '' }
    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });

    this.menuItems = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editBook(this.selectedBook) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.confirmDeleteBook(this.selectedBook) }
    ];

    this.loadBooks({
      first: 0,
      rows: 9,
      sortField: null,
      sortOrder: 1
    });
  }

  assignCurrentSelect(book: IBook) {
    this.selectedBook = book;
  }
  loadBooks(event: any) {
    this.reloadPage.first = event.first;
    this.reloadPage.rows = event.rows;
    this.bookParams.sortOrder = this.reloadPage.sortOrder;
    this.bookParams.authorId = this.authorId;
    this.bookParams.categoryId = this.categoryId;
    this.tableLoadingService.show();

    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });

    this.subs.add(
      this.bookService.getBooksPaged(event.first, event.rows, this.bookParams).pipe(finalize(() => this.loading = false)).subscribe((res) => {
        this.books = res.data.result;
        this.totalRecords = res.data.totalCount;
        this.loading = false;
        this.tableLoadingService.hide();
        this.filteredBooks = this.books;
      })
    );
  }
  ExportToExcel() {    
    if (this.selectedFilters === undefined || this.selectedFilters.length==0) {
      this.messageService.add({
        severity: 'error',
        summary: 'Export Requirements',
        detail: 'Please select at least one filter from the dropdown before exporting to Excel.',
        life: 3000,
      });
      return;
    }
    this.bookService.ExportToExcel(this.selectedFilters).subscribe(res => {
      this.bookService.downLoadFile(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "BookRecords.xlsx");
    }, err => {

    }
    )
  }
  loadCategories() {
    this.subs.add(
      this.categoryServ.getAllCategories().subscribe({
        next: (res) => {
          this.categories = res.data;
        },
      })
    );
  }
  loadAuthors() {
    this.authorService.getAllAuthors().subscribe(res => {
      this.authors = res.data;
      console.log("this.authors :", this.authors)
    }, err => {

    })
  }
  //#region Add Book
  addBook() {
    this.initBookModelAndForm();
    this.imageUrl = '../../../../../assets/media/upload-photo.jpg';
    this.selectedBookImage = null;
    this.bookDialog = true;
  }
  saveBook() {
    this.submitted = true;
    if (this.bookForm.valid) {
      const formData = new FormData();
      formData.append('Title', this.bookForm.value.title);
      formData.append('Description', this.bookForm.value.description);
      formData.append('AuthorId', this.bookForm.value.authorId);
      formData.append('PublicationYear', this.bookForm.value.publicationYear);
      formData.append('AvailableCopies', this.bookForm.value.availableCopies);
      formData.append('TotalCopies', this.bookForm.value.totalCopies);
      formData.append('CategoryId', this.bookForm.value.categoryId);
      formData.append('isActive', this.bookForm.value.isActive);
      const bookImageFile = this.selectedBookImage;
      if (bookImageFile) {
        formData.append('ImageUrl', bookImageFile, bookImageFile.name);
      }

      if (this.isEditing) {
        // If editing, update book
        formData.append('Id', this.selectedBook!.id);
        this.subs.add(
          this.bookServ.updateBook(formData).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Book Updated',
                life: 3000,
              });
              this.loadBooks(this.reloadPage);
              this.ref.detectChanges();
              this.initBookModelAndForm();
              this.bookDialog = false;
              this.isEditing = false;
            },
          })
        );
      } else {
        // If adding new book
        this.subs.add(
          this.bookServ.addBook(formData).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Book Added',
                life: 3000,
              });
              this.loadBooks(this.reloadPage);
              this.ref.detectChanges();
              this.initBookModelAndForm();
              this.bookDialog = false;
            },
          })
        );
      }
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill all fields please',
        life: 3000,
      });
    }
  }

  declineAddBookDialog() {
    this.submitted = false;
    this.initBookModelAndForm();
    this.bookDialog = false;
    this.isEditing = false;
  }
  //#endregion

  //#region Edit Book
  editBook(book: IBook) {
    this.isEditing = true;
    this.selectedBook = { ...book };
    this.imageUrl = book.coverImageUrl ? book.coverImageUrl : 'assets/dummy_book_cover.webp';
    this.bookForm.patchValue({
      id: book.id,
      title: book.title,
      description: book.description,
      authorId: book.authorId,
      publicationYear: book.publicationYear,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies,
      categoryId: book.categoryId,
      imageUrl: book.coverImageUrl,
      isActive: book.isActive,
    });

    this.bookDialog = true;
  }
  confirmDeleteBook(book: IBook) {
    this.selectedBook = book;
    this.deletionBookDialog = true;
  }

  confirmDeletion() {
    this.deletionBookDialog = false;
    this.subs.add(
      this.bookServ.deleteBook(this.selectedBook!.id).subscribe({
        next: (response: ApiResult) => {
          if (response.code !== 406) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: 'Book Deleted Successfully ',
              life: 3000,
            });
            this.loadBooks(this.reloadPage);
            this.ref.detectChanges();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Cannot delete because there are transactions associated with this book',
              life: 5000,
            });
            this.ref.detectChanges();
          }
        },
      })
    );
    this.initBookModelAndForm();
    this.deletionBookDialog = false;
  }

  declineDeletion() {
    this.deletionBookDialog = false;
    this.initBookModelAndForm();
  }
  //#endregion

  initBookModelAndForm() {
    this.book = {
      id: '',
      title: '',
      description: '',
      authorId: null,
      authorName: '',
      coverImageUrl: '',
      publicationYear: 0,
      availableCopies: 0,
      totalCopies: 0,
      categoryId: '',
      category: undefined,
      transactions: [],
      feedbacks: [],
      isActive: false,
    };

    this.bookForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      authorId: [null, Validators.required],
      publicationYear: [0, Validators.required],
      availableCopies: [0, Validators.required],
      totalCopies: [0, Validators.required],
      categoryId: ['', Validators.required],
      imageUrl: [''],
      isActive: [true],
    });
  }

  triggerImageUpload() {
    const fileInput = document.getElementById('bookCoverImage') as HTMLInputElement;
    fileInput.click();
  }

  handleImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedBookImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.ref.detectChanges();
      };
      reader.readAsDataURL(this.selectedBookImage);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  onSortChange(event: any) {
    const value = event.value;
    if (value.indexOf('!') === 0) {
      this.sortOrder = -1;
      this.sortField = value.substring(1);
    } else {
      this.sortOrder = 1;
      this.sortField = value;
    }
  }
  filterValue: string = '';
  onFilter(event: Event) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.search = inputValue;
    this.reloadPage.first = 0;
    this.loadBooks(this.reloadPage);
  }

  onSearch() {
    this.reloadPage.first = 0;
    this.reloadPage.rows = 9;
    this.loadBooks(this.reloadPage);
  }

  showAddBookDialog() {
    this.isEditing = false;
    this.selectedBook = null;
    this.bookForm.reset({
      availableCopies: 1,
      totalCopies: 1,
      isActive: true
    });
    this.imageUrl = 'assets/dummy_book_cover.webp';
    this.submitted = false;
    this.bookDialog = true;
  }

  hideDialog() {
    this.bookDialog = false;
    this.submitted = false;
  }

  getAuthorName(authorId: number): string {
    const author = this.authors?.find(a => a.id === authorId);
    return author ? author.fullName : '';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories?.find(c => c.id === categoryId);
    return category ? category.name : '';
  }
}