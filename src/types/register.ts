export interface RegistrationFormData {
  name: string;
  email: string;
  password: string;
  role: 'seller' | 'buyer';
  image: FileList; 
}