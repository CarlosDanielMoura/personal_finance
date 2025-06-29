import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(private prisma: PrismaClient) {}
  async create(createTransactionDto: CreateTransactionDto) {
    await this.findTransactionByUserAndDateAndAmount(
      createTransactionDto.userId,
      createTransactionDto.date,
      createTransactionDto.amount,
    );

    const transaction = await this.prisma.transaction.create({
      data: {
        ...createTransactionDto,
      },
    });

    return {
      message: 'Transação criada com sucesso',
      statusCode: HttpStatus.CREATED,
      transaction,
    };
  }

  async findAll() {
    const transactions = await this.prisma.transaction.findMany({
      include: {
        user: true,
        category: true,
      },
    });
    if (!transactions || transactions.length === 0) {
      throw new ConflictException('Nenhuma transação encontrada');
    }

    return {
      message: 'Uma transação encontrada',
      statusCode: HttpStatus.OK,
      data: transactions,
    };
  }

  async findOne(id: string) {
    await this.findTransactionById(id);

    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });

    return {
      message: 'Transação encontrada com sucesso',
      statusCode: HttpStatus.OK,
      data: transaction,
    };
  }

  async update(id: string, updateTransactionDto: UpdateTransactionDto) {
    await this.findTransactionByUserAndDateAndAmount(
      updateTransactionDto.userId as string,
      updateTransactionDto.date as Date,
      updateTransactionDto.amount as number,
    );
    await this.findTransactionById(id);

    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateTransactionDto,
      },
    });

    return {
      message: 'Transação atualizada com sucesso',
      statusCode: HttpStatus.OK,
      data: transaction,
    };
  }

  async remove(id: string) {
    await this.findTransactionById(id);

    await this.prisma.transaction.delete({
      where: { id },
    });

    return {
      message: 'Transação removida com sucesso',
      statusCode: HttpStatus.OK,
    };
  }

  private async findTransactionByUserAndDateAndAmount(
    userId: string,
    date: Date,
    amount: number,
  ) {
    const isExistsTransatcion = await this.prisma.transaction.findFirst({
      where: {
        userId,
        date,
        amount,
      },
    });

    if (isExistsTransatcion) {
      throw new ConflictException(
        'Já existe uma transação com o mesmo usuário, data e valor.',
      );
    }

    return isExistsTransatcion;
  }

  private async findTransactionById(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });

    if (!transaction) {
      throw new ConflictException('Transação não encontrada');
    }

    return transaction;
  }
}
