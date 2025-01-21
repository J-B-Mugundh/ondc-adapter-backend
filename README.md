# 🚀 Revolutionizing E-commerce Connectivity through Interoperable Adapters 🚀


## Problem Statement 💡

Seamless Integration on Open Networks using ONDC protocols

## Objectives 🎯

🎯Develop a central integration hub connecting ONDC with Shopify, WooCommerce, Saleor, and future platforms.

🎯Standardize authentication, catalog management, and order workflows to eliminate platform silos.

🎯Offer a seamless and scalable onboarding solution that leverages sellers' existing infrastructure without disruptive migrations.

🎯Translate ONDC protocol requests into platform-specific APIs for smooth interoperability.

🎯Ensure flexibility and scalability using loosely coupled adapters and MongoDB's dynamic schema.

## Deliverables 📦

📦**Platform Interoperability**:

Build an adapter for seamless ONDC communication with platforms like Shopify, WooCommerce, and Saleor.

Support integration with additional platforms as needed.

📦**Standardized Workflows**:

Unify catalog updates, order processing, and authentication workflows compatible with ONDC protocols.

📦**Scalable Architecture**:

Implement a microservices-based design with loosely coupled adapters.

Use MongoDB’s dynamic schema for modular and scalable data management.

📦**Unified Gateway**:

Create a single entry point for efficient interaction with the ONDC registry and e-commerce platforms.

## Features 🌟

🌟**Microservices Design**: 

Dedicated adapters for Shopify, WooCommerce, etc.
Central gateway for seamless orchestration.

🌟**Data Flexibility & Integration**:

MongoDB aggregates diverse data formats with flexible schemas.
API Translator adapts ONDC calls to platform-specific APIs.

🌟**Native Integration**: 

Utilizes existing catalog, order, and authentication systems.
Eliminates seller-side server dependencies.

🌟**Seamless Sync**: 

Instant Updates as adapter syncs product data (inventory, price, availability) in real time between ONDC and the seller’s platform,
ensuring up-to-date information on both ends.

🌟**Easy Seller Onboarding**: 

Simple, step-by-step registration process with minimal input required, allowing sellers to quickly 
get started without technical expertise.

## Tech Stack 🛠️

Frontend:
- HTML
- tailwindcss
- ReactJS

Backend:
- NodeJs
- ExpressJs

Database:
- MongoDB

Platforms Used:
- Shopify
- Woocommerce
- Saleor
  
Deployment:
- AWS
  
<img src="ArchitecturePics/MINDMATE.AI.png" alt="Architecture">
<img src="ArchitecturePics/MINDMATE.AI (1).png" alt="Architecture">
<img src="ArchitecturePics/MINDMATE.AI (2).png" alt="Architecture">


## Alignment with ONDC goals 🎯

- **Seller Inclusivity**: Onboards sellers from existing platforms like Shopify effortlessly.
- **Scalable Growth**:Modular microservices architecture allows easy addition of new platforms.
- **Buyer Centric**:Offers buyers access to a unified marketplace with diverse products.
- **Optimized Connectivity**:The adapter acts as a bridge, efficiently linking ONDC protocols with seller platforms, ensuring smooth and reliable data exchange.

## How to run (Unit testing)?

---

## 

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/EduConnect.git
```

---

## Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd ondc-apdater-backend
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Rename `.env.example` to `.env`.
   - Add the necessary environment variables such as MONGO_DB_URL

4. Run the backend server:

   ```bash
   npm run dev
   ```

---

## Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd ondc-apdater-frontend
   ```

2. Install frontend dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables:

   - Rename `.env.example` to `.env`.
   -  Add the necessary environment variables such as REACT_APP_API_URL.

4. Run the frontend application:

   ```bash
   npm start
   ```

---

## Additional Notes

- Make sure you have Node.js and npm installed on your system.
- Use MongoDB as your database, and ensure the connection string is properly set in the backend `.env` file.

For any issues or further assistance, please refer to the project documentation or raise an issue in the repository.



## Team Details 👥
- Mugundh J B, 4th year, B.E. CSE, Madras Institute of Technology
- Bhuvana A, 4th year, B.E. CSE, KL University
- Santhosh C, 3rd year, B.E. CSE, Madras Institute of Technology
- Badrinath S, 3rd year, B.E. CSE, Madras Institute of Technology
- Lokesh D, 3rd year, B.E. CSE, Madras Institute of Technology
