import { SalePostSearchBodyInterface } from './SalePostSearchBody.interface';

export interface SalePostSearchResultInterface {
  hits: {
    total: number;
    hits: Array<{
      _source: SalePostSearchBodyInterface;
    }>;
  };
}
