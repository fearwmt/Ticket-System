import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Queue, Worker, Job, QueueEvents } from 'bullmq';
import IORedis from 'ioredis';

@Injectable()
export class QueueService implements OnModuleInit, OnModuleDestroy {
  private connection: IORedis;
  private queues: Record<string, Queue> = {};
  private workers: Worker[] = [];
  private events: QueueEvents[] = [];

  async onModuleInit() {
    this.connection = new IORedis({
      host: 'localhost',
      port: 6379,
      maxRetriesPerRequest: null,
    });

    const notifyQueue = new Queue('notify', { connection: this.connection });
    const notifyWorker = new Worker(
      'notify',
      async (job: Job) =>
        console.log(`📢 Notify Job executed: Ticket ${job.data.ticketId}`),
      { connection: this.connection },
    );
    const notifyEvents = new QueueEvents('notify', {
      connection: this.connection,
    });
    notifyEvents.on('failed', ({ jobId, failedReason }) =>
      console.error(`❌ Notify Job ${jobId} failed: ${failedReason}`),
    );

    const slaQueue = new Queue('sla', { connection: this.connection });
    const slaWorker = new Worker(
      'sla',
      async (job: Job) =>
        console.log(`⏰ SLA Job executed: Ticket ${job.data.ticketId}`),
      { connection: this.connection },
    );
    const slaEvents = new QueueEvents('sla', { connection: this.connection });
    slaEvents.on('failed', ({ jobId, failedReason }) =>
      console.error(`❌ SLA Job ${jobId} failed: ${failedReason}`),
    );

    this.queues['notify'] = notifyQueue;
    this.queues['sla'] = slaQueue;
    this.workers.push(notifyWorker, slaWorker);
    this.events.push(notifyEvents, slaEvents);
  }

  async onModuleDestroy() {
    for (const q of Object.values(this.queues)) {
      await q.close();
    }
    for (const w of this.workers) {
      await w.close();
    }
    for (const e of this.events) {
      await e.close();
    }
    await this.connection.quit();
  }

  async addNotifyJob(ticketId: number) {
    await this.queues['notify'].add(
      'notify',
      { ticketId },
      {
        jobId: `notify_${ticketId}`,
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
      },
    );
  }

  async addSlaJob(ticketId: number) {
    await this.queues['sla'].add(
      'sla',
      { ticketId },
      {
        jobId: `sla_${ticketId}`,
        delay: 15 * 60 * 1000, // 15 นาที
      },
    );
  }

  async removeSlaJob(ticketId: number) {
    await this.queues['sla'].remove(`sla_${ticketId}`);
  }

  async getStats(name: 'notify' | 'sla') {
    const queue = this.queues[name];
    if (!queue) return null;
    return queue.getJobCounts('waiting', 'active', 'completed', 'failed', 'delayed');
  }

  getQueue(name: string) {
    return this.queues[name];
  }

  getAllQueues() {
    return this.queues;
  }
}
