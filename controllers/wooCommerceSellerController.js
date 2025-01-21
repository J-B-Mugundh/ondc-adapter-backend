const WooCommerceSeller = require('../models/WooCommerceSeller.js');
const { Binary } = require("mongodb");

// Create a new WooCommerce seller
const createWooCommerceSeller = async (req, res) => {
  try {
      const { shopLink, consumerKey, consumerSecret,businessDetails, status, documentType } = req.body;

      if(!req.files || req.files.length === 0){
        return res.status(400).json({ error:"No files uploaded"});
      }

      const documents = req.files.map((file, index) => ({
          documentType: documentType && documentType[index] ? documentType[index] : "Document Type",
          documentURL: new Binary(file.buffer),
      }));
      const seller = new WooCommerceSeller({
          shopLink,
          consumerKey,
          consumerSecret,
          businessDetails: JSON.parse(businessDetails),
          documents,
          status,
      });

      await seller.save();
      res.status(201).json({ message: "WooCommerce seller created successfully", seller });
  } catch (error) {
    res.status(500).json({ message: 'Error creating WooCommerce seller', error });
  }
};

// Get all Woocommerce sellers
getAllWooCommerceSellers= async( req,res)=>{
  try{
    const Sellers = await WooCommerceSeller.find();
    res.status(200).json(Sellers);
  }
  catch(error){
    res.status(500).json({message:'Error fetching WooCommerce sellers',error});
  }
}
// Get Woocommerce seller by ID
getWooCommerceSellerById = async(req,res)=>{
  try{
     const seller =await WooCommerceSeller.findById(req.params.id);
     if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
     res.status(200).json(seller);
  }
  catch(error){
    res.status(500).json({message:'Error fetching WooCommerce seller',error});
  }
}
// Update Woocommerce seller
updateWooCommerceSeller = async (req,res)=>{
  try{
      const { shopLink, consumerKey, consumerSecret,businessDetails, status, documentType } = req.body;
      const seller = await WooCommerceSeller.findById(req.params.id);
      if (!seller) {
          return res.status(404).json({ error: "Seller not found" });
      }
      if(req.files && req.files.length > 0){
          const newDocuments = req.files.map((file, index) => ({
            documentType: Array.isArray(documentType)
              ? (documentType[index] || "Default Document")
              : documentType || "Default Document",
            documentURL: new Binary(file.buffer),
          }));

          newDocuments.forEach((newDoc) => {  
            const existingDocIndex = seller.documents.findIndex(
              (doc)=> doc.documentType === newDoc.documentType
            );

            if (existingDocIndex !== -1) {
              // If a document with the same type exists, replace it
              seller.documents.splice(existingDocIndex, 1); // Remove the old document
            }

            seller.documents.push(newDoc); // Add the new document
          });
      }

      seller.shopLink = shopLink || seller.shopLink;
      seller.consumerKey = consumerKey || seller.consumerKey;
      seller.consumerSecret = consumerSecret || seller.consumerSecret;
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
          message: "WooCommerce Seller updated successfully",
          seller,
        });
  }
  catch(error){
      res.status(500).json({message:'Error updating WooCommerce seller',error});
  }
}
// Delete Woocommerce seller
deleteWooCommerceSeller=async (req,res)=>{
  try{
    const seller=await WooCommerceSeller.findByIdAndDelete(req.params.id);
    res.status(200).json({message:'WooCommerceS seller deleted successfully',seller});
  }
  catch(error){
    res.status(500).json({message:'Error deleting Shopify seller',error});
  }
}
module.exports = {
    createWooCommerceSeller,
    getAllWooCommerceSellers,
    getWooCommerceSellerById,
    updateWooCommerceSeller,
    deleteWooCommerceSeller
};