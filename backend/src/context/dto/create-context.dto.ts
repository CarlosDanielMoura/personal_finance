import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateContextDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsOptional()
  @IsString({ message: 'A cor deve ser uma string' })
  color?: string;

  @IsOptional()
  @IsString({ message: 'O ícone deve ser uma string' })
  icon?: string;

  @IsString()
  @IsNotEmpty({ message: 'O ID do usuário é obrigatório' })
  userId: string;
}
