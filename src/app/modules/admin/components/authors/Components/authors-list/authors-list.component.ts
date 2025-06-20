import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AuthorService } from '../../Services/author.service';
import { GetAuthorDto } from '../../Models/GetAuthorDto ';
import { AuthorParams } from '../../Models/AuthorParams';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { DataView } from 'primeng/dataview';
import { BooksService } from 'src/app/modules/books/services/books.service';

@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.scss'
})
export class AuthorsListComponent implements OnInit {
  @ViewChild('dv') dataView: DataView;

  authors: GetAuthorDto[] = [];
  selectedAuthorImage: File | null = null;
  TotalCount: number = 0;
  author: GetAuthorDto;
  headerDialog: string = '';
  AuthorParams: AuthorParams;
  currentPage: number = 0;
  deletionAuthorDialog: boolean = false;
  authorDialog: boolean = false;
  switchActivationAuthorDialog: boolean = false;
  authorForm: FormGroup;
  submitted: boolean = false;
  imageUrl: string = 'assets/media/upload-photo.jpg';
  isEditing: boolean = false;
  loading: boolean = false;
  maxDate: Date = new Date();
  currentAuthor: GetAuthorDto;
  menuItems: MenuItem[];

  sortOptions: any[] = [
    { label: 'Name A-Z', value: 'FullName' },
    { label: 'Name Z-A', value: '-FullName' },
    { label: 'Newest First', value: '-DateOfBirth' },
    { label: 'Oldest First', value: 'DateOfBirth' }
  ];

