import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Card, Container, Table, Form, Button, Modal, Alert } from 'react-bootstrap';

// Configuration Constants
const API_BASE_URL = "http://localhost:8080"; // Base URL for API endpoints

/**
 * PurchaseRecipes Component
 * Manages the purchase of recipes including selection, quantity, and payment processing
 * @returns {JSX.Element} Component for purchasing recipes
 */
const PurchaseRecipes = () => {
  // State Management
  const [finalPrice, setFinalPrice] = useState(0); // Total price of selected recipes
  const [recipes, setRecipes] = useState([]); // List of available recipes
  const [ingredients, setIngredients] = useState([]); // List of available ingredients
  const [selectedRecipesForPurchase, setSelectedRecipesForPurchase] = useState([]); // Selected recipes for purchase
  const [purchaseSectionFlag, setPurchaseSectionFlag] = useState(false); // Controls payment modal visibility
  const [inputPayment, setInputPayment] = useState(""); // User-entered payment amount
  const [change, setChange] = useState(""); // Calculated change after payment
  
  // Error/Warning States
  const [showNoRecipesSelected, setShowNoRecipesSelected] = useState(false); // Alert for no recipe selection
  const [showNoRecipeCountSelected, setShowNoRecipeCountSelected] = useState(false); // Alert for invalid count
  const [showInsufficientInventory, setShowInsufficientInventory] = useState(false); // Alert for low inventory
  
  // Form States
  const [form, setForm] = useState({}); // Form data for payment
  const [errors, setErrors] = useState({}); // Form validation errors
  
  // Modal States
  const [showGoodPayment, setShowGoodPayment] = useState(false); // Success modal
  const [showInvalidPayment, setShowInvalidPayment] = useState(false); // Invalid payment alert

  /**
   * Fetches and formats recipe data from API
   * Memoized to prevent unnecessary re-renders
   */
  const loadRecipes = useCallback(async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/recipes`);
      setRecipes(
        result.data.map(d => ({
          select: false,
          id: d.id,
          name: d.name,
          price: d.price,
          recipeIngredients: d.recipeIngredients,
          count: 0,
        }))
      );
    } catch (error) {
      console.error("Error loading recipes:", error);
    }
  }, []); // No dependencies as it only fetches initial data

  /**
   * Fetches ingredient data from API
   * Memoized to prevent unnecessary re-renders
   */
  const loadIngredients = useCallback(async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/ingredients`);
      setIngredients(result.data);
    } catch (error) {
      console.error("Error loading ingredients:", error);
    }
  }, []); // No dependencies as it only fetches initial data

  /**
   * Effect hook to load initial data
   * Fetches recipes and ingredients on component mount
   */
  useEffect(() => {
    loadRecipes();
    loadIngredients();
  }, [loadRecipes, loadIngredients]); // Include functions as dependencies

  /**
   * Updates form field values and clears related errors
   * @param {string} field - Form field name
   * @param {string|number} value - New field value
   */
  const setField = useCallback((field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]); // Depends on errors state

  /**
   * Validates payment form data
   * @returns {Object} Validation errors
   */
  const findFormErrors = useCallback(() => {
    const { price } = form;
    const newErrors = {};

    if (!price) newErrors.price = 'Please enter a price';
    else if (price <= 0) newErrors.price = 'Price must be greater than 0';
    else if (price < finalPrice) newErrors.price = `Price must be greater than ${finalPrice}`;

    return newErrors;
  }, [form, finalPrice]); // Depends on form and finalPrice

  /**
   * Handles price generation form submission
   * Validates selections and inventory before showing payment modal
   * @param {Event} e - Form submission event
   */
  const onSubmitGeneratePrice = useCallback(async (e) => {
    e.preventDefault();
    let isAtLeastOneRecipeSelected = false;
    let tempTotal = 0;
    let isRecipeCountValid = true;
    const selectedRecipes = [];

    recipes.forEach(recipe => {
      if (recipe.select) {
        isAtLeastOneRecipeSelected = true;
        if (recipe.count <= 0) {
          isRecipeCountValid = false;
        } else {
          selectedRecipes.push(recipe);
          tempTotal += recipe.count * recipe.price;
        }
      }
    });

    if (!isAtLeastOneRecipeSelected) {
      setShowNoRecipesSelected(true);
      return;
    }

    if (!isRecipeCountValid) {
      setShowNoRecipeCountSelected(true);
      return;
    }

    let hasEnoughIngredients = true;
    for (const recipe of selectedRecipes) {
      if (recipe.recipeIngredients && Array.isArray(recipe.recipeIngredients)) {
        for (const ingredient of recipe.recipeIngredients) {
          const matchingIngredient = ingredients.find(i => i.name === ingredient.name);
          if (matchingIngredient && (matchingIngredient.amount < ingredient.amount * recipe.count)) {
            hasEnoughIngredients = false;
            break;
          }
        }
        if (!hasEnoughIngredients) break;
      }
    }

    if (!hasEnoughIngredients) {
      setShowInsufficientInventory(true);
      return;
    }

    setSelectedRecipesForPurchase(selectedRecipes);
    setFinalPrice(tempTotal);
    setPurchaseSectionFlag(true);
  }, [recipes, ingredients]); // Depends on recipes and ingredients

  /**
   * Handles payment submission
   * Updates inventory and processes payment
   * @param {Event} e - Form submission event
   */
  const onSubmitPay = useCallback(async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (selectedRecipesForPurchase && selectedRecipesForPurchase.length > 0) {
      const ingredientUpdates = [];

      selectedRecipesForPurchase.forEach(recipe => {
        if (recipe.recipeIngredients && Array.isArray(recipe.recipeIngredients)) {
          recipe.recipeIngredients.forEach(recipeIngredient => {
            const matchingIngredient = ingredients.find(ingredient => 
              ingredient.name === recipeIngredient.name
            );

            if (matchingIngredient) {
              const neededAmount = recipeIngredient.amount * recipe.count;
              const updatedAmount = matchingIngredient.amount - neededAmount;

              if (updatedAmount < 0) {
                throw new Error(`Not enough ${recipeIngredient.name} in stock`);
              }

              ingredientUpdates.push({
                id: matchingIngredient.id,
                name: recipeIngredient.name,
                amount: updatedAmount
              });
            }
          });
        }
      });

      try {
        await Promise.all(ingredientUpdates.map(ingredient => 
          axios.put(`${API_BASE_URL}/ingredient/${ingredient.id}`, ingredient)
        ));

        setShowInvalidPayment(false);
        setChange(inputPayment - finalPrice);
        setPurchaseSectionFlag(false);
        setShowGoodPayment(true);
        loadIngredients();
      } catch (error) {
        console.error("Error updating ingredients:", error);
        setShowInvalidPayment(true);
      }
    }
  }, [selectedRecipesForPurchase, ingredients, inputPayment, finalPrice, findFormErrors, loadIngredients]);

  // Unchanged return portion
  return (
    <>
      <Container>
        <div style={{paddingTop: "1em", paddingBottom: "1em"}}>
          <Card>
            <Card.Header as="h4">Current Recipes</Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => onSubmitGeneratePrice(e)}>
                <Form.Group>
                  {
                    recipes.length !== 0 ? (
                      <>
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>
                              <Form.Check
                                onChange={e => {
                                  let checked = e.target.checked;
                                  setRecipes(
                                    recipes.map(data => {
                                      data.select = checked;
                                      return data;
                                    })
                                  );
                                  setShowNoRecipesSelected(false)
                                  setShowNoRecipeCountSelected(false)
                                }}
                              ></Form.Check>
                            </th>
                            <th>Name</th>
                            <th>Price ($)</th>
                            <th>Count</th>
                          </tr>
                        </thead>
                        {recipes.map((d, i) => (
                          <tr key={d.id}>
                            <th scope="row">
                              <Form.Check
                                onChange={event => {
                                  let checked = event.target.checked;
                                  setRecipes(
                                    recipes.map(data => {
                                      if (d.id === data.id) {
                                        data.select = checked;
                                        console.log(data)
                                      }
                                      return data;
                                    })
                                  );
                                  setShowNoRecipesSelected(false)
                                  setShowNoRecipeCountSelected(false)
                                }}
                                type="checkbox"
                                checked={d.select}
                              ></Form.Check>
                            </th>
                            <td>{d.name}</td>
                            <td>{d.price}</td>
                            <td>
                              <Form.Control
                                type='number'
                                onChange={event => {
                                  let newAmount = event.target.value
                                  setRecipes(
                                    recipes.map(data => {
                                      if (d.id === data.id) {
                                        data.count = newAmount
                                        console.log(d)
                                      }
                                      return data;
                                    })
                                  );
                                  setShowNoRecipesSelected(false)
                                  setShowNoRecipeCountSelected(false)
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </Table>

                      <Alert show={showNoRecipesSelected} variant="danger" onClose={() => setShowNoRecipesSelected(false)}>
                        Please select at least one recipe to purchase
                      </Alert>

                      <Alert show={showNoRecipeCountSelected} variant="danger" onClose={() => setShowNoRecipeCountSelected(false)}>
                        Please enter a valid amount for the selected recipe
                      </Alert>

                      <Button variant="primary" type="submit">Generate Cost</Button>{' '}
                      </>
                    ) : (
                      <div body className="text-center">
                          There are no recipes in the system currently
                      </div>
                    )
                  }
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
          {
            purchaseSectionFlag === true ? (
              <Modal show={true} animation={true}>
                <Modal.Header>
                  <Modal.Title>Final Price: ${finalPrice}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form>
                    <Form.Label>Enter Payment</Form.Label>
                      <Form.Control
                        type='number'
                        isInvalid={ !!errors.price }
                        onChange={event => {
                          let newAmount = event.target.value
                          setField('price', event.target.value)
                          setInputPayment(newAmount)
                          setShowInvalidPayment(false)
                        }}
                      />
                      <Form.Control.Feedback type='invalid'>{ errors.price }</Form.Control.Feedback>
                  </Form>

                  <div style={{paddingTop: "1em"}}>
                    <Alert show={showInvalidPayment} variant="danger" onClose={() => setShowInvalidPayment(false)}>
                      Invalid payment. Please enter a valid payment
                    </Alert>   
                  </div>

                </Modal.Body>
                <Modal.Footer>
                  <Button variant="success" onClick={(e) => onSubmitPay(e)}>
                    Place Order
                  </Button>
                  <Button variant="danger" onClick={() => window.location.reload(true)}>
                    Close
                  </Button>
                </Modal.Footer>
              </Modal>
            ) : (null)
          }
        </div>
      </Container>
    <Modal show={showInsufficientInventory} onHide={() => setShowInsufficientInventory(false)} animation={true}>
      <Modal.Header>
        <Modal.Title>Oops</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Not enough ingredients in stock to complete this purchase. Sorry!
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => window.location.reload(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
      <Modal show={showGoodPayment} animation={true}>
        <Modal.Header>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Purchased successfully! Your change is: ${change}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => window.location.reload(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default PurchaseRecipes;