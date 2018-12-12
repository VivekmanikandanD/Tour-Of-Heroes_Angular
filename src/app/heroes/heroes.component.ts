import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero';
import { HeroService } from '../hero.service';
import { subscribeOn } from '../../../node_modules/rxjs/operators';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
 
 /*  selectedHero: Hero; */
  heroes:Hero[];
  
  constructor(private heroService:HeroService) { }

  ngOnInit() {
    this.getHeroes();
  }

  /* onSelect(hero:Hero):void{
    this.selectedHero=hero;
  } */
  getHeroes():void{
    this.heroService.getHeroes()
    .subscribe(heroes=>this.heroes=heroes);
  }

  //Add a new hero
  add(name:string):void{
    name=name.trim();
    if(!name){ return; }
    this.heroService.addHero({name} as Hero)
    .subscribe(hero=>{
      this.heroes.push(hero)
    });
  }

  delete(hero:Hero):void{
    this.heroes=this.heroes.filter(h=>h!=hero);
    this.heroService.deleteHero(hero).subscribe();
  }

}
