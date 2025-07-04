"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var conversionCounter = 0;
function getConverterInput() {
    const amount = document.getElementById("amount");
    const from = document.getElementById("from-currency");
    const to = document.getElementById("to-currency");
    return { amount: amount.valueAsNumber, from: from.value, to: to.value };
}
function getConversion(input) {
    return __awaiter(this, void 0, void 0, function* () {
        let queryString = [
            `amount=${input.amount}`,
            `from=${input.from}`,
            `to=${input.to}`,
            `format=1`,
            // deprecate before backend migration
            `access_key=f9c3b630ff67198e98d6fd5486bf66e5`,
        ].join("&");
        try {
            const response = yield fetch(`http://api.currencylayer.com/convert?${queryString}`, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                },
            });
            if (!response.ok) {
                throw new Error(`Error! status: ${response.status}`);
            }
            const result = (yield response.json());
            console.log("result is: ", JSON.stringify(result, null, 4));
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                console.log("error message: ", error.message);
                throw error;
            }
            else {
                console.log("unexpected error: ", error);
                throw new Error("An unexpected error occurred");
            }
        }
    });
}
function convert() {
    const formData = getConverterInput();
    getConversion(formData)
        .then((conversionResult) => {
        document.querySelector(".result-value").textContent =
            // should be Intl(ed)
            `${conversionResult.result.toFixed(2)} ${formData.to}`;
        conversionCounter += 1;
        document.querySelector(".calculation-count").textContent =
            `${conversionCounter}`;
    })
        .catch((error) => {
        const resCard = document.querySelector(".result-card");
        const errorText = document.createElement("span");
        errorText.textContent = `Error: ${error.message}`;
        errorText.setAttribute("class", "error-message");
        resCard.appendChild(errorText);
    });
}
document.querySelector(".convert-btn").addEventListener("click", convert);
//# sourceMappingURL=index.js.map