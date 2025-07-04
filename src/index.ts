var conversionCounter = 0;

interface ConverterData {
  amount: number;
  from: string; // currency, should be enum later
  to: string; // currency, should be enum later
}

interface ConversionResult {
  result: number;
}

function getConverterInput(): ConverterData {
  const amount = document.getElementById("amount") as HTMLInputElement;
  const from = document.getElementById("from-currency") as HTMLInputElement;
  const to = document.getElementById("to-currency") as HTMLInputElement;

  return { amount: amount.valueAsNumber, from: from.value, to: to.value };
}

async function getConversion(
  input: ConverterData,
): Promise<ConversionResult | never> {
  let queryString = [
    `amount=${input.amount}`,
    `from=${input.from}`,
    `to=${input.to}`,
    `format=1`,
    // deprecate before backend migration
    `access_key=f9c3b630ff67198e98d6fd5486bf66e5`,
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

function convert() {
  const formData = getConverterInput();
  getConversion(formData)
    .then((conversionResult) => {
      document.querySelector(".result-value")!.textContent =
        // should be Intl(ed)
        `${conversionResult.result.toFixed(2)} ${formData.to}`;
      conversionCounter += 1;
      document.querySelector(".calculation-count")!.textContent =
        `${conversionCounter}`;
    })
    .catch((error) => {
      const resCard = document.querySelector(".result-card")!;
      const errorText = document.createElement("span");
      errorText.textContent = `Error: ${error.message}`;
      errorText.setAttribute("class", "error-message");
      resCard.appendChild(errorText);
    });
}

document.querySelector(".convert-btn")!.addEventListener("click", convert);
