package csc326.coffeemaker2.repositories;

import csc326.coffeemaker2.models.Ingredient;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Ingredient Repository Class
 * @author Christian Ziller
 *
 */
public interface IngredientRepository extends JpaRepository<Ingredient,Long> {

}
