export interface ConverterData {
  amount: number;
  from: string; // currency, should be enum later
  to: string; // currency, should be enum later
}

export interface ConversionResult {
  result: number;
}

export interface RenderData {
  value: string;
  currency: string;
  conversionCount: number;
  error: Error | null;
}
