import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'; 
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class FinancesService {
  private apiKey = 'cs977kpr01qoa9gbibc0cs977kpr01qoa9gbibcg';  //API Key de Finnhub
  private baseUrl = 'https://finnhub.io/api/v1/quote';  //URL de API
  private recommendationUrl = 'https://finnhub.io/api/v1/stock/recommendation';   //Para recomendar compra y venta
  private newsUrl = 'https://finnhub.io/api/v1/company-news';  //Para noticias de empresas en especifico
  private apiUrl = 'https://finnhub.io/api/v1/forex/rates'; // Endpoint para valor de moneda
  private marketHolidayUrl = 'https://finnhub.io/api/v1/calendar/holiday';


  constructor(private http: HttpClient) {}

  // Método para obtener los datos de una acción específica
  getStockData(ticker: string): Observable<any> {
    const url = `${this.baseUrl}?symbol=${ticker}&token=${this.apiKey}`;

    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error fetching stock data', error);
        return throwError('Error al obtener los datos de la acción. Inténtalo de nuevo más tarde.');
      })
    );
  }

  //Metodo para recomendaciones de compra y venta
  getRecommendationTrends(ticker: string): Observable<any> {
    const url = `${this.recommendationUrl}?symbol=${ticker}&token=${this.apiKey}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error fetching recommendation trends', error);
        return throwError('Error al obtener las tendencias de recomendación.');
      })
    );
  } 

   //Metodo para noticias recientes de empresas
   getRecentCompanyNews(ticker: string): Observable<any> {
    const currentDate = new Date();
    const oneDayAgo = new Date();
    oneDayAgo.setDate(currentDate.getDate() - 1);  // Obtener la fecha de un día antes

    // Formatear las fechas en formato 'YYYY-MM-DD'
    const toDate = formatDate(currentDate, 'yyyy-MM-dd', 'en-US');
    const fromDate = formatDate(oneDayAgo, 'yyyy-MM-dd', 'en-US');

    const url = `${this.newsUrl}?symbol=${ticker}&from=${fromDate}&to=${toDate}&token=${this.apiKey}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error fetching company news', error);
        return throwError('Error al obtener las noticias recientes de la empresa.');
      })
    );
  }

  //Metodo que muestra el valor de la moneda
  getCurrencyRates(baseCurrency: string): Observable<any> {
  const url = `${this.apiUrl}?base=${baseCurrency}&token=${this.apiKey}`;
  return this.http.get(url).pipe(
    catchError((error) => {
      console.error('Error fetching currency rates', error);
      return throwError('Error al obtener las tasas de cambio.');
    })
  );
  }

   // Método para obtener los días festivos de mercado
   getMarketHolidays(): Observable<any> {
    const url = `${this.marketHolidayUrl}?token=${this.apiKey}`;
    return this.http.get(url).pipe(
      catchError((error) => {
        console.error('Error fetching market holidays', error);
        return throwError('Error al obtener las fechas de cierre del mercado.');
      })
    );
  }
}