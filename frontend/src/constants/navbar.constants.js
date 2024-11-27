export const guestNavbarItems = [
    { Home: "/" },
    {
        Explore: [
            { Activities: "/activities" },
            { Itineraries: "/itineraries" },
            { Landmark: "/landmarks" },
        ],
    },
    { Shop: "/shop" },
];

export const touristNavbarItems = [
    { Home: "/" },
    {
        Explore: [
            { Activities: "/activities" },
            { Itineraries: "/itineraries" },
            { Landmark: "/landmarks" },
        ],
    },
    {
        Travel: [
            { Flights: "tourist/flight/offers" },
            { Hotels: "tourist/hotel/offers" },
        ],
    },
    { Shop: "/shop" },
];

export const sellerNavbarItems = [
    { Home: "/seller" },
    { Browse: "seller/shop" },
    { Inventory: "seller/inventory" },
    { Analytics: "seller/analytics" },
];

export const tourGuideNavbarItems = [
    { Home: "/tourGuide" },
    { Browse: [{ Activites: "/activities" }, { Itineraries: "/itineraries" }] },
    { Assigned: "/tourGuide/assigned" },
    { Analytics: "/analytics" },
];

export const advertiserNavbarItems = [
    { Home: "/advertiser" },
    { Browse: "/activities" },
    { Assigned: "/advertiser/assigned" },
    { Analytics: "analytics" },
];

export const governorNavbarItems = [{ Home: "/governor" }, { Browse: "/landmarks" }];

export const adminNavbarItems = [
    { Dashboard: "/admin" },
    { Inventory: "/admin/inventory" },
    {
        "Manage Users": [
            { "Users List": "/admin/users" },
            { "Pending Users": "/admin/users/pending" },
            { Complaints: "/admin/complaints" },
        ],
    },
    {
        Browse: [
            { Activities: "/admin/activities" },
            { Itineraries: "/admin/itineraries" },
            { Landmarks: "/landmarks" },
            { Products: "/shop" },
        ],
    },
    { Categorization: [{ Tags: "/admin/tags" }, { Category: "/admin/categories" }] },
];
