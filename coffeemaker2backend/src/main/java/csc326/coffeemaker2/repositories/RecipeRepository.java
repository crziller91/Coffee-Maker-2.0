package csc326.coffeemaker2.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import csc326.coffeemaker2.models.Recipe;

/**
 * Recipe Repository
 * @author Christian Ziller
 *
 */
public interface RecipeRepository extends JpaRepository<Recipe,Long> {

}
