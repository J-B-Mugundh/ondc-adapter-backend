const mongoose = require("mongoose");

const WooCommerceSellerSchema = new mongoose.Schema({
  shopLink: { type: String, required: true },
  consumerKey: { type: String, required: true },
  consumerSecret: { type: String, required: true },
  businessDetails: {
    businessName: { type: String, required: true },
    businessRegistrationNumber: { type: String, required: true },
    GSTIN: { type: String, required: true }
  },
  status: {
    type: String,
    enum: ["Under Verification", "Verified", "Rejected"],
    default: "Under Verification",
  },
  documents: [
    {
      documentType: { type: String, required: true },
      documentURL: { type: Buffer, required: true },
    }
  ],
},
  { timestamps: true }
);

module.exports = mongoose.model("WooCommerceSeller", WooCommerceSellerSchema);
