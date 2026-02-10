import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OmdbService {
    private omdbUrl: string;
    private apiKey: string;

    constructor(
        private httpService: HttpService,
        private configService: ConfigService,
    ) {
        this.omdbUrl = this.configService.get('OMDB_BASE_URL')!;
        this.apiKey = this.configService.get('OMDB_API_KEY')!;
    }

    async searchMovies(query: string): Promise<any> {
        try {
            const omdbResponse = await firstValueFrom(
                this.httpService.get(this.omdbUrl, {
                    params: {
                        s: query,
                        apikey: this.apiKey,
                    },
                }),
            );
            return omdbResponse.data;
        } catch (error) {
            throw new Error('OMDB API error: ${error.message}');
        }
    }
}