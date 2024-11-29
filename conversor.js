import promptSync from 'prompt-sync';
import fetch from 'node-fetch';

const prompt = promptSync();
const API_BASE_URL = 'https://v6.exchangerate-api.com/v6/d2787cf06f3d7ffe2376f5ab/pair';

class Conversor {
  async getConversion(fromCurrency, toCurrency, amount) {
    const url = `${API_BASE_URL}/${fromCurrency}/${toCurrency}/${amount}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.result === 'error') {
      throw new Error(`Erro na conversão: ${data['error-type']}`);
    }

    if (data.result !== 'success') {
      throw new Error('Erro desconhecido na conversão.');
    }

    return {
      rate: data.conversion_rate,
      convertedValue: data.conversion_result,
    };
  }

  validateInputs(fromCurrency, toCurrency, amount) {
    if (fromCurrency.length !== 3 || toCurrency.length !== 3) {
      throw new Error('Moedas devem ter exatamente 3 caracteres.');
    }
    if (isNaN(amount) || parseFloat(amount) <= 0) {
      throw new Error('O valor deve ser maior que 0.');
    }
    if (fromCurrency === toCurrency) {
      throw new Error('A moeda de origem deve ser diferente da moeda de destino.');
    }
  }

  async run() {
    while (true) {
      try {
        const fromCurrency = prompt('Digite a moeda de origem (ou vazio para sair): ').toUpperCase();
        if (fromCurrency === '') break;

        const toCurrency = prompt('Digite a moeda de destino: ').toUpperCase();
        const amount = parseFloat(prompt('Digite o valor a ser convertido: '));

        this.validateInputs(fromCurrency, toCurrency, amount);

        const { rate, convertedValue } = await this.getConversion(fromCurrency, toCurrency, amount);

        console.log(`\nTaxa de conversão: 1 ${fromCurrency} = ${rate.toFixed(6)} ${toCurrency}`);
        console.log(`${amount} ${fromCurrency} = ${convertedValue.toFixed(2)} ${toCurrency}\n`);
      } catch (error) {
        console.log(`Erro: ${error.message}`);
      }
    }

    console.log('Programa encerrado.');
  }
}

const app = new Conversor();
app.run();
