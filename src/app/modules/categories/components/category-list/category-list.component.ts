import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ICategory } from '../../models/ICategory';
import { CategoryService } from '../../services/category.service';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { TableLoadingService } from 'src/app/core/Services/table-loading.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewChecked, OnDestroy {

  tableLoadingSpinner: boolean = true;
  subs: Subscription = new Subscription();

  editCategoryDialog: boolean = false;
  addCategoryDialog: boolean = false;
  deletionCategoryDialog: boolean = false;
  switchActivationCategoryDialog: boolean = false;

  submitted: boolean = false;

  categories: ICategory[] = [];
  selectedCategory: ICategory | null = null;

  addCategoryForm: FormGroup;
  editCategoryForm: FormGroup;

  selectedCategoryImage: File | null = null;
  imageUrl: string = '../../../../../assets/media/upload-photo.jpg';

  menuItems: MenuItem[] = [];

  constructor(
    private categoryServ: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private ref: ChangeDetectorRef,
    private tableLoadingService: TableLoadingService,
  ) {
    this.initCategoryModelAndForm();
  }

  ngAfterViewChecked(): void {
    this.ref.detectChanges();
  }

  ngOnInit() {
    this.loadCategories();

    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });

    const editBtn = {
      label: 'Edit',
      icon: 'pi pi-fw pi-pencil',
      command: () => this.editCategory(this.selectedCategory!),
    };
    const deleteBtn = {
      label: 'Delete',
      icon: 'pi pi-fw pi-trash',
      command: () => this.deleteCategory(this.selectedCategory!),
    };

    this.menuItems = [];
    this.menuItems.push(deleteBtn);
    this.menuItems.push(editBtn);
  }

  assignCurrentSelect(category: ICategory) {
    this.selectedCategory = category;
  }

  loadCategories() {
    this.tableLoadingService.show();
    this.subs.add(
      this.categoryServ.getAllCategories().subscribe((data) => {
        this.categories = data.data;
        this.ref.detectChanges();
        this.tableLoadingService.hide();
      })
    );
  }

  //#region Add Category
  addCategory() {
    this.initCategoryModelAndForm();
    this.imageUrl = '../../../../../assets/media/upload-photo.jpg';
    this.selectedCategoryImage = null;
    this.addCategoryDialog = true;
  }

  saveAddCategory() {
    this.submitted = true;

    if (this.addCategoryForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.addCategoryForm.value.name);

      const categoryImageFile = this.selectedCategoryImage;
      if (categoryImageFile) {
        formData.append('ImageUrl', categoryImageFile, categoryImageFile.name);
      }

      this.subs.add(
        this.categoryServ.addCategory(formData).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: 'Category Added',
              life: 3000,
            });
            this.loadCategories();
            this.ref.detectChanges();
            this.initCategoryModelAndForm();
            this.addCategoryDialog = false;
          },
        })
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Fill all fields please',
        life: 3000,
      });
    }
  }

  declineAddCategoryDialog() {
    this.submitted = false;
    this.initCategoryModelAndForm();
    this.addCategoryDialog = false;
  }
  //#endregion

  //#region Edit Category
  editCategory(category: ICategory) {
    this.selectedCategory = category;
    this.editCategoryDialog = true;
  }

  declineEditCategory() {
    this.submitted = false;
    this.initCategoryModelAndForm();
    this.editCategoryDialog = false;
  }
  //#endregion

  //#region Deletion
  deleteCategory(category: ICategory) {
    this.deletionCategoryDialog = true;
    this.selectedCategory = { ...category };
  }

  confirmDeletion() {
    this.deletionCategoryDialog = false;
    this.subs.add(
      this.categoryServ.deleteCategory(this.selectedCategory!.id).subscribe({
        next: (response: ApiResult) => {
          if (response.code !== 406) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: response.message,
              life: 3000,
            });
            this.loadCategories();
            this.ref.detectChanges();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Cannot delete because there are books associated with this category',
              life: 5000,
            });
            this.loadCategories();
            this.ref.detectChanges();
          }
        },
      })
    );
    this.initCategoryModelAndForm();
    this.deletionCategoryDialog = false;
  }

  declineDeletion() {
    this.deletionCategoryDialog = false;
    this.initCategoryModelAndForm();
  }
  //#endregion


  initCategoryModelAndForm() {
    this.selectedCategory = {
      id: '',
      name: '',
      description: '',
      imageUrl: '',
      books: [],
      isActive: false,
    };

    this.addCategoryForm = this.formBuilder.group({
      name: ['', Validators.required],
      imageUrl: [''],
      isActive: [true],
    });
  }

  triggerImageUpload() {
    const fileInput = document.getElementById('myCategoryImage') as HTMLInputElement;
    fileInput.click();
  }

  handleImageSelection(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedCategoryImage = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
        this.ref.detectChanges();
      };
      reader.readAsDataURL(this.selectedCategoryImage);
    }
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}