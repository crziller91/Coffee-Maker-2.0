import Container from 'react-bootstrap/Container';
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Alert from 'react-bootstrap/Alert';

export default function Recipes() {

  let amountFlag = true
  let overFlag = true
  
  const [recipeName, setRecipeName] = useState("")
  const [recipePrice, setRecipePrice] = useState("")
  const [selectedIngredients, setSelectedIngredients] = useState([])
  const [ingredients, setIngredients] = useState([])
  const [inventory, setInventory] = useState([])

  const [showDeleteAll, setShowDeleteAll] = useState(false)

  const [show, setShow] = useState(false)
  const [showInvalidNumber, setShowInvalidNumber] = useState(false)
  const [showOver, setShowOver] = useState(false)

  const [recipes, setRecipes] = useState([])

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

  let navigate = useNavigate();

  useEffect(() => {
    loadIngredients();
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    const result = await axios.get("http://localhost:8080/recipes");
    setRecipes(result.data);
  };

  const loadIngredients = async () => {
    const result = await axios.get("http://localhost:8080/ingredients");
    setInventory(result.data)
    setIngredients(
      result.data.map(d => {
        return {
          select: false,
          amountChanged: false,
          id: d.id,
          name: d.name,
          amount: d.amount,
        };
      })
    );
  };

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    // Check and see if errors exist, and remove them from the error object:
    if ( !!errors[field] ) setErrors({
      ...errors,
      [field]: null
    })
  }

  const findFormErrors = () => {
    const { name, price } = form
    const newErrors = {}
    
    if (!name || name === '') newErrors.name = 'Please enter a name'
    if (!price) newErrors.price = 'Please enter a price'
    if (price <= 0) newErrors.price = 'Price must be greater than 0'

    return newErrors
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors()
    // Conditional logic:
    if ( Object.keys(newErrors).length > 0 ) {
      // We got errors!
      setErrors(newErrors)
    } else {
      let i = 0
      ingredients.forEach(ingredient => {
        if (ingredient.select) {
          if (ingredient.amountChanged && ingredient.amount > 0) {
            if (ingredient.amount <= inventory[i].amount) {
              console.log(inventory[i])
              let finalRecipeIngredient = {
                name: ingredient.name,
                amount: ingredient.amount
              }
              selectedIngredients.push(finalRecipeIngredient)
            } else {
              overFlag = false
            }
          } else {
            amountFlag = false
          }
        }
        i++
      })
      if (amountFlag) {
        if (overFlag) {
          if (selectedIngredients.length !== 0) {
            let finalRecipe = {
              name: recipeName,
              price: recipePrice,
              recipeIngredients: selectedIngredients
            }
            console.log(finalRecipe)
            await axios.post("http://localhost:8080/recipe", finalRecipe);
            console.log(inventory)
            console.log(ingredients)
            window.location.reload(false);
          } else {
            setSelectedIngredients([])
            setShow(true)
          }
        } else {
          setSelectedIngredients([])
          setShowOver(true)
        }
      } else {
        setSelectedIngredients([])
        setShowInvalidNumber(true)
      }
    }
  }

  const deleteRecipe = async (id) => {
    await axios.delete(`http://localhost:8080/recipe/${id}`);
    loadRecipes();
    window.location.reload(false);
  }

  const deleteAllRecipes = async () => {
    recipes.forEach(recipe => {
      axios.delete(`http://localhost:8080/recipe/${recipe.id}`);
    })
    loadRecipes();
    window.location.reload(false);
  }

  const handleRecipeNameChange = (event) => {
    setShow(false)
    setShowInvalidNumber(false)
    setShowOver(false)
    console.log(event.target.value)
    setRecipeName(event.target.value)
    setField('name', event.target.value)
  }

  const handleRecipePriceChange = (event) => {
    setShow(false)
    setShowInvalidNumber(false)
    setShowOver(false)
    console.log(event.target.value)
    setRecipePrice(event.target.value)
    setField('price', event.target.value)
  }

  return (
    <>
      <Container>
        <div style={{paddingTop: "1em"}}>
          <div style={{paddingBottom: "1em"}}>
            <Card>
              <Card.Header as="h4">Current Recipes</Card.Header>
                <Card.Body>
                  {
                    recipes.length !== 0 ? (
                      <Table striped hover>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Price ($)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recipes.map((recipe, index) => (
                                <tr>
                                  <td>{recipe.name}</td>
                                  <td>{recipe.price}</td>
                                  <td width="217">
                                    <Button variant="success" onClick={() => navigate(`/viewrecipe/${recipe.id}`)}>Recipe Details</Button>{' '}
                                    <Button variant="danger" onClick={() => deleteRecipe(recipe.id)}>Delete</Button>
                                  </td>
                                </tr>
                              ))}
                        </tbody>
                      </Table>
                    ) : (
                      <div className="text-center">
                        Their are no recipes in the system currently
                      </div>
                    )
                  }
                  {
                  recipes.length !== 0 ? (
                    <div div class="d-flex justify-content-end">
                      <Button variant="danger" onClick={() => setShowDeleteAll(true)}>Delete All</Button>
                    </div>
                  ) : (null)
                  }
                </Card.Body>
            </Card>
          </div>
          <Card>
            <Card.Header as="h4">Add Recipe</Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => onSubmit(e)}>
                  <Form.Group className="mb-3" controlId="recipeName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type='text'
                      name="recipeName"
                      value={recipeName}
                      isInvalid={ !!errors.name }
                      onChange={handleRecipeNameChange}
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.name }</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="recipePrice">
                    <Form.Label>Price ($)</Form.Label>
                    <Form.Control
                      type='number'
                      name="recipePrice"
                      value={recipePrice}
                      isInvalid={ !!errors.price }
                      onChange={handleRecipePriceChange}
                    />
                    <Form.Control.Feedback type='invalid'>{ errors.price }</Form.Control.Feedback>
                  </Form.Group>

                  <Alert show={show} variant="danger" onClose={() => setShow(false)}>
                      Please select at least one ingredient
                  </Alert>

                  <Alert show={showInvalidNumber} variant="danger" onClose={() => setShowInvalidNumber(false)}>
                      Ingredient amount(s) cannot be blank
                  </Alert>

                  <Alert show={showOver} variant="danger" onClose={() => setShowOver(false)}>
                      Ingredient amount(s) entered is more than whats available
                  </Alert>

                  <Form.Group>
                    <Form.Label>Ingredients</Form.Label>
                    {
                      ingredients.length !== 0 ? (
                        <>
                        <Table striped hover>
                          <thead>
                            <tr>
                              <th>
                              <Form.Check
                                onChange={e => {
                                  let checked = e.target.checked;
                                  setShow(false)
                                  setShowInvalidNumber(false)
                                  setShowOver(false)
                                  setIngredients(
                                    ingredients.map(d => {
                                      d.select = checked;
                                      return d;
                                    })
                                  );
                                }}
                              ></Form.Check>
                              </th>
                              <th>Name</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          {ingredients.map((d, i) => (
                          <tr key={d.id}>
                            <th scope="row">
                              <Form.Check
                                onChange={event => {
                                  setShow(false)
                                  setShowInvalidNumber(false)
                                  setShowOver(false)
                                  let checked = event.target.checked;
                                  setIngredients(
                                    ingredients.map(data => {
                                      if (d.id === data.id) {
                                        data.select = checked;
                                        console.log(data)
                                      }
                                      return data;
                                    })
                                  );
                                }}
                                type="checkbox"
                                checked={d.select}
                              ></Form.Check>
                            </th>
                            <td>{d.name}</td>
                            <td>
                            <Form.Control
                            type='number'
                            min="1"
                              onChange={event => {
                                let newAmount = event.target.value
                                setShow(false)
                                setShowInvalidNumber(false)
                                setShowOver(false)
                                setIngredients(
                                  ingredients.map(data => {
                                    if (d.id === data.id) {
                                      data.amountChanged = true
                                      data.amount = newAmount;
                                      if (d.select) {
                                        console.log(newAmount)
                                      }
                                    }
                                    return data;
                                  })
                                );
                              }}
                            />
                            </td>
                          </tr>
                        ))}
                        </Table>
                        <Button variant="primary" type="submit">Add Recipe</Button>{' '}
                        </>
                      ) : (
                        <>
                        <div style={{paddingBottom: "1em"}}>
                          <Card body className="text-center">The inventory is currently empty</Card>
                        </div>
                        <Button variant="primary" type="submit" disabled>Add Recipe</Button>{' '}
                        </>
                      )
                    }
                  </Form.Group>
                </Form>
              </Card.Body>
          </Card>
          
        </div>
      </Container>
      <Modal show={showDeleteAll} onHide={() => window.location.reload(false)} animation={true}>
        <Modal.Header>
          <Modal.Title>Delete All</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to delete all of the recipes?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => deleteAllRecipes()}>
            Yes
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteAll(false)}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );

}
