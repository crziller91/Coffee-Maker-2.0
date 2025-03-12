package csc326.coffeemaker2.controllers;

import csc326.coffeemaker2.exceptions.IngredientExistsException;
import csc326.coffeemaker2.exceptions.IngredientNotFoundException;
import csc326.coffeemaker2.models.Ingredient;
import csc326.coffeemaker2.repositories.IngredientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * Ingredient Controller Class
 * @author Christian Ziller
 *
 */
@RestController
@CrossOrigin("http://localhost:3000")
public class IngredientController {

    @Autowired
    private IngredientRepository ingredientRepository;
    
    @PostMapping("/ingredient")
    Ingredient newIngredient(@RequestBody Ingredient newIngredient) {
    	for (int i = 0; i < getAllIngredients().size(); i++) {
    		if (newIngredient.getName().equals(getAllIngredients().get(i).getName())) {
                throw new IngredientExistsException(newIngredient.getName());
    		}
    	}
        return ingredientRepository.save(newIngredient);
    }

    @GetMapping("/ingredients")
    List<Ingredient> getAllIngredients() {
        return ingredientRepository.findAll();
    }

    @GetMapping("/ingredient/{id}")
    Ingredient getIngredientById(@PathVariable Long id) {
        return ingredientRepository.findById(id)
                .orElseThrow(() -> new IngredientNotFoundException(id));
    }

    @PutMapping("/ingredient/{id}")
    Ingredient updateIngredient(@RequestBody Ingredient newIngredient, @PathVariable Long id) {
        return ingredientRepository.findById(id)
                .map(ingredient -> {
                	ingredient.setName(newIngredient.getName());
                	ingredient.setAmount(newIngredient.getAmount());
                    return ingredientRepository.save(ingredient);
                }).orElseThrow(() -> new IngredientNotFoundException(id));
    }

    @DeleteMapping("/ingredient/{id}")
    String deleteIngredient(@PathVariable Long id){
        if(!ingredientRepository.existsById(id)){
            throw new IngredientNotFoundException(id);
        }
        ingredientRepository.deleteById(id);
        return  "Ingredient with id " + id + " has been deleted successfully.";
    }
	
}
