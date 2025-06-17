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
import { RedisService } from 'src/redis/redis.service';

@Controller('url')
export class UrlController {
  constructor(
    private readonly urlService: UrlService,
    private readonly redisService: RedisService,
  ) {}

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
    @Query('limit') limitQuery?: string,
    @Query('page') pageQuery?: string,
    @Query('sortBy')
    sortBy?: 'short_code' | 'create_at' | 'title' | 'destination_url',
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
    @Query('search') search?: string,
  ) {
    // Set default values for pagination and sorting
    const limit = limitQuery ? Number(limitQuery) : 10;
    const page = pageQuery ? Number(pageQuery) : 1;
    const finalSortBy = sortBy || 'create_at'; // Default sort by creation date
    const finalSortOrder = sortOrder || 'desc'; // Default to descending order

    // Pass all parameters to the service layer
    const result = await this.urlService.getUrlsByUserId(
      userId,
      page,
      limit,
      finalSortBy,
      finalSortOrder,
      search,
    );
    return result;
  }

  @Delete(':shortCode')
  async deleteShortUrl(@Param('shortCode') shortCode: string): Promise<void> {
    await this.urlService.deleteShortUrl(shortCode);
    await this.redisService.del(`urlinfo:${shortCode}`); // Clear cache for the deleted URL
  }
}
