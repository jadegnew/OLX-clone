import { Injectable } from '@nestjs/common';
import { CreateSalePostDto } from './dto/create-sale-post.dto';
import { UpdateSalePostDto } from './dto/update-sale-post.dto';
import { PrismaService } from 'src/database/prisma.service';
import { Logger } from '../logger/logger.service';

@Injectable()
export class SalePostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly logger: Logger,
  ) {}
  //TODO complete requests
  //TODO add error handling
  //TODO add receiving and saving images

  async create(
    { title, description, location, price, phone }: CreateSalePostDto,
    userId: number,
    file?: Express.Multer.File,
  ) {
    try {
      const salepost = await this.prismaService.salePost.create({
        data: {
          title,
          description,
          location,
          price,
          phone,
          userId,
        },
      });
      this.logger.log(`SalePost with id ${salepost.id} created`);
      return salepost;
    } catch (e) {
      this.logger.error('Error while creating salepost', e);
    }
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

  //TODO rewrite logic. mb elastic search || full text search in db?
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
    try {
      const updatedPost = await this.prismaService.salePost.update({
        where: {
          id,
        },
        data: {
          ...updateSalePostDto,
        },
      });
      this.logger.log(`SalePost with id ${updatedPost.id} updated`);
      return updatedPost;
    } catch (e) {
      this.logger.error('Error while updating salepost', e);
    }
  }

  async remove(id: number) {
    try {
      const deletedPost = await this.prismaService.salePost.delete({
        where: {
          id,
        },
      });
      this.logger.log(`SalePost with id ${deletedPost.id} deleted`);
      return deletedPost;
    } catch (e) {
      this.logger.error('Error while deleting salepost', e);
    }
  }
}
