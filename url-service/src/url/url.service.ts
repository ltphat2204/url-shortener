import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma, short_url } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateShortCode } from 'src/utils/nanoid.util';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class UrlService {
    constructor(private readonly prisma: PrismaService) { }

    async createShortUrl(createUrlDto: CreateUrlDto): Promise<string> {
        const MAX_RETRIES = 5;
        let retries = 0;
        while (retries < MAX_RETRIES) {
            try {
                // Generate a unique short code
                const shortCode = generateShortCode();

                // Create the short URL in the database
                const newShortRecord = await this.prisma.short_url.create({
                    data: {
                        title: createUrlDto.title ?? '',
                        description: createUrlDto.description ?? '',
                        destination_url: createUrlDto.destination_url,
                        short_code: shortCode,
                        user_id: createUrlDto.user_id,
                    }
                });
                const fullShortUrl = `${process.env.REDIRECT_SERVICE_URL}${shortCode}`;
                return fullShortUrl;
            } catch (error) {
                if (
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === 'P2002'
                ) {
                    retries++;
                } else {

                    throw new InternalServerErrorException('An unexpected error occurred while creating the short URL.');
                }
            }
        }
        throw new InternalServerErrorException(
            'Could not create a unique short URL after multiple retries.',
        );
    }

    async getUrlByShortCode(shortCode: string): Promise<string> {
        const url = await this.prisma.short_url.findUnique({
            where: { short_code: shortCode },
        })
        if (!url) {
            throw new NotFoundException(`Short code "${shortCode}" not found.`);
        }
        return url.destination_url;
    }

    async getShortCode(destination_url: string): Promise<string> {
        const shortUrlRecord = await this.prisma.short_url.findFirst({
            where: { destination_url: destination_url },
        });
        if (!shortUrlRecord) {
            throw new NotFoundException(`Destination URL not found.`);
        }
        const fullShortUrl = `${process.env.REDIRECT_SERVICE_URL}${shortUrlRecord.short_code}`;
        return fullShortUrl;
    }

    async getUrlsByUserId(userId: number, paginationQuery: PaginationQueryDto) {
        const page = paginationQuery.page ? paginationQuery.page : 1;
        const limit = paginationQuery.limit ? paginationQuery.limit : 10;
        const skip = (page! - 1) * limit!;
        const [urlRecords, totalCount] = await this.prisma.$transaction([
            this.prisma.short_url.findMany({
                where: { user_id: userId },
                take: limit,
                skip: skip,
                orderBy: { create_at: 'desc' },
            }),
            this.prisma.short_url.count({
                where: { user_id: userId },
            }),
        ]);
        const totalPages = Math.ceil(totalCount / limit!);
        return {
            data: urlRecords,
            meta: {
                totalItems: totalCount,
                itemsPerPage: limit,
                currentPage: page,
                totalPages: totalPages,
            },
            
        }
    }
    async deleteShortUrl(shortCode: string): Promise < void> {
            try {
                await this.prisma.short_url.delete({
                    where: { short_code: shortCode },
                });
            } catch(error) {
                if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                    throw new NotFoundException(`Short code "${shortCode}" not found to delete.`);
                }
                throw error;
            }
        }
    }


