import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axiosInstance from "../../api/axiosInstance"; // your axios instance with baseURL

const ViewProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(123456789);

    const fetchProducts = async (queryParams = {}) => {
        try {
            console.log("Query params:", queryParams);
            const response = await axiosInstance.get("product/search", {
                params: queryParams,
            });
            setProducts(response.data);
            console.log("Products fetched:", response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleSearch = () => {
        const queryParams = {
            name: "~" + searchTerm,
            price: `${minPrice}-${maxPrice}`,
        };
        fetchProducts(queryParams);
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

            {/* Products display */}
            <div className="d-flex flex-wrap">
                {products.length > 0 ? (
                    products.map((product) => (
                        <Card
                            key={product._id}
                            style={{ width: "18rem", margin: "10px" }}
                        >
                            <Card.Img
                                variant="top"
                                src={product.pictures[0] || "placeholder.png"}
                                alt={product.name}
                            />
                            <Card.Body>
                                <Card.Title>{product.name}</Card.Title>
                                <Card.Text>Price: ${product.price}</Card.Text>
                                <Card.Text>{product.description}</Card.Text>
                                <Button variant="primary">View Details</Button>
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
