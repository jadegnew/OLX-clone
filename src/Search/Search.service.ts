import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { PrismaService } from '../Database/prisma.service';
import { SalePostSearchResultInterface } from './SalePostSearchResult.interface';
import { SalePost } from '../Sale-post/entities/sale-post.entity';
import { SalePostSearchBodyInterface } from './SalePostSearchBody.interface';

@Injectable()
export class SearchService {
  private index = 'sales';
  constructor(
    private readonly elasticSearchService: ElasticsearchService,
    private readonly prismaService: PrismaService,
  ) {}
  async indexPost(post: SalePost) {
    return this.elasticSearchService.index({
      index: this.index,
      body: {
        id: post.id,
        title: post.title,
        description: post.description,
        userId: post.userId,
        mappings: {
          properties: {
            title: { type: 'text' },
            analyzer: 'search_analyzer',
          },
        },
        settings: {
          analysis: {
            char_filter: {
              text_char_filter: {
                type: 'mapping',
                mappings: ['Ё => ё', 'ё => е', ', => .'],
              },
            },
            analyzer: {
              search_analyzer: {
                type: 'custom',
                tokenizer: 'standard',
                filter: ['lowercase', 'single'],
                char_filter: ['text_char_filter'],
              },
            },
            filter: {
              single: {
                type: 'single',
                min_single_size: 2,
                max_single_size: 4,
              },
            },
          },
        },
      },
    });
  }
  async search(query: string) {
    const { body } =
      await this.elasticSearchService.search<SalePostSearchResultInterface>({
        index: this.index,
        body: {
          query: {
            multi_match: {
              query: query,
              fields: ['title', 'description'],
              fuzziness: 'AUTO',
            },
          },
        },
      });
    const posts = body.hits.hits;
    return posts.map((post) => post._source);
  }

  async update(post: SalePost) {
    const newBody: SalePostSearchBodyInterface = {
      id: post.id,
      title: post.title,
      description: post.description,
      userId: post.userId,
    };

    const script = Object.entries(newBody).reduce((result, [key, value]) => {
      return `${result} ctx._source.${key} = '${value}';`;
    }, '');

    return this.elasticSearchService.updateByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: post.id,
          },
        },
        script: {
          inline: script,
        },
      },
    });
  }

  async remove(postId: number) {
    this.elasticSearchService.deleteByQuery({
      index: this.index,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }
}
