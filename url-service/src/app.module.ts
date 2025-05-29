import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibsModule } from './libs/libs.module';

@Module({
  imports: [LibsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
