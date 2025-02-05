import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: false,
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = {};

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipeService.getRecipe(id).subscribe(
      (data) => {
        this.recipe = data;
        if (this.recipe.ingredients) {
          this.recipe.ingredients = this.recipe.ingredients.split(',').map((item: string) => item.trim());
        }
      },
      (error) => {
        console.error('Error fetching recipe:', error);
        this.recipe = null;
      }
    );
  }
}

