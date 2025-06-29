import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const catergory = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        type: createCategoryDto.type,
        color: createCategoryDto.color || undefined,
        icon: createCategoryDto.icon || undefined,
        userId: createCategoryDto.userId, // Make sure 'user' is present in CreateCategoryDto
      },
    });

    return {
      message: 'Categoria criada com sucesso',
      statusCode: HttpStatus.CREATED,
      data: catergory,
    };
  }

  async findAll() {
    const categoriesFind = await this.prisma.category.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        context: true,
      },
    });
    if (!categoriesFind || categoriesFind.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }

    return {
      message: 'Categorias encontradas com sucesso',
      statusCode: 200,
      data: categoriesFind,
    };
  }

  async findOne(id: string) {
    await this.findCategoryById(id);

    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        context: true,
      },
    });

    return {
      message: 'Categoria encontrada com sucesso',
      statusCode: HttpStatus.CREATED,
      data: category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.findCategoryById(id);

    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        type: updateCategoryDto.type,
        color: updateCategoryDto.color || undefined,
        icon: updateCategoryDto.icon || undefined,
      },
    });

    return {
      message: 'Categoria atualizada com sucesso',
      statusCode: HttpStatus.OK,
      data: updatedCategory,
    };
  }

  async remove(id: string) {
    await this.findCategoryById(id);
    await this.prisma.category.delete({ where: { id } });
    return {
      message: 'Categoria removida com sucesso',
      statusCode: HttpStatus.OK,
    };
  }

  async findCategoryById(id: string) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return category;
  }
}
