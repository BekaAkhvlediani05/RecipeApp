import { Component, OnInit } from '@angular/core';
import { RecipeService } from '../../services/recipe.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recipe-list',
  standalone: false,
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  recipes: any[] = [];
  filteredRecipes: any[] = [];
  favorites: any[] = [];
  searchQuery: string = '';
  isAuthenticated: boolean = false;

  constructor(
    private recipeService: RecipeService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isLoggedIn();

    this.recipeService.getRecipes().subscribe((data) => {
      this.recipes = data;
      this.filteredRecipes = data;
      this.favorites = this.recipes.filter((recipe) => recipe.favorite);
    });
  }

  filterRecipes(): void {
    if (this.searchQuery.trim()) {
      this.filteredRecipes = this.recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredRecipes = this.recipes;
    }
  }

  removeRecipe(id: number): void {
    if (this.isAuthenticated) {
      this.recipeService.deleteRecipe(id).subscribe(() => {
        this.recipes = this.recipes.filter((recipe) => recipe.id !== id);
        this.filterRecipes();
        this.favorites = this.favorites.filter((recipe) => recipe.id !== id);
      });
    }
  }

  editRecipe(id: number): void {
    if (this.isAuthenticated) {
      this.router.navigate(['/recipe/edit', id]);
    }
  }

  toggleFavorite(recipe: any): void {
    recipe.favorite = !recipe.favorite;
    this.recipeService.updateRecipe(recipe.id, recipe).subscribe(() => {
      console.log('Favorite status updated');
      this.favorites = this.recipes.filter((recipe) => recipe.favorite);
    });
  }
}
