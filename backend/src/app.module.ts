import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OmdbService } from './services/omdb.service';
import { CacheService } from './services/cache.service';
import { CacheModule } from './models/cache.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WatchlistModule } from './models/watchlist.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    MongooseModule.forRoot(process.env.MONGODB_URI as string),
    CacheModule,
    WatchlistModule,
  ],
  controllers: [AppController],
  providers: [AppService, OmdbService, CacheService],
})
export class AppModule {}