  constructor(
    private BooksService:BooksService,
    private authorService: AuthorService,
    private fb: FormBuilder,
    private messageService: MessageService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.initializeParams();
    this.initAuthorForm();
    this.loadAuthors({ first: 0, rows: 12 });
    this.initializeMenuItems();
  }
ExportToExcel(){ 
  this.authorService.ExportToExcelWithoutParams().subscribe(res => {
      this.BooksService.downLoadFile(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "AuthorRecords.xlsx");
    }, err => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed Export to Excel'
      });
    }
    )}
  private initializeParams(): void {
    this.AuthorParams = {
      search: '',
      sortField: 'FullName',
      sortOrder: 1,
      isActive: null
    };
  }

  initAuthorForm(): void {
    this.authorForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateOfBirth: ['', Validators.required]
    });
  }

  onPageChange(event: any): void {
    this.currentPage = Math.floor(event.first / event.rows);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadAuthors(event);
  }

  loadAuthors(event: any): void {
    this.loading = true;
    const first = event.first || 0;
    const rows = event.rows || 12;

    this.authorService.getAuthorsPaged(first, rows, this.AuthorParams)
      .pipe(
        finalize(() => {
          this.loading = false;
          this.ref.detectChanges();
        })
      )
      .subscribe({
        next: (authorResult) => {
          if (authorResult && authorResult.data) {
            this.authors = authorResult.data.result;
            this.TotalCount = authorResult.data.totalCount;
            console.log('Authors loaded:', this.authors);
            this.loading = false;
            this.ref.detectChanges();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load authors',
            life: 3000
          });
        }
      });
  }

  addAuthor(): void {
    this.isEditing = false;
    this.authorDialog = true;
    this.headerDialog = "Add New Author";
    this.imageUrl = 'assets/media/upload-photo.jpg';
    this.initAuthorForm();
  }

  onSortChange(event: any): void {
    this.loading = true;
    this.AuthorParams.sortField = event.value;
    this.currentPage = 0;
    if (this.dataView) {
      this.dataView.first = 0;
    }
    this.loadAuthors({ first: 0, rows: 12 });
  }

  triggerImageUpload(): void {
    const fileInput = document.getElementById('myBookImage') as HTMLInputElement;
    fileInput.click();
  }

  handleImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      const file = input.files[0];
      if (this.isValidImageFile(file)) {
        this.selectedAuthorImage = file;
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imageUrl = e.target.result;
        };
        reader.readAsDataURL(this.selectedAuthorImage);
      } else {
        this.messageService.add({
          severity: 'error',
          summary: 'Invalid File',
          detail: 'Please select a valid image file (jpg, jpeg, png, or webp)',
          life: 3000
        });
      }
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    return validTypes.includes(file.type);
  }

  onFilter(event: any): void {
    this.loading = true;
    const inputValue = (event.target as HTMLInputElement).value;
    this.AuthorParams.search = inputValue;
    this.currentPage = 0;
    if (this.dataView) {
      this.dataView.first = 0;
    }
    this.loadAuthors({ first: 0, rows: 12 });
  }

  deleteAuthor(author: GetAuthorDto): void {
    this.deletionAuthorDialog = true;
    this.author = author;
  }

  editAuthor(author: GetAuthorDto): void {
    this.isEditing = true;
    this.authorDialog = true;
    this.headerDialog = "Update Author";
    this.author = author;
    this.imageUrl = author.imageURL || 'assets/media/upload-photo.jpg';

    this.authorForm.patchValue({
      fullName: author.fullName,
      description: author.description,
      dateOfBirth: new Date(author.dateOfBirth)
    });
  }

  saveAuthor(): void {
    this.submitted = true;
    if (this.authorForm.valid) {
      const formData = new FormData();
      formData.append('fullName', this.authorForm.value.fullName);
      formData.append('description', this.authorForm.value.description);

      // Format date to YYYY-MM-DD
      const date = new Date(this.authorForm.value.dateOfBirth);
      const formattedDate = date.toISOString().split('T')[0];
      formData.append('dateOfBirth', formattedDate);

      if (this.selectedAuthorImage) {
        formData.append('imageUrl', this.selectedAuthorImage, this.selectedAuthorImage.name);
      }

      formData.forEach((value, key) => {
        console.log(key, value);
      });
      if (this.isEditing) {
        formData.append('id', this.author.id.toString());
        this.updateAuthor(formData);
      } else {
        this.createAuthor(formData);
      }
    }
  }

  private createAuthor(formData: FormData): void {
    this.authorService.addAuthor(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Author added successfully',
          life: 3000
        });
        this.closeDialog();
        this.loadAuthors({ first: 0, rows: 12 });
      },
      error: (error) => this.handleError(error)
    });
  }

  private updateAuthor(formData: FormData): void {
    this.authorService.updateAuthor(formData).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Author updated successfully',
          life: 3000
        });
        this.closeDialog();
        this.loadAuthors({ first: 0, rows: 12 });
      },
      error: (error) => this.handleError(error)
    });
  }

  private handleError(error: any): void {
    const message = error.error?.message || 'An error occurred';
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: message,
      life: 3000
    });
  }

  private closeDialog(): void {
    this.authorDialog = false;
    this.submitted = false;
    this.isEditing = false;
    this.selectedAuthorImage = null;
    this.imageUrl = 'assets/media/upload-photo.jpg';
    this.initAuthorForm();
  }

  declineDeletion(): void {
    this.deletionAuthorDialog = false;
  }

  confirmDeletion(authorId: number): void {
    this.authorService.deleteAuthor(authorId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Author deleted successfully',
          life: 3000
        });
        this.deletionAuthorDialog = false;
        this.loadAuthors({ first: 0, rows: 12 });
      },
      error: (error) => this.handleError(error)
    });
  }

  declineActivation(): void {
    this.switchActivationAuthorDialog = false;
  }

  confirmActivation(authorId: number): void {
    this.authorService.ActivateOrDeactivateAuthor(authorId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: `Author ${this.author.isActive ? 'deactivated' : 'activated'} successfully`,
          life: 3000
        });
        this.switchActivationAuthorDialog = false;
        this.loadAuthors({ first: 0, rows: 12 });
      },
      error: (error) => this.handleError(error)
    });
  }

  declineAddAuthorDialog(): void {
    this.closeDialog();
  }

  DeactivateOrActivate(author: GetAuthorDto): void {
    this.author = author;
    this.switchActivationAuthorDialog = true;
  }

  get fullName() { return this.authorForm.get('fullName'); }
  get description() { return this.authorForm.get('description'); }

  private initializeMenuItems(): void {
    this.menuItems = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editAuthor(this.currentAuthor) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteAuthor(this.currentAuthor) }
    ];
  }

  assignCurrentAuthor(author: GetAuthorDto): void {
    this.currentAuthor = author;
  }
}
