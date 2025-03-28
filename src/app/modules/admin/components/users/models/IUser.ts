export interface IUser {
    id: string;
    firstName: string;
    lastName: string;
    email:string;
    profileImageUrl?: string;
    phoneNumber: string;
    role: string; // "Admin", "Librarian", "Member"
    isActive: boolean;
}