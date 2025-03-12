package csc326.coffeemaker2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import csc326.coffeemaker2.models.RecipeIngredient;

/**
 * Recipe Ingredient Repository
 * @author Christian Ziller
 *
 */
public interface RecipeIngredientRepository extends JpaRepository<RecipeIngredient,Long> {

}
