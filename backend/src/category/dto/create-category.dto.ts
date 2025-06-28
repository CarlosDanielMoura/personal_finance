import { IsNotEmpty, IsOptional, IsString, IsEnum } from 'class-validator';
import { CategoryType } from '../enums/category.type.enum';

// ajuste o caminho

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name: string;

  @IsNotEmpty({ message: 'O tipo é obrigatório' })
  @IsEnum(CategoryType, {
    message: 'Tipo inválido. Use ENTRADA ou SAIDA',
  })
  type: CategoryType;

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
