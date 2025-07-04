import { Request } from "express";

const apiKey = process.env.CURRENCYLAYER_API_KEY;
var conversionCounter = 0;

interface ConverterData {
  amount: number;
  from: string; // currency, should be enum later
  to: string; // currency, should be enum later
}

interface ConversionResult {
  result: number;
}

interface RenderData {
  value: string;
  currency: string;
  conversionCount: number;
  error: Error | null;
}

function getConverterInput(request_body: any): ConverterData {
  return {
    amount: request_body.amount as number,
    from: request_body.from_currency as string,
    to: request_body.to_currency as string,
  };
}

async function getConversion(
  input: ConverterData,
): Promise<ConversionResult | never> {
  if (!apiKey) {
    throw new Error("CURRENCYLAYER_API_KEY environment variable is not set");
  }

  let queryString = [
    `amount=${input.amount}`,
    `from=${input.from}`,
    `to=${input.to}`,
    `format=1`,
    // deprecate before backend migration
    `access_key=${apiKey}`,
  ].join("&");

  try {
    const response = await fetch(
      `http://api.currencylayer.com/convert?${queryString}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    const result = (await response.json()) as ConversionResult;

    console.log("result is: ", JSON.stringify(result, null, 4));

    return result;
  } catch (error) {
    if (error instanceof Error) {
      console.log("error message: ", error.message);
      throw error;
    } else {
      console.log("unexpected error: ", error);
      throw new Error("An unexpected error occurred");
    }
  }
}

export async function convert(request: Request): Promise<RenderData> {
  const formData = getConverterInput(request.body);
  conversionCounter += 1;
  try {
    const conversionResult = await getConversion(formData);
    return {
      value: conversionResult.result.toFixed(2),
      currency: formData.to,
      conversionCount: conversionCounter,
      error: null,
    };
  } catch (error) {
    return {
      value: "0",
      currency: formData.to,
      conversionCount: conversionCounter,
      error: error as Error,
    };
  }
}
