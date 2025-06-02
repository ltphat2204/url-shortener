import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';
import { CountersModule } from 'src/counters/counters.module';

@Module({
  imports: [CountersModule],
  controllers: [UrlController],
  providers: [UrlService]
})
export class UrlModule {}
