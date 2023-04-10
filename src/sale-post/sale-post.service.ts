import { Injectable } from '@nestjs/common';
import { CreateSalePostDto } from './dto/create-sale-post.dto';
import { UpdateSalePostDto } from './dto/update-sale-post.dto';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class SalePostService {
  constructor(private readonly prismaService: PrismaService) {}
  //TODO add lazy loading to fetch request
  //TODO complete requests
  //TODO add error handling
  //TODO add image handling

  async create(
    { title, description, location, price, phone }: CreateSalePostDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    return this.prismaService.salePost.create({
      data: {
        title,
        description,
        location,
        price,
        phone,
        userId,
      },
    });
  }

  async findAll() {
    return this.prismaService.salePost.findMany({ take: 50 });
  }

  async findOne(id: number) {
    return this.prismaService.salePost.update({
      where: {
        id,
      },
      data: {
        viewsCount: {
          increment: 1,
        },
      },
    });
  }

  //TODO rewrite logic. mb elastic search?
  async findByTitle(title: string) {
    return this.prismaService.salePost.findMany({
      where: {
        title: {
          contains: title,
        },
      },
    });
  }

  async update(id: number, updateSalePostDto: UpdateSalePostDto) {
    return this.prismaService.salePost.update({
      where: {
        id,
      },
      data: {
        ...updateSalePostDto,
      },
    });
  }

  async remove(id: number) {
    return this.prismaService.salePost.delete({
      where: {
        id,
      },
    });
  }
}
