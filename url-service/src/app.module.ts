import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibsModule } from './libs/libs.module';
import { UrlController } from './url/url.controller';
import { UrlModule } from './url/url.module';
import { CountersModule } from './counters/counters.module';

@Module({
  imports: [LibsModule, UrlModule, CountersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
