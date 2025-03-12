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

import csc326.coffeemaker2.exceptions.RecipeIngredientNotFoundException;
import csc326.coffeemaker2.models.RecipeIngredient;
import csc326.coffeemaker2.repositories.RecipeIngredientRepository;

@RestController
@CrossOrigin("http://localhost:3000")
public class RecipeIngredientController {

    @Autowired
    private RecipeIngredientRepository recipeIngredientRepository;
    
    @PostMapping("/recipeIngredient")
    RecipeIngredient newRecipeIngredient(@RequestBody RecipeIngredient newRecipeIngredient) {
        return recipeIngredientRepository.save(newRecipeIngredient);
    }

    @GetMapping("/recipeIngredients")
    List<RecipeIngredient> getAllRecipeIngredients() {
        return recipeIngredientRepository.findAll();
    }

    @GetMapping("/recipeIngredient/{id}")
    RecipeIngredient getRecipeIngredientById(@PathVariable Long id) {
        return recipeIngredientRepository.findById(id)
                .orElseThrow(() -> new RecipeIngredientNotFoundException(id));
    }

    @PutMapping("/recipeIngredient/{id}")
    RecipeIngredient updateRecipeIngredient(@RequestBody RecipeIngredient newRecipeIngredient, @PathVariable Long id) {
        return recipeIngredientRepository.findById(id)
                .map(recipeIngredient -> {
                	recipeIngredient.setName(newRecipeIngredient.getName());
                	recipeIngredient.setAmount(newRecipeIngredient.getAmount());
                    return recipeIngredientRepository.save(recipeIngredient);
                }).orElseThrow(() -> new RecipeIngredientNotFoundException(id));
    }

    @DeleteMapping("/recipeIngredient/{id}")
    String deleteRecipeIngredient(@PathVariable Long id){
        if(!recipeIngredientRepository.existsById(id)){
            throw new RecipeIngredientNotFoundException(id);
        }
        recipeIngredientRepository.deleteById(id);
        return  "Recipe ingredient with id " + id + " has been deleted successfully.";
    }
	
}
