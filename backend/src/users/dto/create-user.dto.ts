import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Nome deve ser carateres' })
  @IsNotEmpty({ message: 'Nome deve ser obrigatório' })
  name: string;

  @IsEmail({}, { message: 'Tipo de e-mail inválido' })
  email: string;

  @IsString({ message: 'Senha deve ser texto' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
