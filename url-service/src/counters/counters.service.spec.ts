import { Test, TestingModule } from '@nestjs/testing';
import { CountersService } from './counters.service';

describe('CountersService', () => {
  let service: CountersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CountersService],
    }).compile();

    service = module.get<CountersService>(CountersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
