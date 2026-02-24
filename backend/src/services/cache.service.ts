import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheEntry } from '../models/cache.model';

@Injectable()
export class CacheService {
    constructor(
        @InjectModel(CacheEntry.name)
        private cacheModel: Model<CacheEntry>,
    ) {}
    async getCached(query: string): Promise<CacheEntry | null> {
        const now = new Date();
        const cached = await this.cacheModel.findOne({
            query: query,
            expiresAt: { $gt: now},
        });
        return cached;
    }

    async setCache(query: string, data: any): Promise<CacheEntry> {
        const expiresAt = new Date(Date.now() +  7 * 24 * 60 * 60 * 1000);
        return await this.cacheModel.create({
            query,
            data,
            expiresAt,
        });
    }
}