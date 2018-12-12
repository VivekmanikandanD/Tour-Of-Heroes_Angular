import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { Observable,of } from 'rxjs';
import { MessageService } from './message.service';
import {HttpClient,HttpHeaders } from '@angular/common/http';
import { catchError,map,tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class HeroService {
  
  private heroesUrl='api/heroes';
  
  private httpOptions={
    headers:new HttpHeaders({'Content-Type':'application/json'})
  };

  constructor(
    private http:HttpClient,
    private messageService:MessageService) {

   }
   
   private log(message:string){
    this.messageService.add(`Hero Service : ${message}`);
  }

  /* getHeroes():Observable<Hero[]>{
    this.messageService.add('HeroService: fetched heroes');
    return of(HEROES);
  } */
  getHeroes():Observable<Hero[]>{
   this.messageService.add('HeroService:fetched heroes');
   return this.http.get<Hero[]>(this.heroesUrl)
   .pipe(
    tap(_=>this.log('fetched heroes')), 
    catchError(this.handleError('getHeroes',[])));
  }

  getHero(id:number):Observable<Hero>{
    this.messageService.add(`HeroService:fetched hero id=${id}`);
    //return of(HEROES.find(hero=>hero.id===id));
    const url=`${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url).pipe(
    tap(_=>this.log(`fetched hero id=${id}`),
    catchError(this.handleError<Hero>(`getHero id=${id}`))
    ));
  }

 

  updateHero(hero:Hero):Observable<any>{
    return this.http.put(this.heroesUrl,hero,this.httpOptions).pipe(
      tap(_=>this.log(`updated hero id=${hero.id}`)),
      catchError(this.handleError<any>('updateHero'))
    );
  }

  addHero(hero:Hero):Observable<Hero>{
    return this.http.post<Hero>(this.heroesUrl,hero,this.httpOptions).pipe(
      tap((hero:Hero)=>this.log(`added new hero w/ id ${hero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
    );
  }

  deleteHero(hero:Hero | number):Observable<Hero>{
    const id=typeof hero === 'number' ? hero:hero.id;
    const url=`${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url,this.httpOptions).pipe(
      tap(_=>this.log(`deleted hero with id ${id}`)),
      catchError(this.handleError<Hero>('deleteHero'))
    );
  }
  

  searchHeroes(term:string):Observable<Hero[]>{
    if(!term.trim()){
      return of([]);
    }
    return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
      tap(_=>this.log(`fetched heroes matching "${term}"`)),
      catchError(this.handleError('searchHeroes',[]))
    );
  }


  
  private handleError<T>(operation='operation',result?:T){
    return(error:any):Observable<T> =>{
      console.error(error);  //log to console instead
      
      this.log(`${operation} failed:${error.message}`);

      //Let the app keep running by returning an empty result
      return of(result as T);
    }

  }
 

    
}
