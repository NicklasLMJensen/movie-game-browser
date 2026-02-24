import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchlistItem, WatchlistItemSchema } from './watchlist.model';
import { WatchlistService } from '../services/watchlist.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: WatchlistItem.name, schema: WatchlistItemSchema }
        ]),
    ],
    providers: [WatchlistService],
    exports: [WatchlistService],
})
export class WatchlistModule {}



