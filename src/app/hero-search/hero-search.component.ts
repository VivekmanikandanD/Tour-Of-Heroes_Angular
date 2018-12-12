import { Component, OnInit } from '@angular/core';
import { Observable,Subject } from 'rxjs';
import { debounceTime,distinctUntilChanged,switchMap } from 'rxjs/operators';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  private heroes$:Observable<Hero[]>;
  private searchTerms=new Subject<string>();
  constructor(private heroService:HeroService) { }

  search(term:string){
    this.searchTerms.next(term);  //pushes new search values into searchTerms subject
  }

  ngOnInit() {

    this.heroes$=this.searchTerms.pipe(
      debounceTime(300), //Waits for 300 millisecons untill making another request

      distinctUntilChanged(), //calls only if new search value is available
  
      switchMap((term:string)=>this.heroService.searchHeroes(term)), //switch to new observable each time the term changes
    );
    
    
  }

}
