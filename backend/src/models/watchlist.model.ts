import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: false})
export class WatchlistItem {
    @Prop({ required: true })
    userId: string;

    @Prop({ required: true })
    imdbID: string;

    @Prop({ default: Date.now })
    addedAt: Date;
}

export type WatchlistItemDocument = WatchlistItem & Document;
export const WatchlistItemSchema = SchemaFactory.createForClass(WatchlistItem);

WatchlistItemSchema.index({ userId: 1, imdbID: 1 }, { unique: true });