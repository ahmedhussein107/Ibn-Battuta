import Button from "react-bootstrap/esm/Button";
import Card from "react-bootstrap/Card";
// import {URI} from "../../api/axiosInstance";
const ProductCard = (product) => {
	return (
		<Card style={{ width: "18rem" }}>
			{/* <Card.Img variant="top" src={`${URI}/images/${product.picture[0]}`}/> */}
			<Card.Body>
				<Card.Title>{product.name}</Card.Title>
				<Card.Text>
					
				</Card.Text>
				<Button variant="primary">Go somewhere</Button>
			</Card.Body>
		</Card>
	);
};
