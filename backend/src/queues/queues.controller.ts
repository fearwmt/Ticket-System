import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { QueueService } from './queue.service';

@Controller('admin/queues')
export class QueuesController {
  constructor(private readonly queueService: QueueService) {}

  @Get(':name/stats')
  async getStats(@Param('name') name: string) {
    const queue = this.queueService.getQueue(name);
    if (!queue) {
      throw new BadRequestException(
        'Queue name must be either "notify" or "sla"',
      );
    }

    const counts = await queue.getJobCounts(
      'waiting',
      'active',
      'completed',
      'failed',
      'delayed',
    );

    return {
      queue: name,
      ...counts,
    };
  }

  @Get()
  async listQueues() {
    return Object.keys(this.queueService.getAllQueues());
  }
}
