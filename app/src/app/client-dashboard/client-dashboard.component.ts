// tslint:disable: member-ordering
import { Component, OnInit } from '@angular/core';
import { ClientService } from '../services/client.service';
import { ClientStats } from '../client';

@Component({
  selector: 'app-client-dashboard',
  templateUrl: './client-dashboard.component.html',
  styleUrls: ['./client-dashboard.component.scss']
})
export class ClientDashboardComponent implements OnInit {


  constructor(
    private service: ClientService
  ) { }

  public kpi: Promise<ClientStats>;
  public countByGenre: Array<any>;
  public histAge: Array<any>;
  public histAgeLabel: Array<any>;
  public dataLife: Array<any>;

  async ngOnInit() {
    this.kpi = this.service.kpi();
    const cd = await this.kpi;

    this.countByGenre = [{ data: [cd.mc, cd.fc, cd.bc] }];

    const hisG = this.histogram(cd.am, cd.af);
    this.histAge = [
      { data: hisG.dataM, label: 'Edades (hombre)' },
      { data: hisG.dataF, label: 'Edades (mujer)' },
    ];
    this.histAgeLabel = hisG.labels;
    this.histColors = [
      {
        backgroundColor: new Array(hisG.labels.length).fill(this.chartColors[0].backgroundColor[0]),
        hoverBackgroundColor: new Array(hisG.labels.length).fill(this.chartColors[0].hoverBackgroundColor[0]),
        borderWidth: 2,
      },
      {
        backgroundColor: new Array(hisG.labels.length).fill(this.chartColors[0].backgroundColor[1]),
        hoverBackgroundColor: new Array(hisG.labels.length).fill(this.chartColors[0].hoverBackgroundColor[1]),
        borderWidth: 2,
      }

    ];

    // passing expected life %
    this.dataLife = [{ data: [(cd.lm / cd.mc * 100).toFixed(0), (cd.lf / cd.fc * 100).toFixed(0)] }];



  }

  histogram(valuesM: { [k: number]: number }, valuesF: { [k: number]: number }) {

    const range = (start, end, length = end - start) =>
      Array.from({ length }, (_, i) => start + i);

    const af = [...new Set([
      ...(Object.keys(valuesM).filter(f => valuesM[f] > 0)), // with values
      ...(Object.keys(valuesF).filter(f => valuesF[f] > 0))
    ])]  // distinct keys
      .map(a => parseInt(a, 10)) // as number
      .sort((a, b) => a - b); // sorted asc

    if (af.length === 0) {
      return {
        dataM: [],
        dataF: [],
        labels: []
      };
    }
    // group by 5 years:  0-5,5-10,10-15,15-20,... between min and max

    const rv = 10;
    const min = Math.floor(af[0] / rv) * rv;
    const max = Math.ceil(af[af.length - 1] / rv) * rv;

    const rc = (max - min) / rv; // range count
    const dataM = new Array((max - min) / rv).fill(0);
    const dataF = new Array(dataM.length).fill(0);

    for (const k in valuesM) {
      if (valuesM.hasOwnProperty(k)) {
        const d = Math.floor((parseInt(k, 10) - min) / rv);
        dataM[d] += (valuesM[k] || 0);
      }
    }
    for (const k in valuesF) {
      if (valuesF.hasOwnProperty(k)) {
        const d = Math.floor((parseInt(k, 10) - min) / rv);
        dataF[d] += (valuesF[k] || 0);
      }
    }

    return {
      dataM,
      dataF,
      labels: range(min / rv, max / rv).map(i => `${i * rv}-${i * rv + rv}`)
    };
  }

  public chartLabels: Array<any> = ['Hombre', 'Mujer', 'N.D.'];
  public chartLabels2: Array<any> = ['% Hombre', '% Mujer'];

  public chartColors: Array<any> = [
    {
      backgroundColor: ['#F7464A', '#46BFBD'],
      hoverBackgroundColor: ['#FF5A5E', '#5AD3D1'],
      borderWidth: 2,
    }
  ];
  public histColors: Array<any>;


  public chartOptions: any = {
    responsive: true,
  };

  public chartHistOptions: any = {
    responsive: true,
    scales: {
      xAxes: [{
        stacked: true
      }],
      yAxes: [
        {
          stacked: true
        }
      ]
    }
  };

  public chartClicked(e: any): void { }
  public chartHovered(e: any): void { }

}
