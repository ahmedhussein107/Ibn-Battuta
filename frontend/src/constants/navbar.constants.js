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
            { Flights: "/flights" },
            { Hotels: "/hotels" },
            { Packages: "/packages" },
        ],
    },
    { Shop: "/shop" },
];

export const sellerNavbarItems = [
    { Home: "/seller" },
    { Browse: "/shop" },
    { Inventory: "/seller/inventory" },
    { Analytics: "/analytics" },
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
    { Inventory: "/inventory" },
    {
        "Manage Users": [
            { "Users List": "/admin/users" },
            { "Pending Users": "/admin/pending" },
            { Complaints: "/admin/complaints" },
        ],
    },
    {
        Browse: [
            { Activities: "/activities" },
            { Itineraries: "/itineraries" },
            { Landmarks: "/landmarks" },
            { Products: "/shop" },
        ],
    },
    { Categorization: [{ Tags: "/admin/tags" }, { Category: "/admin/category" }] },
];
