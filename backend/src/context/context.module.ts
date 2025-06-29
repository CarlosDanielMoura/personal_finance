import { Module } from '@nestjs/common';
import { ContextService } from './context.service';
import { ContextController } from './context.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [ContextController],
  providers: [ContextService, PrismaClient],
})
export class ContextModule {}
