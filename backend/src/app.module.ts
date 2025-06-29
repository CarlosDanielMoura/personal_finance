import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ContextModule } from './context/context.module';


@Module({
  imports: [UsersModule, CategoryModule, ContextModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
