import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-edit',
  standalone: false,
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {
  recipeId!: number;
  recipeForm: FormGroup;
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.recipeForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      ingredients: ['', Validators.required],
      instructions: ['', Validators.required],
      thumbnail: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipeId = id;
    this.loading = true;
    this.recipeService.getRecipe(this.recipeId).subscribe(
      (recipe) => {
        this.recipeForm.patchValue(recipe);
        this.loading = false;
      },
      (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to load recipe. Please try again later.';
      }
    );
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      this.loading = true;
      const updatedRecipe = { ...this.recipeForm.value, id: this.recipeId };
      this.recipeService.updateRecipe(this.recipeId, updatedRecipe).subscribe(
        () => {
          this.loading = false;
          this.router.navigate(['/']);
        },
        (error) => {
          this.loading = false;
          this.errorMessage = 'Failed to update recipe. Please try again later.';
        }
      );
    }
  }
}
