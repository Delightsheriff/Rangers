export class SignUpDto {
    readonly email: string;
    readonly password: string;
    readonly first_name: string;
    readonly last_name: string;
  }
  
  export class LoginDto {
    readonly email: string;
    readonly password: string;
  }