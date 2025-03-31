import { Component, OnInit } from '@angular/core';
import { BooksService } from '../../services/books.service';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { BookDetailsDto } from '../../models/BookDetailsDto';

@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.scss'
})
export class BookDetailsComponent implements OnInit{
  bookId:number;
  bookDetails:BookDetailsDto
constructor(private activatedRoute:ActivatedRoute,private booksService:BooksService){}
  ngOnInit(): void {
   this.activatedRoute.params.subscribe(res=>{
  this.bookId=res['bookId'];
  this.booksService.getBookDetailsById(this.bookId).subscribe(res=>{
    this.bookDetails=res.data
console.log('✌️this.bookDetails --->', this.bookDetails);
  },err=>{
  })
   })
  }
}
