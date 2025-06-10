import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BookDetailsDto } from '../../models/BookDetailsDto';
import { FeedbackService, GetFeedbackDto } from '../../services/feedback.service';
import { MessageService } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BorrowService } from '../../services/borrow.service';

interface Feedback {
  id: string;
  userId: number;
  bookId: number;
  rating: number;
  comment: string;
  insertedTime?: Date;
  insertedUserId?: string;
  updateTime?: Date;
  updateUserId?: string;
  isActive: boolean;
  activationUserId?: string;
  activationTime?: Date;
  isDeleted: boolean;
  deletedTime?: Date;
  deletedUserId?: string;
}

interface SimilarBook {
  id: number;
  title: string;
  authorFullName: string;
  imageUrl: string;
  availableCopies: number;
  totalCopies: number;
}

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrls: ['./book-details.component.scss'],
  providers: [MessageService]
})
export class BookDetailsComponent implements OnInit {
  bookId: number;
  bookDetails: BookDetailsDto;
  similarBooks: SimilarBook[] = [];
  averageRating: number = 0;

  // Form fields
  rating: number = 0;
  feedback: string = '';

  // Reviews list
  reviews: GetFeedbackDto[] = [];

  // Carousel responsive options
  responsiveOptions = [
    {
      breakpoint: '1400px',
      numVisible: 4,
      numScroll: 1
    },
    {
      breakpoint: '1200px',
      numVisible: 3,
      numScroll: 1
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 1
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1
    }
  ];

  //Borrow Book
  borrowBookDialog: boolean = false;
  borrowBookForm: FormGroup;
  submitted: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private booksService: BooksService,
    private feedbackService: FeedbackService,
    private messageService: MessageService,
    private borrowService: BorrowService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(res => {
      this.bookId = res['bookId'];
      this.loadBookDetails();
      this.loadReviews();
    });

    this.borrowBookForm = this.formBuilder.group({
      bookId: [this.bookId, Validators.required],
      dueDate: [null, Validators.required]
    });
  }

  loadBookDetails() {
    this.booksService.getBookDetailsById(this.bookId).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.bookDetails = res.data;
          console.log(this.bookDetails)
          this.loadSimilarBooks();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.message || 'Failed to load book details'
          });
        }
      },
      error: (error) => {
        console.error('Error loading book details:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load book details'
        });
      }
    });
  }

  loadSimilarBooks() {
    if (this.bookId) {
      this.booksService.getRelatedBooks(this.bookId).subscribe({
        next: (res) => {
          if (res.isSuccess && res.data) {
            this.similarBooks = res.data.map(book => ({
              id: book.id,
              title: book.title,
              authorName: book.authorName,
              categoryName: book.categoryName,
              imageUrl: book.imageUrl,
              availableCopies: book.availableCopies,
              totalCopies: book.totalCopies
            }));
          }
          console.log(this.similarBooks)
        },
        error: (error) => {
          console.error('Error loading similar books:', error);
          this.similarBooks = [];
        }
      });
    }
  }

  loadReviews() {
    this.feedbackService.getAllFeedbacksByBookId(this.bookId).subscribe({
      next: (res) => {
        if (res.isSuccess && res.data) {
          this.reviews = res.data;
        } else {
          this.reviews = [];
        }
        this.calculateAverageRating();
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.reviews = [];
        this.calculateAverageRating();
      }
    });
  }

  calculateAverageRating() {
    if (!this.reviews || this.reviews.length === 0) {
      this.averageRating = 0;
      return;
    }
    const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = totalRating / this.reviews.length;
  }

  submitReview() {
    if (this.rating > 0 && this.feedback.trim()) {
      const newReview = {
        userId: 1, // This should come from your auth service
        bookId: this.bookId,
        rating: this.rating,
        comment: this.feedback
      };

      this.feedbackService.addFeedback(newReview).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Review submitted successfully'
            });
            this.loadReviews(); // Reload reviews to show the new one
            // Reset form
            this.rating = 0;
            this.feedback = '';
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message || 'Failed to submit review'
            });
          }
        },
        error: (error) => {
          console.error('Error submitting review:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit review'
          });
        }
      });
    }
  }

  showBorrowBook() {
    if (this.bookDetails.availableCopies > 0) {
      this.borrowBookDialog = true;
    } else {
      this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There is no available copies right now'
          });
    }
  }
  hideDialog() {
    this.borrowBookDialog = false;
    this.submitted = false;
  }
  borrowBook(){
    this.submitted = true;
    if (this.borrowBookForm.valid) {
      this.borrowService.BorrowBook(this.borrowBookForm.value).subscribe({
            next: (res) => {
          if (res.isSuccess) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Borrow request has been submitted successfully'
            });
            this.loadBookDetails();
            this.hideDialog();
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: res.message || 'Failed to submit borrow request'
            });
          }
        },
        error: (error) => {
          console.error('Error submitting borrow request:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message? error.error.message: 'Failed to submit borrow request'
          });
        }
      })

    }
  }
}
