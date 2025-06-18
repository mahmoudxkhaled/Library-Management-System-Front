import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { ICategory } from '../../models/ICategory';
import { CategoryService } from '../../services/category.service';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';
import { DataView } from 'primeng/dataview';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit, AfterViewChecked, OnDestroy {
  tableLoadingSpinner: boolean = true;
  subs: Subscription = new Subscription();

  categoryDialog: boolean = false;
  deletionCategoryDialog: boolean = false;
  switchActivationCategoryDialog: boolean = false;

  submitted: boolean = false;
  isEditing: boolean = false;

  categories: ICategory[] = [];
  category: ICategory | null = null;

  categoryForm: FormGroup;

  selectedCategoryImage: File | null = null;
  imageUrl: string = '../../../../../assets/media/upload-photo.jpg';

  menuItems: MenuItem[] = [];

  searchTerm: string = '';
  filteredCategories: ICategory[] = [];

  @ViewChild('dv') dv: DataView | undefined;

  constructor(
    private categoryServ: CategoryService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
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

    this.menuItems = [
      { label: 'Edit', icon: 'pi pi-pencil', command: () => this.editCategory(this.category) },
      { label: 'Delete', icon: 'pi pi-trash', command: () => this.deleteCategory(this.category) }
    ];
  }

  assignCurrentSelect(category: ICategory) {
    this.category = category;
  }

  loadCategories() {
    this.tableLoadingService.show();
    this.subs.add(
      this.categoryServ.getAllCategories().subscribe((data) => {
        if (data.isSuccess) {
          this.categories = data.data;
          this.filteredCategories = this.categories;
        }
        this.ref.detectChanges();
        this.tableLoadingService.hide();
      })
    );
  }

  onSearch() {
    if (!this.searchTerm.trim()) {
      this.filteredCategories = this.categories;
      return;
    }

    const searchLower = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower)
    );

    // Reset pagination to first page when searching
    setTimeout(() => {
      if (this.dv) {
        this.dv.first = 0;
      }
    });
  }

  //#region Add/Edit Category
  addCategory() {
    this.isEditing = false;
    this.initCategoryModelAndForm();
    this.imageUrl = '../../../../../assets/media/upload-photo.jpg';
    this.selectedCategoryImage = null;
    this.categoryDialog = true;
  }

  editCategory(category: ICategory) {
    this.isEditing = true;
    this.category = { ...category };
    this.imageUrl = category.imageUrl ? category.imageUrl : '../../../../../assets/media/upload-photo.jpg';

    this.categoryForm.patchValue({
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      isActive: category.isActive,
    });

    this.categoryDialog = true;
  }

  saveAddCategory() {
    this.submitted = true;

    if (this.categoryForm.valid) {
      const formData = new FormData();
      formData.append('Name', this.categoryForm.value.name);
      formData.append('Description', this.categoryForm.value.description);
      if (this.isEditing) {
        formData.append('Id', this.category!.id);
      }

      const categoryImageFile = this.selectedCategoryImage;
      if (categoryImageFile) {
        formData.append('ImageUrl', categoryImageFile, categoryImageFile.name);
      }

      const serviceCall = this.isEditing
        ? this.categoryServ.updateCategory(formData)
        : this.categoryServ.addCategory(formData);

      this.subs.add(
        serviceCall.subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Successful',
              detail: this.isEditing ? 'Category Updated' : 'Category Added',
              life: 3000,
            });
            this.loadCategories();
            this.ref.detectChanges();
            this.initCategoryModelAndForm();
            this.categoryDialog = false;
            this.submitted = false;
            this.isEditing = false;
          },
          error: (err) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'An error occurred while saving the category',
              life: 3000,
            });
          }
        })
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill all required fields',
        life: 3000,
      });
    }
  }

  declineAddCategoryDialog() {
    this.submitted = false;
    this.initCategoryModelAndForm();
    this.categoryDialog = false;
    this.isEditing = false;
  }
  //#endregion

  //#region Deletion
  deleteCategory(category: ICategory) {
    this.deletionCategoryDialog = true;
    this.category = { ...category };
  }

  confirmDeletion() {
    this.deletionCategoryDialog = false;
    this.subs.add(
      this.categoryServ.deleteCategory(this.category!.id).subscribe({
        next: (response: ApiResult) => {
          if (response.code !== 406) {
            this.messageService.add({
              severity: 'success',
              summary: 'Successfully',
              detail: 'Category Deleted Successfully',
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
    this.categoryForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required],
      description: ['', Validators.required],
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