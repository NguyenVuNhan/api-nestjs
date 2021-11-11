import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/guard/jwtAuthentication.guard';
import EmailScheduleDto from './dto/email-schedule.dto';
import { EmailSchedulingService } from './email-scheduling.service';

@Controller('email-scheduling')
export class EmailSchedulingController {
  constructor(
    private readonly emailSchedulingService: EmailSchedulingService,
  ) {}

  @Post('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async scheduleEmail(@Body() emailSchedule: EmailScheduleDto) {
    this.emailSchedulingService.scheduleEmail(emailSchedule);
  }

  @Delete('schedule')
  @UseGuards(JwtAuthenticationGuard)
  async cancelAllScheduledEmails() {
    this.emailSchedulingService.cancelAllScheduledEmails();
  }
}
