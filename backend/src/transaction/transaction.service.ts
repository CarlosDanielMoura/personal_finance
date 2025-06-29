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

  findAll() {
    return `This action returns all transaction`;
  }

  findOne(id: string) {
    return `This action returns a #${id} transaction`;
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return `This action updates a #${id} transaction`;
  }

  remove(id: string) {
    return `This action removes a #${id} transaction`;
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
}
