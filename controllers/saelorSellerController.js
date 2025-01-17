const SaelorSeller = require('../models/SaelorSeller');
const { Binary } = require("mongodb");

// shopLink: { type: String, required: true },
//     authToken: { type: String, required: true },
// Create a new Saelor seller
createSaelorSeller = async (req, res) => {
  try {
    const { shopLink, authToken, businessDetails, status, documentType } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" });
    }

    // Ensure documentType is an array
    const documentTypes = Array.isArray(documentType) ? documentType : [documentType];

    const documents = req.files.map((file, index) => ({
      documentType: documentTypes[index] || "Default Document",
      documentURL: new Binary(file.buffer),
    }));

    const seller = new SaelorSeller({
      shopLink,
      authToken,
      businessDetails: JSON.parse(businessDetails),
      documents,
      status,
    });

    await seller.save();

    res.status(201).json({ message: "Saelor seller created successfully", seller });
  } catch (error) {
    res.status(500).json({ message: "Error creating Saelor seller", error });
  }
};

// Get all Saelor sellers
getAllSaelorSellers = async (req, res) => {
  try{
    const seller=await SaelorSeller.find();
    res.status(200).json(seller);
  }
  catch(error){
    res.status(500).json({message:'Error fetching Saelor sellers',error});
  }
}
// Get Saelor seller by ID
getSaelorSellerById = async (req, res)=>{
  try {
    const seller = await SaelorSeller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Saelor seller', error });
  }
}

// Update Saelor seller
const updateSaelorSeller = async (req, res) => {
  try {
    const { shopLink, authToken, businessDetails, status, documentType } = req.body;

    const seller = await SaelorSeller.findById(req.params.id);
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    if (req.files && req.files.length > 0) {
      const documentTypes = Array.isArray(documentType) ? documentType : [documentType];

      const newDocuments = req.files.map((file, index) => ({
        documentType: documentTypes[index] || "Default Document",
        documentURL: new Binary(file.buffer),
      }));

      newDocuments.forEach((newDoc) => {
        const existingDocIndex = seller.documents.findIndex(
          (doc) => doc.documentType === newDoc.documentType
        );
        if (existingDocIndex !== -1) {
          // If a document with the same type exists, replace it
          seller.documents.splice(existingDocIndex, 1);
        }
        seller.documents.push(newDoc);
      });
    }

    seller.shopLink = shopLink || seller.shopLink;
    seller.authToken = authToken || seller.authToken;
    if (businessDetails) {
      try {
        seller.businessDetails = JSON.parse(businessDetails);
      } catch (error) {
        return res.status(400).json({ error: "Invalid businessDetails format" });
      }
    }
    seller.status = status;
    await seller.save();

    res.status(200).json({ message: "Saelor seller updated successfully", seller });
  } catch (error) {
    res.status(500).json({ message: "Error updating Saelor seller", error });
  }
};

// Delete Saelor seller
deleteSaelorSeller = async (req, res) =>{
  try {
    const seller= await SaelorSeller.findByIdAndDelete(req.params.id);
    res.status(200).json({message:'Saelor seller deleted successfully',seller});
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Saelor seller', error });
  }
}


module.exports = {
    createSaelorSeller,
    getAllSaelorSellers,
    getSaelorSellerById,
    updateSaelorSeller,
    deleteSaelorSeller
};