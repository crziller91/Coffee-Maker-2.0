import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Form, Button, Card, Container, Row, Col } from 'react-bootstrap';

// Configuration Constants
const API_BASE_URL = "http://localhost:8080"; // Base URL for API endpoints

/**
 * EditIngredient Component
 * Handles editing of a single ingredient's details
 * @returns {JSX.Element} Form component for editing ingredient
 */
const EditIngredient = () => {
  // State Management
  const [formData, setFormData] = useState({
    name: "",  // Ingredient name
    amount: "" // Ingredient quantity
  });
  const [errors, setErrors] = useState({}); // Form validation and API errors
  const [isLoading, setIsLoading] = useState(true); // Loading state for API calls
  
  // Navigation and Route Parameters
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { id } = useParams(); // Extract ingredient ID from URL

  /**
   * Effect hook to load ingredient data on component mount
   * Fetches ingredient details from API using the provided ID
   */
  useEffect(() => {
    const fetchIngredient = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${API_BASE_URL}/ingredient/${id}`);
        setFormData(response.data); // Populate form with fetched data
      } catch (error) {
        console.error("Error loading ingredient:", error);
        setErrors({ general: "Failed to load ingredient data" });
      } finally {
        setIsLoading(false); // Ensure loading state is cleared
      }
    };

    fetchIngredient();
  }, [id]); // Re-run if ID changes

  /**
   * Handles form field changes
   * @param {string} field - The field name to update (name or amount)
   * @returns {function} Event handler for input changes
   */
  const handleChange = (field) => (e) => {
    const value = field === 'amount' ? parseFloat(e.target.value) || "" : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear field-specific error when corrected
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  /**
   * Validates form fields
   * @returns {Object} Object containing validation errors
   */
  const validateForm = () => {
    const newErrors = {};
    const { name, amount } = formData;

    // Name validation
    if (!name?.trim()) newErrors.name = "Name is required";
    
    // Amount validation
    if (amount === "" || amount === null) newErrors.amount = "Amount is required";
    else if (isNaN(amount) || amount <= 0) newErrors.amount = "Amount must be greater than 0";

    return newErrors;
  };

  /**
   * Handles form submission
   * Validates data and updates ingredient via API
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    // Check for validation errors before submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.put(`${API_BASE_URL}/ingredient/${id}`, formData);
      navigate("/inventory"); // Redirect to inventory on success
    } catch (error) {
      console.error("Error updating ingredient:", error);
      setErrors({ general: "Failed to update ingredient" });
    }
  };

  // Render loading state
  if (isLoading) {
    return <Container>Loading ingredient data...</Container>;
  }

  // Main component render
  return (
    <Container className="py-3">
      <Card>
        <Card.Header as="h4">
          Editing Ingredient: {formData.name || "Loading..."}
        </Card.Header>
        <Card.Body>
          {/* Display general API errors if they exist */}
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              {errors.general}
            </div>
          )}
          
          {/* Ingredient edit form */}
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              {/* Name input field */}
              <Form.Group as={Col}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name || ""}
                  onChange={handleChange("name")}
                  isInvalid={!!errors.name}
                  placeholder="Enter ingredient name"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name}
                </Form.Control.Feedback>
              </Form.Group>
              
              {/* Amount input field */}
              <Form.Group as={Col}>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type="number"
                  step="0.1" // Allow decimal values
                  value={formData.amount || ""}
                  onChange={handleChange("amount")}
                  isInvalid={!!errors.amount}
                  placeholder="Enter amount"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.amount}
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            
            {/* Form action buttons */}
            <div className="d-flex gap-2">
              <Button type="submit" variant="primary">
                Update Ingredient
              </Button>
              <Button 
                variant="danger" 
                onClick={() => navigate("/inventory")}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditIngredient;