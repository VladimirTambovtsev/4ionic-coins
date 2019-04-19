import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private coins = [];
  private apiKey =
    'ccd97675ee55de100c3c4735afc9f38def8428ab19fe7d0a3de74f4a560a1cc3';

  constructor(private http: HttpClient) {}

  getCoins(coins) {
    let coinsList = '';
    coinsList = coins.join();
    return this.http.get<any>(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsList}&tsyms=USD&api_key=${
        this.apiKey
      }`
    );
  }

  getCoin(coin) {
    return this.http.get<any>(
      `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${coin}&tsyms=USD&api_key=${
        this.apiKey
      }`
    );
  }

  getChart(coin) {
    return this.http.get<any>(
      `https://min-api.cryptocompare.com/data/histoday?fsym=${coin}&tsym=USD&limit=30&aggregate=1&api_key=${
        this.apiKey
      }`
    );
  }
}
