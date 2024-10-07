import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../api/axiosInstance"; // your axios instance with baseURL
import { Carousel } from "react-bootstrap"; // Bootstrap Carousel for image sliding
import { useNavigate } from "react-router-dom";

const ViewProductsPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(123456789);
  const [sortOrder, setSortOrder] = useState("asc"); // State for sorting order
  const URI = import.meta.env.VITE_API_URI;

  const fetchProducts = async (queryParams = {}) => {
    try {
      const response = await axiosInstance.get("product/search", {
        params: queryParams,
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  console.log("Products:", products);

  const handleSearch = () => {
    const queryParams = {
      name: "~"+searchTerm,
      price: `${minPrice}-${maxPrice}`,
    };
    fetchProducts(queryParams);
  };

  // Sorting products by sumOfRatings
  const handleSort = () => {
    const sortedProducts = [...products].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.sumOfRatings - b.sumOfRatings;
      } else {
        return b.sumOfRatings - a.sumOfRatings;
      }
    });
    setProducts(sortedProducts);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // Toggle sort order
  };

  return (
    <div>
      <h1>View Products</h1>

      {/* Search and filter form */}
      <Form className="mb-4">
        <Form.Group controlId="search">
          <Form.Label>Search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by product name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="minPrice">
          <Form.Label>Min Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="maxPrice">
          <Form.Label>Max Price</Form.Label>
          <Form.Control
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" onClick={handleSearch}>
          Search
        </Button>
      </Form>

      {/* Sorting button */}
      <Button variant="secondary" className="mb-4" onClick={handleSort}>
        Sort by Ratings ({sortOrder === "asc" ? "Ascending" : "Descending"})
      </Button>

      {/* Products display */}
      <div className="d-flex flex-wrap">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product._id} style={{ width: "18rem", margin: "10px" }}>
              {/* Image Carousel for sliding images */}
              <Carousel>
                {product.pictures.length > 0 ? (
                  product.pictures.map((picture, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={`${URI}${picture}`}
                        alt={`Slide ${index + 1}`}
                        style={{ height: "200px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))
                ) : (
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="placeholder.png"
                      alt="Placeholder"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                  </Carousel.Item>
                )}
              </Carousel>
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>Price: ${product.price}</Card.Text>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text>Rating: {product.sumOfRatings}</Card.Text>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/products/${product._id}`)}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default ViewProductsPage;
