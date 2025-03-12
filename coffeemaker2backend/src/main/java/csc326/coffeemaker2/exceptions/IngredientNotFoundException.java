package csc326.coffeemaker2.exceptions;

/**
 * Ingredient Not Found Exception Class
 * @author Christian Ziller
 *
 */
public class IngredientNotFoundException extends RuntimeException {

    public IngredientNotFoundException(Long id){
        super("Could not find the ingredient with id "+ id);
    }
	
}
