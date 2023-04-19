import { Injectable } from '@nestjs/common';
import { CreateSalePostDto } from './DTOS/create-sale-post.dto';
import { UpdateSalePostDto } from './DTOS/update-sale-post.dto';
import { PrismaService } from 'src/Database/prisma.service';
import { Logger } from '../Logger/Logger.service';
import { SearchService } from '../Search/Search.service';

@Injectable()
export class SalePostService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly searchService: SearchService,
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
      await this.searchService.indexPost(salepost);
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
    const results = await this.searchService.search(title);
    if (!results.length || typeof results == 'undefined') return [];
    const ids = results
      .map((result) => {
        return +result.id;
      })
      .filter((id) => id !== undefined);
    if (!ids.length) return [];
    return this.prismaService.salePost.findMany({
      where: {
        id: { in: ids as number[] },
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
      await this.searchService.update(updatedPost);
      this.logger.log(`SalePost with id ${updatedPost.id} updated`);
      return updatedPost;
    } catch (e) {
      this.logger.error('Error while updating salepost', e);
    }
  }

  async remove(id: number) {
    try {
      const post = await this.findOne(id);
      if (!post) return 'Post not found';
      const deletedPost = await this.prismaService.salePost.delete({
        where: {
          id,
        },
      });
      await this.searchService.remove(id);
      this.logger.log(`SalePost with id ${deletedPost.id} deleted`);
      return 'Post deleted!';
    } catch (e) {
      this.logger.error('Error while deleting salepost', e);
      return 'Error while deleting post';
    }
  }
}
