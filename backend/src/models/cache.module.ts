import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheEntry, CacheEntrySchema} from './cache.model';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: CacheEntry.name, schema: CacheEntrySchema },
        ]),
    ],
    exports: [MongooseModule],
})
export class CacheModule {}
