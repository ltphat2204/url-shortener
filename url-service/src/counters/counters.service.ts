import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/libs/prisma/prisma.service';

@Injectable()
export class CountersService implements OnModuleInit{
    private readonly sequenceName = 'url_counter';
    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit() {
        await this.ensureSequenceExists();
    }

    private async ensureSequenceExists() {
        const counter = await this.prisma.COUNTERS.findUnique({
            where: {id: this.sequenceName},
        });
        if (!counter) {
            await this.prisma.COUNTERS.create({
                data: {
                    id: this.sequenceName,
                    value: BigInt(0),
                },
            });
        }
    }

    async getNextValue(): Promise<bigint>{
        const update = await this.prisma.COUNTERS.update({
            where: {id: this.sequenceName},
            data: {
                value: {
                    increment: BigInt(1),
                },
            },
            select: {value: true},
        });
        return update.value;
    }
}
