import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, SHORT_URL } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { CountersService } from 'src/counters/counters.service';
import { toBase62 } from 'src/utils/base62.util';

@Injectable()
export class UrlService {
    constructor(private readonly prisma: PrismaService, private readonly countersService: CountersService) {}
    
    async createShortUrl(createUrlDto: CreateUrlDto): Promise<SHORT_URL> {
        const existingUrl = await this.prisma.SHORT_URL.findUnique({
            where: { destination_url: createUrlDto.destination_url },
        });
        if( existingUrl ) {
            return existingUrl;
        }
        
        const sequence = await this.countersService.getNextValue();

        const shortUrl = toBase62(Number(sequence));

        const newShortCode = await this.prisma.SHORT_URL.create({
            data:{
                title: createUrlDto.title ?? '',
                description: createUrlDto.description?? '',
                destination_url: createUrlDto.destination_url,
                short_code: shortUrl,
                user_id: createUrlDto.user_id,
            }
        })
        return newShortCode;
    }

    async getUrlByShortCode(shortCode: string): Promise<string> {
        const url = await this.prisma.SHORT_URL.findUnique({
            where: {short_code: shortCode},
        })
        if (!url) {
            throw new NotFoundException(`Short code "${shortCode}" not found.`);
        }
        return url.destination_url;
    }

    async getShortCode(destination_url: string): Promise<SHORT_URL> {
        const shortUrl= await this.prisma.SHORT_URL.findUnique({
            where: { destination_url: destination_url },
        });
        if (!shortUrl) {
            throw new NotFoundException(`Destination URL not found.`);
        }
        return shortUrl;
    }

    async getUrlsByUserId(userId: number): Promise<SHORT_URL[]> {
        const urls = await this.prisma.SHORT_URL.findMany({
            where: { user_id: userId },
        });
        return urls;
    }
    async deleteShortUrl(shortCode: string): Promise<void> {
        try {
            await this.prisma.SHORT_URL.delete({
                where: { short_code: shortCode },
            });
        } catch (error) {
            // Bắt lỗi của Prisma khi không tìm thấy record để xóa
            // highlight-start
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Short code "${shortCode}" not found to delete.`);
            }
            throw error;
        }
    }
}


