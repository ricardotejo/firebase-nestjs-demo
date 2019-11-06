# Firebase + Nest.js Demo

## Objetive:
An application to register clients and calculate their probable death date, also show statistics about them.

## Achievements:
- Nest.js as REST api manager running in Firebase Functions
- Cheap method to re-calculate Standard Deviation without reading all documents on Firestore
- Angular 8 responsive application using **Material Design for Bootstrap** components

---

## Environment Setup
```
npm i -g @angular/cli @nestjs/cli firebase-tools
```
### Start Firestore emulator
```
cd /api/functions
npm run firestore
```
### Projects:

- /api/functions
    ```
    npm run start
    npm run start:dev
    npm run test
    npm run test:watch
    npm run test:cov
    ```
- /app
    ```
    npm run start
    npm run test
    ```

## Deployment to Firebase
0. Create a Firebase project and 
 - set the Firestor DB url into `\api\functions\src\core\firestore.provider.ts`
 - set Firebase api url into `\app\src\environments\environment.prod.ts`

1. Create a Firebase service account in
    https://console.firebase.google.com/u/0/project/{PROJECT_ID}/settings/serviceaccounts/adminsdk and download it to `\api\functions\src\assets\firebase.json`

2. Login into Firebase
    ```
    firebase login
    ```
2. in `\api\functions` execute 
    ```
    npm run deploy
    ```
2. in `\app` execute 
    ```
    npm run deploy
    ```



## Recalculate *Standard Deviation* Method

Original formula found on `http://mathforum.org/library/drmath/view/52820.html`

```csharp 
interface DbStats { n: number; m: number; s: number; }

public recalculateStandardDeviation(stats: DbStats, v: number): DbStats {

        // Recalculate standard deviation:  (idea from: `http://mathforum.org/library/drmath/view/52820.html`)

        // So from n, mu, and s, we can recover Sum[x] and Sum[x^2], which means we can compute s'.

        // n        = the population size (number of data points)
        // mu       = population mean
        // s        = standard deviation
        // Sum[x^2] = the sum of the squares of all data points
        // Sum[x]   = the sum of all data points

        const { n, m, s } = stats;
        const sum1 = n * m;
        const sum2 = n * (s * s + m * m);  // n(s^2 + mu^2) = Sum[x^2]

        // the standard deviation after adding a new value, v, would be:
        //             (n+1)*(v^2 + Sum[x^2]) - (v + Sum[x])^2
        //  s' = Sqrt[ --------------------------------------- ]
        //                      (n+1)^2

        const n1 = n + 1;
        const m1 = (sum1 + v) / n1;
        const s1 = Math.sqrt(((n1) * (v * v + sum2) - (v + sum1) * (v + sum1)) / ((n1) * (n1)));

        return { n: n1, m: m1, s: s1 };
    }
    ```


## Licence

Copyright ©2019 Ricardo Tejo

MIT License:

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
