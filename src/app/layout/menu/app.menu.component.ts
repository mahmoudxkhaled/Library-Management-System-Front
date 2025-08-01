import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';
import { BookService } from 'src/app/modules/admin/services/book.service';
import { BooksService } from 'src/app/modules/books/services/books.service';
import { UserService } from 'src/app/modules/admin/components/users/services/user.service';
import { IUserLogged } from 'src/app/modules/admin/components/users/models/UserLogged';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {
    
    AllMenu: MenuModel[] = [];
    allowedMenu: MenuModel[] = [];
    loggedUserRole: string = '';
    user:IUserLogged
    constructor(public layoutService: LayoutService,private UserService:UserService) {
        let userData: any ;
        this.UserService.currentUser$.subscribe(userData=>{
             this.user=userData;
            this.loggedUserRole=this.user.role;
            }
        );        
    }

    ngOnInit() {
        this.AllMenu = [
            {
                label: 'LMS Admin MENU',
                allowedUsers: ["Admin",],
                items: [
                  { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['admin/dashboard']},
                    { label: 'Books List', icon: 'pi pi-fw pi-book', routerLink: ['admin/Books'] },
                    { label: 'Categories List', icon: 'pi pi-fw pi-tags', routerLink: ['admin/categories'] },
                    { label: 'Transactions List', icon: 'pi pi-fw pi-credit-card', routerLink: ['admin/transactions'] },
                    { label: 'Users List', icon: 'pi pi-fw pi-users', routerLink: ['admin/users'] },
                    { label: 'Authors', icon: 'pi pi-fw pi-user', routerLink: ['admin/authors'] },
                   { label: 'Books', icon: 'pi pi-fw pi-book', routerLink: ['/Books'] }
                ]
            },
            {
                label: 'Website',
                allowedUsers: ["Member"],
                items: [
                    // { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Books', icon: 'pi pi-fw pi-book', routerLink: ['/Books'] }
                ]
            },
             {
                label: 'Website',
                allowedUsers: ["Librarian"],
                items: [
                      { label: 'Books List', icon: 'pi pi-fw pi-book', routerLink: ['admin/Books'] },
                    { label: 'Categories List', icon: 'pi pi-fw pi-tags', routerLink: ['admin/categories'] },
                    { label: 'Transactions List', icon: 'pi pi-fw pi-credit-card', routerLink: ['admin/transactions'] },
                    { label: 'Authors', icon: 'pi pi-fw pi-user', routerLink: ['admin/authors'] },
                   { label: 'Books', icon: 'pi pi-fw pi-book', routerLink: ['/Books'] }
                ]
            },
            // {
            //     label: 'UI Components',
            //     allowedUsers: ["Admin","Librarian"],
            //     items: [
            //         { label: 'Form Layout', icon: 'pi pi-fw pi-id-card', routerLink: ['/uikit/formlayout'] },
            //         { label: 'Input', icon: 'pi pi-fw pi-check-square', routerLink: ['/uikit/input'] },
            //         { label: 'Float Label', icon: 'pi pi-fw pi-bookmark', routerLink: ['/uikit/floatlabel'] },
            //         { label: 'Invalid State', icon: 'pi pi-fw pi-exclamation-circle', routerLink: ['/uikit/invalidstate'] },
            //         { label: 'Button', icon: 'pi pi-fw pi-box', routerLink: ['/uikit/button'] },
            //         { label: 'Table', icon: 'pi pi-fw pi-table', routerLink: ['/uikit/table'] },
            //         { label: 'List', icon: 'pi pi-fw pi-list', routerLink: ['/uikit/list'] },
            //         { label: 'Tree', icon: 'pi pi-fw pi-share-alt', routerLink: ['/uikit/tree'] },
            //         { label: 'Panel', icon: 'pi pi-fw pi-tablet', routerLink: ['/uikit/panel'] },
            //         { label: 'Overlay', icon: 'pi pi-fw pi-clone', routerLink: ['/uikit/overlay'] },
            //         { label: 'Media', icon: 'pi pi-fw pi-image', routerLink: ['/uikit/media'] },
            //         { label: 'Menu', icon: 'pi pi-fw pi-bars', routerLink: ['/uikit/menu'], routerLinkActiveOptions: { paths: 'subset', queryParams: 'ignored', matrixParams: 'ignored', fragment: 'ignored' } },
            //         { label: 'Message', icon: 'pi pi-fw pi-comment', routerLink: ['/uikit/message'] },
            //         { label: 'File', icon: 'pi pi-fw pi-file', routerLink: ['/uikit/file'] },
            //         { label: 'Chart', icon: 'pi pi-fw pi-chart-bar', routerLink: ['/uikit/charts'] },
            //         { label: 'Misc', icon: 'pi pi-fw pi-circle', routerLink: ['/uikit/misc'] }
            //     ]
            // },
            // {
            //     label: 'Prime Blocks',
            //     allowedUsers: ["Admin","Librarian"],
            //     items: [
            //         { label: 'Free Blocks', icon: 'pi pi-fw pi-eye', routerLink: ['/blocks'], badge: 'NEW' },
            //         { label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: ['https://www.primefaces.org/primeblocks-ng'], target: '_blank' },
            //     ]
            // },
            // {
            //     label: 'Utilities',
            //     allowedUsers: ["Admin","Librarian"],
            //     items: [
            //         { label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', routerLink: ['/utilities/icons'] },
            //         { label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: ['https://www.primefaces.org/primeflex/'], target: '_blank' },
            //     ]
            // },
            // {
            //     label: 'Pages',
            //     allowedUsers: ["Admin","Librarian"],
            //     items: [
            //         {
            //             label: 'Landing',
            //             icon: 'pi pi-fw pi-globe',
            //             routerLink: ['/landing']
            //         },
            //         {
            //             label: 'Auth',
            //             icon: 'pi pi-fw pi-user',
            //             items: [
            //                 {
            //                     label: 'Login',
            //                     icon: 'pi pi-fw pi-sign-in',
            //                     routerLink: ['/auth/login']
            //                 },
            //                 {
            //                     label: 'Error',
            //                     icon: 'pi pi-fw pi-times-circle',
            //                     routerLink: ['/auth/error']
            //                 },
            //                 {
            //                     label: 'Access Denied',
            //                     icon: 'pi pi-fw pi-lock',
            //                     routerLink: ['/auth/access']
            //                 }
            //             ]
            //         },
            //         {
            //             label: 'Crud',
            //             icon: 'pi pi-fw pi-pencil',
            //             routerLink: ['/pages/crud']
            //         },
            //         {
            //             label: 'Timeline',
            //             icon: 'pi pi-fw pi-calendar',
            //             routerLink: ['/pages/timeline']
            //         },
            //         {
            //             label: 'Not Found',
            //             icon: 'pi pi-fw pi-exclamation-circle',
            //             routerLink: ['/notfound']
            //         },
            //         {
            //             label: 'Empty',
            //             icon: 'pi pi-fw pi-circle-off',
            //             routerLink: ['/pages/empty']
            //         },
            //     ]
            // },
            // {
            //     label: 'Hierarchy',
            //     items: [
            //         {
            //             label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark' }
            //                     ]
            //                 },
            //             ]
            //         },
            //         {
            //             label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
            //             items: [
            //                 {
            //                     label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark' },
            //                         { label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //                 {
            //                     label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
            //                     items: [
            //                         { label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark' },
            //                     ]
            //                 },
            //             ]
            //         }
            //     ]
            // },
            // {
            //     label: 'Get Started',
            //     items: [
            //         {
            //             label: 'Documentation', icon: 'pi pi-fw pi-question', routerLink: ['/documentation']
            //         },
            //         {
            //             label: 'View Source', icon: 'pi pi-fw pi-search', url: ['https://github.com/primefaces/sakai-ng'], target: '_blank'
            //         }
            //     ]
            // }
        ];

        this.allowedMenu = this.AllMenu.filter(a => a.allowedUsers.includes(this.loggedUserRole));
    }
}
export interface MenuModel {
    label: string,
    allowedUsers: string[],
    items: any[]
}