import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { Ticket } from './ticket.entity';
import { QueuesModule } from '../queues/queues.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Ticket]),
    QueuesModule, 
  ],
  controllers: [TicketsController],
  providers: [TicketsService],
})
export class TicketsModule {}
