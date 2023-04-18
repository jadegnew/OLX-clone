import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  UploadedFile,
} from '@nestjs/common';
import { SalePostService } from './sale-post.service';
import { CreateSalePostDto } from './DTOS/create-sale-post.dto';
import { UpdateSalePostDto } from './DTOS/update-sale-post.dto';
import RequestWithUser from 'src/Interfaces/requestWithUser.interface';
import { AccessAuthenticationGuard } from 'src/Auth/Strategies/AccessStrategy/access.guard';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

//TODO save files in folder
@ApiTags('SalePost')
@Controller('Sale-post')
export class SalePostController {
  constructor(private readonly salePostService: SalePostService) {}
  @Post('create')
  @UseGuards(AccessAuthenticationGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createSalePostDto: CreateSalePostDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.salePostService.create(createSalePostDto, req.user.id, file);
  }

  @Get('all')
  async findAll(@Req() req: Request) {
    return this.salePostService.findAll();
  }

  @Get(':id')
  async findOn(@Param('id') id: string) {
    return this.salePostService.findOne(+id);
  }

  @Get('s/:title')
  async findByTitle(@Param('title') title: string) {
    return this.salePostService.findByTitle(title);
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() updateSalePostDto: UpdateSalePostDto,
  ) {
    return this.salePostService.update(+id, updateSalePostDto);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string) {
    return this.salePostService.remove(+id);
  }
}
