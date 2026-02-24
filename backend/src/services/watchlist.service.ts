import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { WatchlistItem, WatchlistItemDocument } from "../models/watchlist.model";

@Injectable()
export class WatchlistService {
    constructor(
        @InjectModel(WatchlistItem.name)
        private readonly watchlistModel: Model<WatchlistItemDocument>,
    ) {}


    async add(userId: string, imdbID: string) {
        return this.watchlistModel.findOneAndUpdate(
            { userId, imdbID },
            { userId, imdbID, addedAt: new Date() },
            { upsert: true, new: true, setDefaultsOnInsert: true },
        ).exec();
    }

    async remove(userId: string, imdbID: string) {
        return this.watchlistModel.deleteOne({ userId, imdbID }).exec();
    }

    async list(userId: string) {
        return this.watchlistModel
            .find({ userId })
            .sort({ addedAt: -1 })
            .lean()
            .exec();
    }
}