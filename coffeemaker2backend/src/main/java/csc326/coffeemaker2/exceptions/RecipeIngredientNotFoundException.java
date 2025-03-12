package csc326.coffeemaker2.exceptions;

public class RecipeIngredientNotFoundException extends RuntimeException {

    public RecipeIngredientNotFoundException(Long id){
        super("Could not find the recipe ingredient with id "+ id);
    }
	
}
