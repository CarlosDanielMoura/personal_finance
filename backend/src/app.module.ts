import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TransactionModule } from './transaction/transaction.module';
import { CategoryModule } from './category/category.module';
import { ContextModule } from './context/context.module';

@Module({
  imports: [UsersModule, TransactionModule, CategoryModule, ContextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
