import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, Container, Table, Button } from "react-bootstrap";

// Configuration Constants
const API_BASE_URL = "http://localhost:8080"; // Base URL for API endpoints

/**
 * ViewRecipe Component
 * Displays details of a single recipe including its name, price, and ingredients
 * @returns {JSX.Element} The rendered recipe view component
 */
const ViewRecipe = () => {
  // State Management
  const [recipe, setRecipe] = useState({
    name: "",              // Recipe name
    price: "",             // Recipe price
    recipeIngredients: [], // List of ingredients
  });

  // Navigation and Parameters
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { id } = useParams();     // Recipe ID from URL parameters

  /**
   * Fetches recipe data from the backend API
   * Updates state with fetched data
   * Memoized to prevent unnecessary re-renders
   */
  const fetchRecipe = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/recipe/${id}`);
      setRecipe(response.data);
    } catch (error) {
      console.error("Error fetching recipe:", error);
    }
  }, [id]); // Dependency: id from useParams

  /**
   * Effect hook to fetch recipe data on component mount
   * Runs once when component loads or when id changes
   */
  useEffect(() => {
    fetchRecipe();
  }, [fetchRecipe]); // Include fetchRecipe as dependency

  // Render unchanged UI
  return (
    <>
      <Container>
        <div style={{ paddingTop: "1em" }}>
          {/* Recipe Header */}
          <Card>
            <Card.Header as="h4">
              Viewing Recipe: {recipe.name}
            </Card.Header>
            <Card.Body>
              {/* Recipe Price Section */}
              <div style={{ paddingBottom: "1em" }}>
                <strong>Price</strong>
              </div>
              <div style={{ paddingBottom: "1em" }}>
                <Card body>${recipe.price}</Card>
                {/* Ingredients Section */}
                <div style={{ paddingTop: "1em" }}>
                  <strong>Ingredients</strong>
                </div>
              </div>

              {/* Ingredients Table */}
              <Card body>
                <Table striped hover>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.recipeIngredients.map((ingredient, index) => (
                      <tr key={index}>
                        <td>{ingredient.name}</td>
                        <td>{ingredient.amount}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card>
            </Card.Body>
          </Card>

          {/* Return Button */}
          <div style={{ paddingTop: "1em" }}>
            <Button variant="danger" onClick={() => navigate("/recipes")}>
              Return
            </Button>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ViewRecipe;