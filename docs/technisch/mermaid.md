---
title: Mermaid Chart
---

    A[Homepage] --> B[Browse Games]
    B --> C[View Game Details]
    C --> D[Add to Cart]
    D --> E[View Cart]
    E --> F[Proceed to Checkout]
    F --> G[Login / Register]
    G --> H[Enter Shipping Info]
    H --> I[Enter Payment Info]
    I --> J[Review Order]
    J --> K[Place Order]
    K --> L[Order Confirmation]

    %% Optional paths
    G -->|Already Logged In| H
    E -->|Update Quantity / Remove Item| D
    D -->|Search for more games| B
    E -->|Search for more games| B
    B --> M[Search Games]
    M --> C

