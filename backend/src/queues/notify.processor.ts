import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class NotifyProcessor implements OnModuleInit, OnModuleDestroy {
  private worker: Worker;

  async onModuleInit() {
    this.worker = new Worker(
      'notify',
      async (job: Job) => {
        console.log(`📢 Notify Job executed: Ticket ${job.data.ticketId}`);
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
