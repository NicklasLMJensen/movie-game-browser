import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Document } from 'mongoose';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class CacheEntry extends Document {
    @Prop({ required: true, index: true })
    query: string;

    @Prop({ required: true, type: MongooseSchema.Types.Mixed })
    data: unknown;

    @Prop({ required: true, expires: '72h '})
    expiresAt: Date;
}

export const CacheEntrySchema = SchemaFactory.createForClass(CacheEntry);