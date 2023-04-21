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
  Query,
} from '@nestjs/common';
import { SalePostService } from './sale-post.service';
import { CreateSalePostDto } from './DTOS/create-sale-post.dto';
import { UpdateSalePostDto } from './DTOS/update-sale-post.dto';
import RequestWithUser from 'src/Interfaces/requestWithUser.interface';
import { AccessAuthenticationGuard } from 'src/Auth/Strategies/AccessStrategy/access.guard';
import { ApiTags } from '@nestjs/swagger';

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

  @Get()
  async getPosts(@Query('search') search: string) {
    if (search) {
      return this.salePostService.findByTitle(search);
    }
    return this.salePostService.findAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string) {
    return this.salePostService.getOneById(+id);
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
