import React from "react";
import { useState } from "react";

import CheckoutPopup from "./CheckoutPopup";

const Test = () => {
    const [isOpen, setIsOpen] = useState(true);
    const items = [
        { title: "Item 1", price: 10 },
        { title: "Item 2", price: 20 },
    ];
    return <CheckoutPopup isOpen={isOpen} setIsOpen={setIsOpen} items={items} />;
};
export default Test;
