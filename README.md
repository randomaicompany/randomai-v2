# Generative AI E-Commerce Store

---

## Introduction

This repository contains the codebase for an e-commerce store specialized in selling generatively designed products. The platform integrates several technologies to provide a seamless experience for both sellers and customers.

---

## Technology Stack

- **Stack**: SvelteKit for UI
- **Styling**: TailwindCSS for responsive design
- **HTTP Requests**: Axios for API calls
- **Print-On-Demand Service**: Custom integration between Printful and Shopify
- **E-commerce Backend**: Shopify Buy SDK
- **Image Optimization**: PicsArt for upscaling and Background Removal Service for cleaning images
- **Generative AI**: Replicate AI to create custom designs / stable diffusion
- **CMS**: Prismic.io for content management
- **Cloud Storage**: Google Cloud Storage for image saving

---

## Key Features

- **Custom Printful-Shopify Integration**
  - Enables app-level authentication
  - Utilizes a webhook for automating order creation
- **AI-Driven Workflow**
  - Processes each order through an AI pipeline
  - Generates a new draft order within Printful
- **SKU Management in Shopify**
  - Products in Printful are manually added with Shopify using `template_variantId`. Do not make changes to this unless you know what you're doing.
- **Dynamic CMS through Prismic**
  - Allows for a customizable user experience
  - Supports AI-driven design configurations
- **SliceMachine Content**
  - Repository includes SliceMachine content for CMS
  - Navigate to the folder and install dependencies to add more slices

---

## Quick Start Guide

1. **Clone the Repository**
   ```bash
   git clone
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Run Development Server**

   ```bash
   npm run dev
   ```

4. **SliceMachine Setup**
   ```bash
   cd slicemachine
   npm install
   npm run slicemachine
   ```
