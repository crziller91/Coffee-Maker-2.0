import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Form, Button, Table, Modal, Container, Row, Col } from 'react-bootstrap';

// Configuration Constants
const API_BASE_URL = "http://localhost:8080"; // Base URL for API endpoints

/**
 * Inventory Component
 * Manages the display and modification of inventory ingredients
 * @returns {JSX.Element} Inventory management interface
 */
const Inventory = () => {
  // Navigation
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Modal States
  const [showIngredientExists, setShowIngredientExists] = useState(false); // Alert for duplicate ingredient
  const [showDeleteAll, setShowDeleteAll] = useState(false); // Confirmation for deleting all ingredients

  // Inventory State
  const [ingredients, setIngredients] = useState([]); // List of inventory ingredients
  
  // Form States (unused legacy states removed)
  const [form, setForm] = useState({}); // Form data for new ingredient
  const [errors, setErrors] = useState({}); // Form validation errors

  /**
   * Effect hook to load initial inventory data
   * Fetches ingredients on component mount
   */
  useEffect(() => {
    loadIngredients();
  }, []);

  /**
   * Fetches ingredients from API
   */
  const loadIngredients = async () => {
    try {
      const result = await axios.get(`${API_BASE_URL}/ingredients`);
      setIngredients(result.data);
    } catch (error) {
      console.error("Error loading ingredients:", error);
    }
  };

  /**
   * Deletes a single ingredient by ID
   * @param {number} id - Ingredient ID to delete
   */
  const deleteIngredient = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/ingredient/${id}`);
      loadIngredients();
      window.location.reload(false); // Refresh page after deletion
    } catch (error) {
      console.error("Error deleting ingredient:", error);
    }
  };

  /**
   * Deletes all ingredients in inventory
   */
  const deleteAllIngredients = async () => {
    try {
      await Promise.all(ingredients.map(ingredient => 
        axios.delete(`${API_BASE_URL}/ingredient/${ingredient.id}`)
      ));
      loadIngredients();
      window.location.reload(false); // Refresh page after deletion
    } catch (error) {
      console.error("Error deleting all ingredients:", error);
    }
  };

  /**
   * Updates form field values and clears related errors
   * @param {string} field - Form field name (name or amount)
   * @param {string|number} value - New field value
   */
  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  /**
   * Validates form data for new ingredient
   * @returns {Object} Validation errors
   */
  const findFormErrors = () => {
    const { name, amount } = form;
    const newErrors = {};
    
    if (!name?.trim()) newErrors.name = 'Please enter a name';
    if (!amount) newErrors.amount = 'Please enter an amount';
    else if (amount <= 0) newErrors.amount = 'Amount must be greater than 0';

    return newErrors;
  };

  /**
   * Handles form submission for adding new ingredient
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = findFormErrors();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const finalIngredient = {
      name: form.name,
      amount: parseFloat(form.amount) // Ensure amount is a number
    };

    try {
      await axios.post(`${API_BASE_URL}/ingredient`, finalIngredient);
      window.location.reload(false); // Refresh page after successful addition
    } catch (err) {
      console.error("Error adding ingredient:", err.response?.data);
      setShowIngredientExists(true); // Show error if ingredient exists
    }
  };

  // Component render
  return (
    <Container className="py-3">
      {/* Inventory List Section */}
      <Card className="mb-4">
        <Card.Header as="h4">Current Inventory</Card.Header>
        <Card.Body>
          {ingredients.length !== 0 ? (
            <>
              {/* Ingredients Table */}
              <Table striped hover>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {ingredients.map((ingredient, index) => (
                    <tr key={ingredient.id}>
                      <th scope="row">{index + 1}</th>
                      <td>{ingredient.name}</td>
                      <td>{ingredient.amount}</td>
                      <td width="149">
                        <Button 
                          variant="success" 
                          onClick={() => navigate(`/editingredient/${ingredient.id}`)}
                          className="me-2"
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="danger" 
                          onClick={() => deleteIngredient(ingredient.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              
              {/* Delete All Button */}
              <div className="d-flex justify-content-end">
                <Button 
                  variant="danger" 
                  onClick={() => setShowDeleteAll(true)}
                >
                  Delete All
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center">
              The inventory is currently empty
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Add Ingredient Section */}
      <Card>
        <Card.Header as="h4">Add Ingredient</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  onChange={e => setField('name', e.target.value)}
                  isInvalid={!!errors.name}
                  placeholder="Enter ingredient name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group as={Col}>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1"
                  onChange={e => setField('amount', e.target.value)}
                  isInvalid={!!errors.amount}
                  placeholder="Enter amount"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Button type="submit">Add Ingredient</Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Error Modal for Duplicate Ingredient */}
      <Modal show={showIngredientExists} animation={true}>
        <Modal.Header>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Ingredient: {form.name} already exists
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="danger" 
            onClick={() => window.location.reload(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Delete All */}
      <Modal 
        show={showDeleteAll} 
        onHide={() => setShowDeleteAll(false)} 
        animation={true}
      >
        <Modal.Header>
          <Modal.Title>Delete All</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you would like to delete all of the ingredients?
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={deleteAllIngredients}
          >
            Yes
          </Button>
          <Button 
            variant="danger" 
            onClick={() => setShowDeleteAll(false)}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Inventory;