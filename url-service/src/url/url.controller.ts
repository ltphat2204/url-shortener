import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { GetShortCodeDto } from './dto/get-short-code.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post()
  async createShortUrl(@Body() createUrlDto: CreateUrlDto) {
    console.log('Creating short URL with data:', createUrlDto);
    const result = await this.urlService.createShortUrl(createUrlDto);
    return result;
  }

  @Get(':shortCode')
  async getByShortCode(@Param('shortCode') shortCode: string) {
    console.log('New request to get URL by short code:', shortCode);
    const result = await this.urlService.getUrlByShortCode(shortCode);
    const responseData = {
      short_url_id: result.id, // Giả sử id trong DB là short_url_id
      title: result.title,
      description: result.description,
      short_code: result.short_code,
      destination_url: result.destination_url,
      user_id: result.user_id,
      created_at: result.create_at,
    };
    return {
      data: responseData,
    };
  }

  @Post('getShortCode')
  // This endpoint is used to get the short code for a given destination URL
  async getShortCode(@Body() getShortCodeDto: GetShortCodeDto) {
    const result = await this.urlService.getShortCode(
      getShortCodeDto.destination_url,
    );
    return result;
  }

  @Get('user/:userId')
  async getUrlsByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    const result = await this.urlService.getUrlsByUserId(
      userId,
      paginationQuery,
    );
    return result;
  }

  @Delete(':shortCode')
  async deleteShortUrl(@Param('shortCode') shortCode: string): Promise<void> {
    await this.urlService.deleteShortUrl(shortCode);
  }
}
