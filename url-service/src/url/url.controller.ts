import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
import { UrlService } from './url.service';
import { short_url } from '@prisma/client';
import { CreateUrlDto } from './dto/create-url.dto';
import { GetShortCodeDto } from './dto/get-short-code.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('urls')
export class UrlController {
    constructor(private readonly urlService: UrlService) {}

    @Post()
    async createShortUrl(@Body() createUrlDto: CreateUrlDto): Promise<string>{
        console.log('Creating short URL with data:', createUrlDto);
        const result = await this.urlService.createShortUrl(createUrlDto);
        return result;
    }

    @Get(':shortCode')
    async getByShortCode(@Param('shortCode') shortCode: string): Promise<string> {
        const result = await this.urlService.getUrlByShortCode(shortCode);
        return result;
    }

    @Post('getShortCode')
    // This endpoint is used to get the short code for a given destination URL
    async getShortCode(@Body() getShortCodeDto: GetShortCodeDto): Promise<string> {
        const result = await this.urlService.getShortCode(getShortCodeDto.destination_url);
        return result;
    }



    @Get("user/:userId")
    async getUrlsByUserId(
        @Param('userId', ParseIntPipe) userId: number,
        @Query() paginationQuery: PaginationQueryDto,
        ) {
        const result = await this.urlService.getUrlsByUserId(userId, paginationQuery);
        return result;
    }
    
    @Delete(':shortCode')
    async deleteShortUrl(@Param('shortCode') shortCode: string): Promise<void> {
        await this.urlService.deleteShortUrl(shortCode);
    }
}
