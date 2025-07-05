// Input form data
export interface ConverterData {
  amount: number;
  from: string; // currency, should be enum later
  to: string; // currency, should be enum later
}

// Output of CurrecyLayer API
export interface ConversionResult {
  result: number;
}

// Application statistics
export interface ConversionStats {
  totalCurrency: {
    sum: string;
  };
  dailyCurrency: {
    count: number;
    sum: string;
  };
  total: {
    count: number;
  };
}

// Data for template rendering
export interface RenderData {
  value: string;
  currency: string;
  stats: ConversionStats | null;
  error: Error | null;
}
