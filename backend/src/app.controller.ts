import { Controller, Get, Post, Delete, Query, Param, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { OmdbService } from './services/omdb.service';
import { WatchlistService } from './services/watchlist.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly omdbService: OmdbService,
    private readonly watchlistService: WatchlistService,
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




  @Get('users/:userId/watchlist')
  async getWatchlist(@Param('userId')userId: string) {
    return this.watchlistService.list(userId);
  }


  @Post('users/:userId/watchlist')
  async addToWatchlist(
    @Param('userId') userId: string,
    @Body('imdbID') imdbID: string,
  ) {
    if (!imdbID) {
      return { error: 'imdbID is required'}
    }

    const item = await this.watchlistService.add(userId, imdbID);
    return item;
  }

  @Delete('users/:userId/watchlist/:imdbID')
  async removeFromWatchlist(
    @Param('userId') userId: string,
    @Param('imdbID') imdbID: string,
  ) {
    await this.watchlistService.remove(userId, imdbID);
    return { success: true };
  }

}
