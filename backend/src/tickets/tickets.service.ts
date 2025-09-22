import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Ticket } from './ticket.entity';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { QueueService } from '../queues/queue.service';

@Injectable()
export class TicketsService {
  constructor(
    @InjectRepository(Ticket) private repo: Repository<Ticket>,
    private readonly queueService: QueueService,
  ) {}

  async create(dto: CreateTicketDto) {
    const ticket = this.repo.create(dto);
    await this.repo.save(ticket);

    await this.queueService.addNotifyJob(ticket.id);
    await this.queueService.addSlaJob(ticket.id);

    return ticket;
  }

  /**
   *  
   */
  async findAll(filter: {
    status?: string;
    priority?: string;
    search?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const {
      status,
      priority,
      search,
      page = 1,
      pageSize = 5,
      sortBy = 'id',
      sortOrder = 'ASC',
    } = filter;

    const where: any = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.title = Like(`%${search}%`);
    }

    const [data, total] = await this.repo.findAndCount({
      where,
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: number) {
    const ticket = await this.repo.findOne({ where: { id } });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return ticket;
  }

  async update(id: number, dto: UpdateTicketDto) {
    const ticket = await this.findOne(id);
    Object.assign(ticket, dto);
    await this.repo.save(ticket);

    if (dto.status === 'RESOLVED') {
      await this.queueService.removeSlaJob(id);
    }

    return ticket;
  }

  async remove(id: number) {
    const ticket = await this.findOne(id);
    return this.repo.remove(ticket);
  }
}
