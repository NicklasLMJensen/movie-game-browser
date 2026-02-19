import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { CacheService } from './cache.service';

@Injectable()
export class OmdbService {
    private omdbUrl: string;
    private apiKey: string;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
        private cacheService: CacheService,
    ) {
        this.omdbUrl = this.configService.get('OMDB_BASE_URL')!;
        this.apiKey = this.configService.get('OMDB_API_KEY')!;
    }

    async searchMovies(query: string, page: number =1): Promise<any> {
        const cacheKey = `${query}_page${page}`;

        const cached = await this.cacheService.getCached(cacheKey);
        if (cached) {
            console.log(`Cache HIT for ${cacheKey}`);
            return cached.data;
        }

        console.log(`Cache MISS for "${cacheKey}" -> now calling OMDB`);
        const omdbResponse = await firstValueFrom(
            this.httpService.get(this.omdbUrl, {
                params: {
                    s: query,
                    page: page,
                    apiKey: this.apiKey
                },
            }),
        );

        await this.cacheService.setCache(cacheKey, omdbResponse.data);
        return omdbResponse.data;
    }



    async getMovieById(imdbID: string): Promise<any> {
        const cacheKey = `details_${imdbID}`;

        const cached = await this.cacheService.getCached(cacheKey);
        if (cached) {
            console.log(`cache HIT for details ${imdbID}`);
            return cached.data;
        } 

        console.log(`Cache MISS for details ${imdbID}`);
        const response = await firstValueFrom(
            this.httpService.get(this.omdbUrl, {
                params: {
                    i: imdbID,
                    plot: `full`,
                    apiKey: this.apiKey
                },
            }),
        );

        await this.cacheService.setCache(cacheKey, response.data);
        return response.data;
    }
}