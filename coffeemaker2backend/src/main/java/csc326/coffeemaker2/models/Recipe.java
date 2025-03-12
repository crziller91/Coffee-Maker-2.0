package csc326.coffeemaker2.models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;

/**
 * Recipe Object Class
 * @author Christian Ziller
 *
 */
@Entity
public class Recipe {

    @Id
    @GeneratedValue ( strategy = GenerationType.AUTO )
    /** Unique ID for each recipe */
    private Long id;
    /** Name of recipe */
    private String name;
    /** Price of recipe */
    private int price;
	/** List of recipe ingredients */
    @ManyToMany ( cascade = CascadeType.ALL )
    private List<RecipeIngredient> recipeIngredients;
    
    /**
     * Empty constructor for Hibernate
     */
    public Recipe () {
		
    }
    
	public Long getId() {
		return id;
	}
	
	public void setId(Long id) {
		this.id = id;
	}
	
	public String getName() {
		return name;
	}
	
	public void setName(String name) {
		this.name = name;
	}
	
	public int getPrice() {
		return price;
	}
	
	public void setPrice(int price) {
		this.price = price;
	}
	
	public List<RecipeIngredient> getRecipeIngredients() {
		return recipeIngredients;
	}
	
	public void setRecipeIngredients(List<RecipeIngredient> recipeIngredients) {
		this.recipeIngredients = recipeIngredients;
	}
    
}
