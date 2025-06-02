import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
    @IsNotEmpty()
    @IsUrl({}, { message: 'Please provide a valid URL.' })
    destination_url: string;

    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    description?: string;
    
    @IsNotEmpty()
    @IsNumber()
    user_id: number;
}