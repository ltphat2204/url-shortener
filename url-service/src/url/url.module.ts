import { Module } from '@nestjs/common';
import { UrlController } from './url.controller';
import { UrlService } from './url.service';

@Module({
  imports: [],
  controllers: [UrlController],
  providers: [UrlService],
})
export class UrlModule {}
