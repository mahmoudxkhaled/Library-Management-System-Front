import { Component, OnInit } from '@angular/core';
import { AuthorService } from '../../Services/author.service';
import { GetAuthorDto } from '../../Models/GetAuthorDto ';
import { AuthorParams } from '../../Models/AuthorParams';
import { MenuItem, MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, MaxLengthValidator, Validators } from '@angular/forms';
import { finalize, first } from 'rxjs';

@Component({
  selector: 'app-authors-list',
  templateUrl: './authors-list.component.html',
  styleUrl: './authors-list.component.scss'
})
export class AuthorsListComponent implements OnInit {
  authors: GetAuthorDto[]
  selectedAuthorImage: File | null = null;
  TotalCount: number;
  author: GetAuthorDto;
  headerDialog: string = '';
  AuthorParams: AuthorParams
  reloadPage: { first: number, rows: number }
  menuItems: MenuItem[] = [];
  layout: string = 'list';
  deletionAuthorDialog: boolean = false;
  authorDialog: boolean = false;
  switchActivationAuthorDialog: boolean = false;
  authorForm: FormGroup;
  submitted: boolean = false;
  imageUrl: string = '../../../../../assets/media/upload-photo.jpg';
  isEditing: boolean = false;
  loading: boolean = true;
  sortOptions: any[] = [
    { label: 'Full Name', value: 'FullName' },
    { label: 'Date Of Birth', value: 'DateOfBirth' },
    { label: 'Inserted Time', value: 'InsertedTime' }
  ]; constructor(private AuthorService: AuthorService, private fb: FormBuilder, private messageService: MessageService,
  ) { }
  ngOnInit(): void {
    this.AuthorParams = { search: '', sortField: '', sortOrder: 1, isActive: null }
    this.reloadPage = { first: 0, rows: 10 }
    this.AuthorParams.sortField = "FullName";
    this.menuItems = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editAuthor(this.author) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteAuthor(this.author) }
    ];
    this.initAuthorForm();
    this.loadAuthors(this.reloadPage);
  }
  initAuthorForm() {
    this.authorForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.maxLength(50)]],
        description: ['', Validators.required],
        dateOfBirth: ['', Validators.required]
      })
  }
  loadAuthors(event: any) {
    this.reloadPage.first = event.first;
    this.reloadPage.rows = event.rows;

    this.AuthorService.getAuthorsPaged(this.reloadPage.first, this.reloadPage.rows, this.AuthorParams)
      .subscribe({
        next: authorResult => {
          console.log("authorResult :", authorResult)
          this.authors = authorResult.data.result;
          this.TotalCount = authorResult.data.totalCount;
          this.loading = false;
        },
        error: err => {
          this.loading = false;
        }
      });
  }

  addAuthor() {
    this.authorDialog = true;
    this.headerDialog = "Add New Author"
  }
  onSortChange(event: any) {
    (event.value)
    this.AuthorParams.sortField = event.value;
    this.loadAuthors(this.reloadPage)
  }
  triggerImageUpload() {
    const fileInput = document.getElementById('myBookImage') as HTMLInputElement;
    fileInput.click();
  }
  handleImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedAuthorImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(this.selectedAuthorImage);
    }
  }
  onFilter(event: any) {
    const inputValue = (event.target as HTMLInputElement).value;
    this.AuthorParams.search = inputValue;
    this.reloadPage.first = 0;
    this.loadAuthors(this.reloadPage);
  }
  deleteAuthor(author: GetAuthorDto) {
    this.deletionAuthorDialog = true;
    this.author = author;
  }
  editAuthor(author: GetAuthorDto) {
    this.isEditing = true;
    this.imageUrl = author.imageURL;
    this.authorDialog = true;
    this.headerDialog = "Update Author"
    this.author = author;
    this.authorForm.patchValue({
      fullName: author.fullName,
      description: author.description,
      dateOfBirth: author.dateOfBirth,
      imageUrl: this.selectedAuthorImage
    })
  }
  assignCurrentSelect(author: GetAuthorDto) {
    this.author = author;
  }

  saveAuthor() {
    this.submitted = true;
    if (this.authorForm.valid) {
      const formData = new FormData();
      formData.append('fullName', this.authorForm.value.fullName);
      formData.append('description', this.authorForm.value.description);
      formData.append('dateOfBirth', this.authorForm.value.dateOfBirth);
      const bookImageFile = this.selectedAuthorImage;
      if (bookImageFile) {
        formData.append('imageUrl', bookImageFile, bookImageFile.name);
      }
      if (this.isEditing) {
        formData.append('id', this.author.id.toString());
        this.AuthorService.updateAuthor(formData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'author Updated',
              life: 3000,
            });
            this.loadAuthors(this.reloadPage);
            this.authorDialog = false;
            this.isEditing = false;
            this.imageUrl = null;
            this.submitted = false;
          },
        })
      } else {
        // If adding new book
        this.AuthorService.addAuthor(formData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Author Added',
              life: 3000,
            });
            this.initAuthorForm();
            this.loadAuthors(this.reloadPage);
            this.authorDialog = false;
            this.submitted = false;
          },
        })

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
  declineDeletion() {
    this.deletionAuthorDialog = false;
  }
  confirmDeletion(autherId: number) {
    this.AuthorService.deleteAuthor(autherId).subscribe(res => {
      this.AuthorParams.search = '';
      this.loadAuthors(this.reloadPage)
      this.deletionAuthorDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Auther Deleted',
        life: 3000,
      });
    }, err => {
      this.deletionAuthorDialog = false;
      var message = "";
      if (err.error.message != null)
        message = err.error.message;
      else
        message = err.message;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: message,
        life: 3000,
      });
    });
  }
  declineActivation() {
    this.switchActivationAuthorDialog = false;
  }
  confirmActivation(authorId: number) {
    this.AuthorService.ActivateOrDeactivateAuthor(authorId).subscribe(res => {
      this.loadAuthors(this.reloadPage);
      this.switchActivationAuthorDialog = false;
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Author Updated',
        life: 3000,
      });
    }, err => {

    })
  }
  declineAddAuthorDialog() {
    this.submitted = false;
    this.authorDialog = false;
    this.imageUrl = null;
    this.initAuthorForm();
    this.isEditing = false;
  }
  DeactivateOrActivate(author: any) {
    this.author = author;
    this.switchActivationAuthorDialog = true;
  }
  get fullName() {
    return this.authorForm.controls['fullName'];
  }
  get description() {
    return this.authorForm.controls['description'];
  }
}
