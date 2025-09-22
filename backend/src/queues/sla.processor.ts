import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';
import { DataSource } from 'typeorm';
import { Ticket } from '../tickets/ticket.entity';

@Injectable()
export class SlaProcessor implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    this.worker = new Worker(
      'sla',
      async (job: Job) => {
        const ticketId = job.data.ticketId;

        const repo = this.dataSource.getRepository(Ticket);
        const ticket = await repo.findOne({ where: { id: ticketId } });

        if (!ticket) {
          console.warn(`⚠️ SLA job: Ticket ${ticketId} not found`);
          return;
        }

        if (ticket.status === 'OPEN') {
          ticket.status = 'IN_PROGRESS';
          await repo.save(ticket);
          console.log(`⏰ SLA triggered → Ticket #${ticketId} moved to IN_PROGRESS`);
        } else {
          console.log(`ℹ️ SLA job: Ticket #${ticketId} already ${ticket.status}, no action`);
        }
      },
      {
        connection: new IORedis({
          host: 'localhost',
          port: 6379,
          maxRetriesPerRequest: null,
        }),
      },
    );
  }

  async onModuleDestroy() {
    await this.worker.close();
  }
}
