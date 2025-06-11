import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketController } from './ticket/ticket.controller';

@Module({
  imports: [],
  controllers: [AppController, TicketController],
  providers: [AppService],
})
export class AppModule {}
