import { Controller, Get, Query, Param } from '@nestjs/common';
import { AppService } from './app.service';
import { OmdbService } from './services/omdb.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly omdbService: OmdbService,
  ) {}

  @Get('/search')
  async getSearch(@Query('q') query: string, @Query('page') page?: string,) {
    if (!query) {
      return { error: 'Query parameter "q" required' };
    }
    const pageNum = parseInt(page || '1', 10);
    return this.omdbService.searchMovies(query, pageNum);
  }

  @Get(`movie/:imdbID`)
  getMovieById(@Param(`imdbID`) imdbID: string) {
    return this.omdbService.getMovieById(imdbID);
  }
}
