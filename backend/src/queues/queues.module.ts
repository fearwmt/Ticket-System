import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueuesController } from './queues.controller';
import { SlaProcessor } from './sla.processor';
import { NotifyProcessor } from './notify.processor';

@Module({
  providers: [QueueService, SlaProcessor, NotifyProcessor],
  controllers: [QueuesController],
  exports: [QueueService],
})
export class QueuesModule {}
