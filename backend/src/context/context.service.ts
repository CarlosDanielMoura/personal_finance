import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateContextDto } from './dto/create-context.dto';
import { UpdateContextDto } from './dto/update-context.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ContextService {
  constructor(private prisma: PrismaClient) {}

  async create(createContextDto: CreateContextDto) {
    await this.findContextByUserAndName(
      createContextDto.userId,
      createContextDto.name,
    );

    const context = await this.prisma.context.create({
      data: {
        name: createContextDto.name,
        color: createContextDto.color || undefined,
        icon: createContextDto.icon || undefined,
        userId: createContextDto.userId,
      },
    });

    return {
      message: 'Contexto criado com sucesso',
      statusCode: HttpStatus.CREATED,
      data: context,
    };
  }

  async findAll() {
    const contextsFind = await this.prisma.context.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        transactions: true,
      },
    });

    if (!contextsFind || contextsFind.length === 0) {
      throw new NotFoundException('Nenhum contexto encontrado');
    }
    return {
      message: 'Contextos encontrados com sucesso',
      statusCode: HttpStatus.OK,
      data: contextsFind,
    };
  }

  async findOne(id: string) {
    const isContexntExists = await this.prisma.context.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        categories: true,
        transactions: true,
      },
    });

    if (!isContexntExists) {
      throw new NotFoundException('Contexto não encontrado');
    }
    return {
      message: 'Contexto encontrado com sucesso',
      statusCode: HttpStatus.OK,
      data: isContexntExists,
    };
  }

  async update(id: string, updateContextDto: UpdateContextDto) {
    await this.findContextById(id);

    const updatedContext = await this.prisma.context.update({
      where: {
        id,
      },
      data: {
        name: updateContextDto.name,
        color: updateContextDto.color || undefined,
        icon: updateContextDto.icon || undefined,
      },
    });

    return {
      message: 'Contexto atualizado com sucesso',
      statusCode: HttpStatus.OK,
      data: updatedContext,
    };
  }

  async remove(id: string) {
    await this.findContextById(id);

    await this.prisma.context.delete({
      where: {
        id,
      },
    });
    return {
      message: 'Contexto removido com sucesso',
      statusCode: HttpStatus.OK,
    };
  }

  async findContextByUserAndName(userId: string, name: string) {
    const isContexntExists = await this.prisma.context.findFirst({
      where: {
        userId,
        name: name.toLocaleLowerCase(),
      },
    });
    if (isContexntExists) {
      throw new ConflictException(
        'Já existe um contexto com esse nome para esse usuário',
      );
    }
  }

  async findContextById(id: string) {
    if (!id || id.trim() === '') {
      throw new NotFoundException('ID do contexto não pode ser vazio');
    }
    const isContexntExists = await this.prisma.context.findUnique({
      where: {
        id,
      },
    });
    if (!isContexntExists) {
      throw new NotFoundException('Contexto não encontrado');
    }
    return isContexntExists;
  }
}
