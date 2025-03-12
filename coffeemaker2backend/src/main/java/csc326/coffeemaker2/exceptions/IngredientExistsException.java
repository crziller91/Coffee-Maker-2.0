package csc326.coffeemaker2.exceptions;

public class IngredientExistsException extends RuntimeException {

    public IngredientExistsException(String name){
        super("Ingredient "+ name + " already exists");
    }
	
}
