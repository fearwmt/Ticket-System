import { Controller, Get, Query, Post, Body, Param, Patch, Delete } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.create(dto);
  }

  @Get()
  findAll(
    @Query('status') status?: string,
    @Query('priority') priority?: string,
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 5,
    @Query('sortBy') sortBy: string = 'id',
    @Query('sortOrder') sortOrder: 'ASC' | 'DESC' = 'ASC',
  ) {
    return this.ticketsService.findAll({
      status,
      priority,
      search,
      page: Number(page),
      pageSize: Number(pageSize),
      sortBy,
      sortOrder,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ticketsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
    return this.ticketsService.update(+id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ticketsService.remove(+id);
  }
}
