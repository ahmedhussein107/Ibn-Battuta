export const guestNavbarItems = [
    { Home: "/" },
    {
        Explore: [
            { Activities: "/activities" },
            { Itineraries: "/itineraries" },
            { Landmarks: "/landmarks" },
        ],
    },
    { Shop: "/shop" },
    { Guide: "/demo" },
];

export const touristNavbarItems = [
    { Home: "/" },
    {
        Explore: [
            { Activities: "/activities" },
            { Itineraries: "/itineraries" },
            { Landmarks: "/landmarks" },
        ],
    },
    {
        Travel: [
            { Flights: "/tourist/flight/offers" },
            { Hotels: "/tourist/hotel/offers" },
        ],
    },
    { Shop: "/shop" },
    { Guide: "/demo" },
];

export const sellerNavbarItems = [
    { Home: "/seller" },
    { Browse: "/shop" },
    { Inventory: "/seller/inventory" },
    { Analytics: "/seller/analytics" },
];

export const tourGuideNavbarItems = [
    { Home: "/tourGuide" },
    { Browse: [{ Activites: "/activities" }, { Itineraries: "/itineraries" }] },
    { "My Tours": "/tourguide/assigned" },
    { Analytics: "/tourguide/analytics" },
];

export const advertiserNavbarItems = [
    { Home: "/advertiser" },
    { Browse: "/activities" },
    { "My Activities": "/advertiser/assigned" },
    { Analytics: "/advertiser/analytics" },
];

export const governorNavbarItems = [
    { Home: "/governor" },
    { Browse: "/landmarks" },
    {
        "Tourism Management": [
            { Landmarks: "/governor/landmarks" },
            { Tags: "/governor/landmarkTags" },
        ],
    },
];

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
            // { Analytics: "/admin/analytics" },
        ],
    },
    {
        Categorization: [{ Tags: "/admin/tags" }, { Category: "/admin/categories" }],
    },
    { PromoCode: "/admin/promocode" },
];
