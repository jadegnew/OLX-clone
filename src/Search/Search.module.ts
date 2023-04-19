import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { SearchService } from './Search.service';
import { PrismaService } from '../Database/prisma.service';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      useFactory: () => ({
        node: 'http://localhost:9200',
      }),
    }),
  ],
  providers: [SearchService, PrismaService],
  exports: [SearchService],
})
export class SearchModule {}
