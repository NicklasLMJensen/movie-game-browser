import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { OmdbService } from './services/ombd.services';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly omdbService: OmdbService,
  ) {}

  @Get('/search')
  async getSearch(@Query('q') query: string) {
    if (!query) {
      return { error: 'Query parameter "q" required' };
    }
    const results = await this.omdbService.searchMovies(query);
    return {
      message: 'Found ${results.totalresults} results for "${query}"',
      data: results,
    };
  }
}
