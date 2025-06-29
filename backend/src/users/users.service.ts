import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isExists = await this.findByEmail(createUserDto.email);

    if (isExists) {
      throw new ConflictException('Usuário já cadastrado com esse e-mail');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: createUserDto.name,
        email: createUserDto.email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      message: 'Usuário criado com sucesso',
      statusCode: HttpStatus.CREATED,
      data: user,
    };
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!users || users.length === 0) {
      throw new NotFoundException('Nenhum usuário encontrado');
    }

    return {
      message: 'Usuários encontrados com sucesso',
      statusCode: HttpStatus.OK,
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.findById(id); // já lança 404 se não encontrar

    return {
      message: 'Usuário encontrado com sucesso',
      statusCode: HttpStatus.OK,
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.findById(id); // lança 404 se não existir
    console.log('Atualizando usuário:', id, updateUserDto);

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      message: 'Usuário atualizado com sucesso',
      statusCode: HttpStatus.OK,
      data: updatedUser,
    };
  }

  async remove(id: string) {
    await this.findById(id);

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: 'Usuário removido com sucesso',
      statusCode: HttpStatus.OK,
    };
  }


  private async findByEmail(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return Boolean(user);
  }


  private async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
