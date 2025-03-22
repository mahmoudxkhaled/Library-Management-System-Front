import { Component, OnInit } from '@angular/core';
import { BooksService } from 'src/app/modules/books/services/books.service';
import {  ReadBookDto } from '../../models/ReadBookDto';
import { PagedResult } from 'src/app/shared/Models/PagedResult';
import { ApiResult } from 'src/app/core/models/ApiResult';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrl: './books-list.component.scss'
})
export class BooksListComponent implements OnInit{
  first:number=0;
  rows:number=20;
  sortOrder:number=1;
  search:string=null;
  booksResult:ApiResult
  constructor(private BooksService:BooksService){}
  ngOnInit()
  {
this.BooksService.getBooksPaged(this.first,this.rows,this.sortOrder,this.search).subscribe(booksResult=>{
this.booksResult=booksResult;
console.log("his.booksResult :",this.booksResult);

},err=>{
  console.log("err",err);  
});

 }
onPageChange(event)
{

}
}