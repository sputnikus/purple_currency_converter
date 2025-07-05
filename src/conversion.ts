import { Request } from "express";

import { ConverterData, ConversionResult, RenderData } from "./interface";
import { addRequest, addResponse, getConversionStats } from "./storage";

const apiKey = process.env.CURRENCYLAYER_API_KEY;

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

    return (await response.json()) as ConversionResult;
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
  await addRequest(formData);
  try {
    const conversion = await getConversion(formData);
    await addResponse(conversion.result, formData.to);
    const stats = await getConversionStats(formData.to);
    return {
      value: conversion.result.toFixed(2),
      currency: formData.to,
      stats: stats,
      error: null,
    };
  } catch (error) {
    return {
      value: "0",
      currency: formData.to,
      stats: null,
      error: error as Error,
    };
  }
}
