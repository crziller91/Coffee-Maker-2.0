package csc326.coffeemaker2.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import csc326.coffeemaker2.exceptions.RecipeNotFoundException;
import csc326.coffeemaker2.models.Recipe;
import csc326.coffeemaker2.repositories.RecipeRepository;

/**
 * Recipe Controller Class
 * @author Christian Ziller
 *
 */
@RestController
@CrossOrigin("http://localhost:3000")
public class RecipeController {

    @Autowired
    private RecipeRepository recipeRepository;
	
    @PostMapping("/recipe")
    Recipe newRecipe(@RequestBody Recipe newRecipe) {
        return recipeRepository.save(newRecipe);
    }
    
    @GetMapping("/recipes")
    List<Recipe> getAllRecipes() {
        return recipeRepository.findAll();
    }
    
    @GetMapping("/recipe/{id}")
    Recipe getRecipeById(@PathVariable Long id) {
        return recipeRepository.findById(id)
                .orElseThrow(() -> new RecipeNotFoundException(id));
    }
    
    @PutMapping("/recipe/{id}")
    Recipe updateRecipe(@RequestBody Recipe newRecipe, @PathVariable Long id) {
        return recipeRepository.findById(id)
                .map(recipe -> {
                	recipe.setName(newRecipe.getName());
                	recipe.setPrice(newRecipe.getPrice());
                	recipe.setRecipeIngredients(newRecipe.getRecipeIngredients());
                    return recipeRepository.save(recipe);
                }).orElseThrow(() -> new RecipeNotFoundException(id));
    }
    
    @DeleteMapping("/recipe/{id}")
    String deleteRecipe(@PathVariable Long id){
        if(!recipeRepository.existsById(id)){
            throw new RecipeNotFoundException(id);
        }
        recipeRepository.deleteById(id);
        return  "Recipe with id " + id + " has been deleted successfully.";
    }
    
}
