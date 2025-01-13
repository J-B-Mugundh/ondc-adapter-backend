const mongoose = require("mongoose");

const ShopifySellerSchema = new mongoose.Schema({
  shopLink: { type: String, required: true },
  accessKey: { type: String, required: true },
  businessDetails: {
    businessName: { type: String, required: true },
    businessRegistrationNumber: { type: String, required: true },
    GSTIN: { type: String, required: true }
  },
  documents: [
    {
      documentType: { type: String, required: true },
      documentURL: { type: String, required: true },
    }
  ],
  status: { 
    type: String, 
    enum: ["Under Verification", "Verified", "Rejected"], 
    required: true 
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ShopifySeller", ShopifySellerSchema);
