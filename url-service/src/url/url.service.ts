import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/libs/prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { generateShortCode } from 'src/utils/nanoid.util';

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) {}

  async createShortUrl(createUrlDto: CreateUrlDto) {
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
          },
        });
        const fullShortUrl = `${process.env.REDIRECT_SERVICE_URL}${shortCode}`;
        return {
          new_short_record: {
            id: newShortRecord.id,
            title: newShortRecord.title,
            description: newShortRecord.description,
            destination_url: newShortRecord.destination_url,
            short_url: fullShortUrl,
            user_id: newShortRecord.user_id,
          },
        };
      } catch (error) {
        console.error('Error creating short URL:', error);
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          retries++;
        } else {
          throw new InternalServerErrorException(
            'An unexpected error occurred while creating the short URL.',
          );
        }
      }
    }
    throw new InternalServerErrorException(
      'Could not create a unique short URL after multiple retries.',
    );
  }

  async getUrlByShortCode(shortCode: string) {
    const url = await this.prisma.short_url.findUnique({
      where: { short_code: shortCode },
    });
    if (!url) {
      throw new NotFoundException(`Short code "${shortCode}" not found.`);
    }
    return url;
  }

  async getShortCode(destination_url: string) {
    const shortUrlRecord = await this.prisma.short_url.findFirst({
      where: { destination_url: destination_url },
    });
    if (!shortUrlRecord) {
      throw new NotFoundException(`Destination URL not found.`);
    }
    const fullShortUrl = `${process.env.REDIRECT_SERVICE_URL}${shortUrlRecord.short_code}`;
    return {
      short_code: shortUrlRecord,
      full_short_url: fullShortUrl,
    };
  }

  async getUrlsByUserId(
    userId: number,
    page: number,
    limit: number,
    sortBy: 'short_code' | 'create_at' | 'title' | 'destination_url',
    sortOrder: 'asc' | 'desc',
    search?: string,
  ) {
    const skip = (page - 1) * limit;

    // 1. Define the base WHERE clause
    let where: Prisma.short_urlWhereInput = {
      user_id: userId,
    };

    // 2. Add search conditions if a search term is provided
    if (search) {
      where.AND = [ // Use AND to combine with the user_id requirement
        {
          OR: [
            {
              title: {
                contains: search,
                mode: 'insensitive', // Case-insensitive search
              },
            },
            {
              description: {
                contains: search,
                mode: 'insensitive',
              },
            },
            {
              short_code: {
                contains: search,
                mode: 'insensitive',
              },
            },
          ],
        },
      ];
    }
    
    // 3. Define the ORDER BY clause dynamically
    const orderBy: Prisma.short_urlOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    // 4. Execute both queries in a transaction
    //    It's crucial to use the same `where` clause for both findMany and count
    const [urlRecords, totalCount] = await this.prisma.$transaction([
      this.prisma.short_url.findMany({
        where, // Use the dynamically built where clause
        take: limit,
        skip: skip,
        orderBy, // Use the dynamically built orderBy clause
      }),
      this.prisma.short_url.count({
        where, // Use the same where clause for an accurate count
      }),
    ]);

    // 5. Calculate pagination metadata and return the final structure
    const totalPages = Math.ceil(totalCount / limit);

    return {
      data: urlRecords,
      meta: {
        totalItems: totalCount,
        itemsPerPage: limit,
        currentPage: page,
        totalPages: totalPages,
      },
    };
  }
  
  async deleteShortUrl(shortCode: string): Promise<void> {
    try {
      await this.prisma.short_url.delete({
        where: { short_code: shortCode },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(
          `Short code "${shortCode}" not found to delete.`,
        );
      }
      throw error;
    }
  }
}
