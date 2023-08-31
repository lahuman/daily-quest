import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class MemberDto {

    @ApiProperty({ description: 'seq', })
    @IsOptional()
    @IsNumber()
    seq: number;


    @ApiProperty({ description: '이름', required: true })
    @IsNotEmpty()
    @IsString()
    name: string;

}