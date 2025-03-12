package csc326.coffeemaker2.exceptions;

public class RecipeNotFoundException extends RuntimeException {

    public RecipeNotFoundException(Long id){
        super("Could not find the recipe with id "+ id);
    }
	
}
