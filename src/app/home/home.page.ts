import { Subscription } from 'rxjs';
import { Component, ElementRef } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';

import { DataService } from './../data.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage {
  private likedCoins = [];
  objectKeys = Object.keys;
  coins = [];
  detailToggle = [];
  details = {};
  chart = [];

  constructor(
    private elementRef: ElementRef,
    private navCtrl: NavController,
    private data: DataService,
    private storage: Storage
  ) {}

  ionViewWillEnter() {
    this.refreshCoins();
  }

  async refreshCoins() {
    const coins = await this.storage.get('likedCoins');
    if (!coins) {
      this.likedCoins.push('BTC', 'ETC', 'IOT');
      this.storage.set('likedCoins', this.likedCoins);

      this.data.getCoins(this.likedCoins).subscribe(response => {
        console.log(response);
        this.coins = response;
      });
    } else {
      this.likedCoins = coins;

      this.data.getCoins(this.likedCoins).subscribe(response => {
        console.log(response);
        this.coins = response;
      });
    }
  }

  coinDetails(coin, index) {
    if (this.detailToggle[index]) this.detailToggle[index] = false;
    else {
      this.detailToggle.fill(false);
      this.data.getCoin(coin).subscribe(res => {
        this.details = res['DISPLAY'][coin]['USD'];

        this.detailToggle[index] = true;

        this.data.getChart(coin).subscribe(res => {
          console.log(res);

          let coinHistory = res['Data'].map(a => a.close);

          setTimeout(() => {
            this.chart[index] = new Chart('canvas' + index, {
              type: 'line',
              data: {
                labels: coinHistory,
                datasets: [
                  {
                    data: coinHistory,
                    borderColor: '#3cba9f',
                    fill: false
                  }
                ]
              },
              options: {
                tooltips: {
                  callbacks: {
                    label: function(tooltipItems, data) {
                      return '$' + tooltipItems.yLabel.toString();
                    }
                  }
                },
                responsive: true,
                legend: {
                  display: false
                },
                scales: {
                  xAxes: [
                    {
                      display: false
                    }
                  ],
                  yAxes: [
                    {
                      display: false
                    }
                  ]
                }
              }
            });
          }, 250);
        });
      });
    }
  }

  swiped(index) {
    this.detailToggle[index] = false;
  }

  removeCoin(coin) {
    this.detailToggle.fill(false);

    this.likedCoins = this.likedCoins.filter(function(item) {
      return item !== coin;
    });

    this.storage.set('likedCoins', this.likedCoins);

    setTimeout(() => {
      this.refreshCoins();
    }, 300);
  }

  showSearch() {
    // this.navCtrl.push(SearchPage);
  }
}
