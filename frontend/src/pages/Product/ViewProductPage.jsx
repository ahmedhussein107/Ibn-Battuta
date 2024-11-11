import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { Carousel } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import convert from "../../api/convert";
import Cookies from "js-cookie";
const ViewProductPage = () => {
    const { productId } = useParams(); // Get product ID from the URL
    const [product, setProduct] = useState(null);

    const fetchProductDetails = async () => {
        try {
            const response = await axiosInstance.get(`product/getProduct/${productId}`);
            setProduct(response.data);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    };

    useEffect(() => {
        fetchProductDetails();
    }, [productId]);

    if (!product) {
        return <p>Loading product details...</p>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <Card style={{ width: "100%", margin: "20px auto" }}>
                <Carousel>
                    {product.pictures.length > 0 ? (
                        product.pictures.map((picture, index) => (
                            <Carousel.Item key={index}>
                                <img
                                    className="d-block w-100"
                                    src={`${picture}`}
                                    alt={`Slide ${index + 1}`}
                                    style={{ height: "400px", objectFit: "cover" }}
                                />
                            </Carousel.Item>
                        ))
                    ) : (
                        <Carousel.Item>
                            <img
                                className="d-block w-100"
                                src="placeholder.png"
                                alt="Placeholder"
                                style={{ height: "400px", objectFit: "cover" }}
                            />
                        </Carousel.Item>
                    )}
                </Carousel>

                <Card.Body>
                    <Card.Text>
                        <strong>Price:</strong> {Cookies.get("currency") || "EGP"}
                        {convert(product.price)}
                    </Card.Text>
                    <Card.Text>
                        <strong>Description:</strong> {product.description}
                    </Card.Text>
                    <Card.Text>
                        <strong>Owner Type:</strong> {product.ownerType}
                    </Card.Text>
                    <Card.Text>
                        <strong>Quantity:</strong> {product.quantity}
                    </Card.Text>
                    <Card.Text>
                        <strong>Number of Sales:</strong> {product.numberOfSales}
                    </Card.Text>
                    <Card.Text>
                        <strong>Sum of Ratings:</strong> {product.sumOfRatings}
                    </Card.Text>
                    <Card.Text>
                        <strong>Created At:</strong>{" "}
                        {new Date(product.createdAt).toLocaleString()}
                    </Card.Text>
                    <Card.Text>
                        <strong>Updated At:</strong>{" "}
                        {new Date(product.updatedAt).toLocaleString()}
                    </Card.Text>
                    <Button variant="primary">Buy Now</Button>
                </Card.Body>
            </Card>
        </div>
    );
};

export default ViewProductPage;
