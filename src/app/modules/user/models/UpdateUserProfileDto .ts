export interface UpdateUserProfileDto {
  Id: string;
  FirstName: string;
  LastName: string;
  UserName: string;
  Email: string;
  PhoneNumber: string;
  ProfileImageUrl?: File;
}