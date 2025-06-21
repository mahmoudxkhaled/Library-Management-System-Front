import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { finalize, Subscription } from 'rxjs';
import { ICategory } from '../../models/ICategory';
import { CategoryService } from '../../services/category.service';
import { ApiResult } from 'src/app/core/models/ApiResult';
import { TableLoadingService } from 'src/app/core/services/table-loading.service';
import { DataView } from 'primeng/dataview';
import { SelectedFilter } from 'src/app/modules/admin/models/SelectedFilters';
import { BooksService } from 'src/app/modules/books/services/books.service';
import { categoryParams } from '../../models/categoryParams';

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
  currentPage: number = 0;
  searchTerm: string = '';
  filteredCategories: ICategory[] = [];
  @ViewChild('dv') dv: DataView | undefined;
 categoryParams:categoryParams;
 TotalCount:number;
  constructor(private BooksService:BooksService,
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
    this.initializeParams();
    this.loadCategories({ first: 0, rows: 12 });
    this.tableLoadingService.loading$.subscribe((isLoading) => {
      this.tableLoadingSpinner = isLoading;
    });

    this.initializeMenuItems();
  }
 private initializeParams(): void {
    this.categoryParams = {
      search: '',
      sortField: 'FullName',
      sortOrder: 1,
      isActive: null
    };
  }
  initializeMenuItems() {
    this.menuItems = [
      {
        label: 'Edit Category',
        icon: 'pi pi-pencil',
        command: () => this.editCategory(this.category!)
      },
      {
        label: 'Delete Category',
        icon: 'pi pi-trash',
        command: () => this.deleteCategory(this.category!)
      }
    ];
  }
ExportToExcel(){

    this.categoryServ.ExportToExcel().subscribe(res => {
      this.BooksService.downLoadFile(res, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "CategoryRecords.xlsx");
    }, err => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed Export to Excel'
      });
    }
    )
}
  assignCurrentSelect(category: ICategory) {
    this.category = category;
  }


   onPageChange(event: any): void {
    this.currentPage = Math.floor(event.first / event.rows);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.loadCategories(event);
  }
   loadCategories(event: any): void {
    this.tableLoadingSpinner = true;
    const first = event.first || 0;
    const rows = event.rows || 12;
    console.log("categoryParams ===>",this.categoryParams);
    
    this.categoryServ.getCategoriesPaged(first, rows, this.categoryParams)
      .pipe(
        finalize(() => {
          this.tableLoadingSpinner = false;
          this.ref.detectChanges();
        })
      )
      .subscribe({
        next: (authorResult) => {
          if (authorResult && authorResult.data) {
            this.categories = authorResult.data.result;
            this.TotalCount = authorResult.data.totalCount;
            console.log('categories loaded:', this.categories);
            this.tableLoadingSpinner = false;
            this.ref.detectChanges();
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load categories',
            life: 3000
          });
        }
      });
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
              detail: this.isEditing ? 'Category Updated Successfully' : 'Category Added Successfully',
              life: 3000,
            });
            this.currentPage=0;
            this.loadCategories({ first: 0, rows: 12 });
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
            this.loadCategories({ first: 0, rows: 12 });
            this.ref.detectChanges();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Cannot delete because there are books associated with this category',
              life: 5000,
            });
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