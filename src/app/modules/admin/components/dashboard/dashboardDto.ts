export interface IDashboardDto{

    transactionCount: number;
    returnedCount: number;
    membersCount: number;
    overdueCount: number;

    topUsers: IChartDto[];
    topBooks: IChartDto[];
    topCategories: IChartDto[];
    topAuthers: IChartDto[];
}
export interface IChartDto{

text:string;
value: number;
}