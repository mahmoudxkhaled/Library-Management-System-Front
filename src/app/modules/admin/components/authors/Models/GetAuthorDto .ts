export class GetAuthorDto {
    id: number;
    fullName: string;
    description?: string;
    dateOfBirth: string; 
    imageURL:string | null;
    isActive: boolean;
}