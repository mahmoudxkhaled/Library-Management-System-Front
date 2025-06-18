import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subscription, debounceTime } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { IDashboardDto } from './dashboardDto';
import { DahboardService } from './services/dashboard.service';
import { ApiResult } from 'src/app/core/models/ApiResult';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {

    loading: boolean = false;

    dashboard!: IDashboardDto;

    barOptions: any;
    pieOptions: any;
    
    topBooksData: any;
    topUsersData: any;
    topCategoriessData: any;
    topAuthersData: any;


    subscription!: Subscription;

    constructor(private dashboardService: DahboardService, public layoutService: LayoutService,private messageService: MessageService) {
        this.subscription = this.layoutService.configUpdate$
        .pipe(debounceTime(25))
        .subscribe((config) => {
            this.initChart();
        });
    }

    ngOnInit() {
        this.loadDashboardData();
        
    }

    initChart() {
        const documentStyle = getComputedStyle(document.documentElement);
        const textColor = documentStyle.getPropertyValue('--text-color');
        const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
        const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
        
        this.topBooksData = {
            labels: this.dashboard.topBooks.map(a=> a.text),
            datasets: [
                {
                    label: 'Top Books',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: this.dashboard.topBooks.map(a=> a.value)
                }
            ]
        };
        this.topUsersData = {
            labels: this.dashboard.topUsers.map(a=> a.text),
            datasets: [
                {
                    label: 'Top Users',
                    backgroundColor: documentStyle.getPropertyValue('--primary-500'),
                    borderColor: documentStyle.getPropertyValue('--primary-500'),
                    data: this.dashboard.topUsers.map(a=> a.value)
                }
            ]
        };

        this.barOptions = {
            plugins: {
                legend: {
                    labels: {
                        fontColor: textColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: textColorSecondary,
                        font: {
                            weight: 500
                        }
                    },
                    grid: {
                        display: false,
                        drawBorder: false
                    }
                },
                y: {
                    ticks: {
                        color: textColorSecondary
                    },
                    grid: {
                        color: surfaceBorder,
                        drawBorder: false
                    }
                },
            }
        };

        this.topCategoriessData = {
            labels: this.dashboard.topCategories.map(a=> a.text),
            datasets: [
                {
                    data: this.dashboard.topCategories.map(a=> a.value),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--bluegray-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--bluegray-400')
                    ]
                }]
        };
        this.topAuthersData = {
            labels: this.dashboard.topAuthers.map(a=> a.text),
            datasets: [
                {
                    data: this.dashboard.topAuthers.map(a=> a.value),
                    backgroundColor: [
                        documentStyle.getPropertyValue('--indigo-500'),
                        documentStyle.getPropertyValue('--purple-500'),
                        documentStyle.getPropertyValue('--teal-500'),
                        documentStyle.getPropertyValue('--orange-500'),
                        documentStyle.getPropertyValue('--bluegray-500')
                    ],
                    hoverBackgroundColor: [
                        documentStyle.getPropertyValue('--indigo-400'),
                        documentStyle.getPropertyValue('--purple-400'),
                        documentStyle.getPropertyValue('--teal-400'),
                        documentStyle.getPropertyValue('--orange-400'),
                        documentStyle.getPropertyValue('--bluegray-400')
                    ]
                }]
        };
        this.pieOptions = {
            plugins: {
                legend: {
                    labels: {
                        usePointStyle: true,
                        color: textColor
                    }
                }
            }
        };
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    getDashboardData() {
        
    }

    loadDashboardData() {
        this.loading = true;
    this.dashboardService.getDashboardData().subscribe({
            next: (response: ApiResult) => {
              if (response.isSuccess) {
                this.dashboard = response.data;
                this.initChart();
              }
              else{
                this.messageService.add({ key: 'tst', severity: 'error', summary: 'Error Message', detail: response.message });
              }
              this.loading = false;
            },
            error: (error) => {
              console.error('Error loading transactions', error);
              this.loading = false;
            }
          });
  }
}
