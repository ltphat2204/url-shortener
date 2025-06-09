import { IsNotEmpty, IsUrl } from 'class-validator';

export class GetShortCodeDto {
  @IsNotEmpty()
  @IsUrl()
  destination_url: string;
}
