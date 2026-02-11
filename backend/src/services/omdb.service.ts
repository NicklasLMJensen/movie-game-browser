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

    async searchMovies(query: string): Promise<any> {
        const cached = await this.cacheService.getCached(query);
        if (cached) {
            console.log('Cache HIT for "${query}"');
            return cached.data;
        }
        console.log('Cache MISS for "${query}" -> now calling OMDB');
        const omdbResponse = await firstValueFrom(
            this.httpService.get(this.omdbUrl, {
            params: { s: query, apiKey: this.apiKey },
            }),
        );
        await this.cacheService.setCache(query, omdbResponse.data)

        return omdbResponse.data;
    }
}