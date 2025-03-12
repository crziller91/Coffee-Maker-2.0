package csc326.coffeemaker2.models;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

/**
 * Ingredient Object
 * @author Christian Ziller
 *
 */
@Entity
public class Ingredient {

    @Id
    @GeneratedValue ( strategy = GenerationType.AUTO )
    /** Unique ID for each ingredient */
    private Long id;
    /** Name of ingredient */
    private String name;
    /** Amount of ingredient */
    private int amount;
    
    /**
     * Empty constructor for Hibernate
     */
    public Ingredient () {

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
	
	public int getAmount() {
		return amount;
	}
	
	public void setAmount(int amount) {
		this.amount = amount;
	}
	
}
