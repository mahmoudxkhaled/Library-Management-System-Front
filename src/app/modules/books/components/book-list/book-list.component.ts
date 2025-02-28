import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { IBook } from '../../models/IBook';
import { BookService } from '../../services/book.service';
import { ICategory } from 'src/app/modules/categories/models/ICategory';
import { CategoryService } from 'src/app/modules/categories/services/category.service';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { TableLoadingService } from 'src/app/core/Services/table-loading.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss']
})
export class BookListComponent implements OnInit, AfterViewChecked, OnDestroy {

  layout: string = 'list';
  sortField: string = 'publicationYear';
  sortOrder: number = 1;
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
  categories: ICategory[] = [];
  selectedCategoryId: string = '';

  book: IBook;
  selectedBook: IBook | null = null;

  addBookForm: FormGroup;
  editBookForm: FormGroup;

  selectedBookImage: File | null = null;
  imageUrl: string = '../../../../../assets/media/upload-photo.jpg';

  menuItems: MenuItem[] = [];

  constructor(
    private bookServ: BookService,
    private categoryServ: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private ref: ChangeDetectorRef,
    private tableLoadingService: TableLoadingService,
  ) {
    this.initBookModelAndForm();
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.loadBooks();
    this.loadCategories();

    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });



    this.menuItems = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editBook(this.book) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteBook(this.book) }
    ];
  }

  assignCurrentSelect(book: IBook) {
    this.book = book;
  }

  loadBooks() {
    this.tableLoadingService.show();
    this.subs.add(
      this.bookServ.getAllBooks().subscribe((data) => {
        this.books = data.data;
        console.log(this.books)
        this.ref.detectChanges();
        this.tableLoadingService.hide();
      })
    );
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

  //#region Add Book
  addBook() {
    this.initBookModelAndForm();
    this.imageUrl = '../../../../../assets/media/upload-photo.jpg';
    this.selectedBookImage = null;
    this.bookDialog = true;
  }
  saveBook() {
    this.submitted = true;
    if (this.addBookForm.valid) {
      const formData = new FormData();
      formData.append('Title', this.addBookForm.value.title);
      formData.append('Description', this.addBookForm.value.description);
      formData.append('Author', this.addBookForm.value.author);
      formData.append('PublicationYear', this.addBookForm.value.publicationYear);
      formData.append('AvailableCopies', this.addBookForm.value.availableCopies);
      formData.append('TotalCopies', this.addBookForm.value.totalCopies);
      formData.append('CategoryId', this.addBookForm.value.categoryId);
      formData.append('isActive', this.addBookForm.value.isActive);

      const bookImageFile = this.selectedBookImage;
      if (bookImageFile) {
        formData.append('ImageUrl', bookImageFile, bookImageFile.name);
      }

      if (this.isEditing) {
        // If editing, update book
        formData.append('Id', this.book.id);
        this.subs.add(
          this.bookServ.updateBook(formData).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Successful',
                detail: 'Book Updated',
                life: 3000,
              });
              this.loadBooks();
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
              this.loadBooks();
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

  isEditing: boolean = false;

  editBook(book: IBook) {
    this.isEditing = true;
    this.book = { ...book };
    this.imageUrl = book.imageUrl ? book.imageUrl : '../../../../../assets/media/upload-photo.jpg';

    this.addBookForm.patchValue({
      id: book.id,
      title: book.title,
      description: book.description,
      author: book.author,
      publicationYear: book.publicationYear,
      availableCopies: book.availableCopies,
      totalCopies: book.totalCopies,
      categoryId: book.categoryId,
      imageUrl: book.imageUrl,
      isActive: book.isActive,
    });

    this.bookDialog = true;
  }

  //#endregion


  //#region Deletion
  deleteBook(book: IBook) {
    this.deletionBookDialog = true;
    this.book = { ...book };
  }

  confirmDeletion() {
    this.deletionBookDialog = false;
    this.subs.add(
      this.bookServ.deleteBook(this.book.id).subscribe({
        next: (response: ApiResult) => {
          if (response.code !== 406) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: 'Book Deleted Successfully ',
              life: 3000,
            });
            this.loadBooks();
            this.ref.detectChanges();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Cannot delete because there are transactions associated with this book',
              life: 5000,
            });
            this.loadBooks();
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
      author: '',
      imageUrl: '',
      publicationYear: 0,
      availableCopies: 0,
      totalCopies: 0,
      categoryId: '',
      category: undefined,
      transactions: [],
      feedbacks: [],
      isActive: false,
    };

    this.addBookForm = this.formBuilder.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      author: ['', Validators.required],
      publicationYear: [0, Validators.required],
      availableCopies: [0, Validators.required],
      totalCopies: [0, Validators.required],
      categoryId: ['', Validators.required],
      imageUrl: [''],
      isActive: [true],
    });
  }

  triggerImageUpload() {
    const fileInput = document.getElementById('myBookImage') as HTMLInputElement;
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
    this.filterValue = inputValue;
  }
}