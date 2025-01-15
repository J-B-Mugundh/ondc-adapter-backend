const express = require("express");
const multer = require("multer");
const ShopifySeller = require("../models/ShopifySeller");
const { Binary } = require("mongodb");

// Create a new Shopify seller
const createShopifySeller = async (req, res) => {
  try {
    const { shopLink, accessKey, businessDetails, status, documentTypes } = req.body;

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Prepare documents array
    const documents = req.files.map((file, index) => ({
      documentType: documentTypes && documentTypes[index] ? documentTypes[index] : "Document Type",
      documentURL: new Binary(file.buffer), // Convert file buffer to BSON Binary
    }));

    // Create a new ShopifySeller document
    const seller = new ShopifySeller({
      shopLink,
      accessKey,
      businessDetails: JSON.parse(businessDetails), // Parse nested JSON
      documents, // Add the array of BSON documents
      status,
    });

    // Save the document in MongoDB
    await seller.save();

    res.status(201).json({
      message: "Shopify Seller created successfully",
      seller,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating Shopify Seller" });
  }
};

// Get all Shopify sellers
const getAllShopifySellers = async (req, res) => {
  try {
    const sellers = await ShopifySeller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Shopify sellers", error });
  }
};

// Get Shopify seller by ID
const getShopifySellerById = async (req, res) => {
  try {
    const seller = await ShopifySeller.findById(req.params.id);

    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.status(200).json({
      seller,
    });
  } catch (error) {
    console.error("Error fetching Shopify seller:", error);
    res.status(500).json({ message: "Error fetching Shopify seller", error });
  }
};


const updateShopifySeller = async (req, res) => {
  try {
    const { shopLink, accessKey, businessDetails, status, documentTypes } = req.body;

    // Find the seller by ID
    const seller = await ShopifySeller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    // Check if files are uploaded
    if (req.files && req.files.length > 0) {
      // Prepare updated documents array
      const newDocuments = req.files.map((file, index) => ({
        documentType: Array.isArray(documentTypes)
          ? (documentTypes[index] || "Default Document")
          : documentTypes || "Default Document",
        documentURL: new Binary(file.buffer),
      }));

      // Process new documents
      newDocuments.forEach((newDoc) => {
        const existingDocIndex = seller.documents.findIndex(
          (doc) => doc.documentType === newDoc.documentType
        );

        if (existingDocIndex !== -1) {
          // If a document with the same type exists, replace it
          seller.documents.splice(existingDocIndex, 1); // Remove the old document
        }

        // Add the new document (either as a replacement or a new entry)
        seller.documents.push(newDoc);
      });
    }

    // Update other fields
    seller.shopLink = shopLink || seller.shopLink;
    seller.accessKey = accessKey || seller.accessKey;

    // Safely parse businessDetails
    if (businessDetails) {
      try {
        seller.businessDetails = JSON.parse(businessDetails);
      } catch (error) {
        return res.status(400).json({ error: "Invalid businessDetails format" });
      }
    }

    seller.status = status || seller.status;

    // Save the updated seller
    await seller.save();

    res.status(200).json({
      message: "Shopify Seller updated successfully",
      seller,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Shopify seller", error });
  }
};

// Delete Shopify seller
const deleteShopifySeller = async (req, res) => {
  try {
    const seller = await ShopifySeller.findByIdAndDelete(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    res.status(200).json({ message: "Shopify seller deleted successfully", seller });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Shopify seller", error });
  }
};

module.exports = {
  createShopifySeller,
  getAllShopifySellers,
  getShopifySellerById,
  updateShopifySeller,
  deleteShopifySeller,
};
