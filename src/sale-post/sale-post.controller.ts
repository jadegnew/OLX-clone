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
} from '@nestjs/common';
import { SalePostService } from './sale-post.service';
import { CreateSalePostDto } from './dto/create-sale-post.dto';
import { UpdateSalePostDto } from './dto/update-sale-post.dto';
import RequestWithUser from 'src/interfaces/requestWithUser.interface';
import { AccessAuthenticationGuard } from 'src/auth/AccessStrategy/access.guard';

@Controller('sale-post')
export class SalePostController {
  constructor(private readonly salePostService: SalePostService) {}

  @Post('create')
  @UseGuards(AccessAuthenticationGuard)
  async create(
    @Req() req: RequestWithUser,
    @Body() createSalePostDto: CreateSalePostDto,
  ) {
    return this.salePostService.create(createSalePostDto, req.user.id);
  }

  @Get('all')
  async findAll() {
    return this.salePostService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.salePostService.findOne(+id);
  }

  @Get('s/:title')
  async findByTitle(@Param('id') title: string) {
    return this.salePostService.findByTitle(title);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSalePostDto: UpdateSalePostDto,
  ) {
    return this.salePostService.update(+id, updateSalePostDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.salePostService.remove(+id);
  }
}
