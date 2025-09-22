import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TicketsModule } from './tickets/tickets.module';
import { QueuesModule } from './queues/queues.module';  

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    TicketsModule,
    QueuesModule,
  ],
})
export class AppModule {}
