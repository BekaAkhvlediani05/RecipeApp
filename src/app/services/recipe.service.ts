import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private apiUrl = 'http://localhost:3000/recipes';

  constructor(private http: HttpClient) { }

  getRecipeById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  getRecipes(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getRecipe(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addRecipe(recipe: any): Observable<any> {
    return this.getNewRecipeId().pipe(
      switchMap(newId => {
        const newRecipe = { ...recipe, id: newId.toString() };  // Convert ID to string
        return this.http.post(`${this.apiUrl}`, newRecipe);
      })
    );
  }

  private getNewRecipeId(): Observable<number> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(data => {
        const highestId = data.length > 0 ? Math.max(...data.map(recipe => recipe.id)) : 0;
        return highestId + 1;
      })
    );
  }

  updateRecipe(id: number, updatedRecipe: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, updatedRecipe);
  }

  deleteRecipe(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
