import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class NationalRates {
  @Prop()
  rates: Rate[];
}

export class Rate {
  @Prop()
  sellRate: number;

  @Prop()
  sellIso: string;

  @Prop()
  sellCode: number;

  @Prop()
  buyRate: number;

  @Prop()
  buyIso: string;

  @Prop()
  buyCode: number;

  @Prop()
  quantity: number;

  @Prop()
  name?: string;

  @Prop()
  date: string;
}

export const NationalRatesSchema = SchemaFactory.createForClass(NationalRates);
