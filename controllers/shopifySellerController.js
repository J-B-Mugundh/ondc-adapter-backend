const ShopifySeller = require('../models/ShopifySeller');

// Create a new Shopify seller
createShopifySeller = async (req, res) => {
  try {
    const newSeller = new ShopifySeller(req.body);
    await newSeller.save();
    res.status(201).json({ message: 'Shopify seller created successfully', seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Shopify seller', error });
  }
};

// Get all Shopify sellers
getAllShopifySellers = async (req, res) => {
  try {
    const sellers = await ShopifySeller.find();
    res.status(200).json(sellers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Shopify sellers', error });
  }
};

// Get Shopify seller by ID
getShopifySellerById=async (req,res)=>{
  try{
    const seller=await ShopifySeller.findById(req.params.id);
    res.status(200).json(seller);
  }
  catch(error){
    res.status(500).json({message:'Error fetching Shopify seller',error});
  }
}

// Update Shopify seller
updateShopifySeller=async (req,res)=>{
  try{
    const seller=await ShopifySeller.findByIdAndUpdate(req.params.id,req.body,{new:true});
    res.status(200).json(seller);
  }
  catch(error){
     res.status(500).json({message:'Error updating Shopify seller',error});
  }
}
// Delete Shopify seller
deleteShopifySeller=async (req,res)=>{
  try{
    const seller=await ShopifySeller.findByIdAndDelete(req.params.id);
    res.status(200).json({message:'Shopify seller deleted successfully',seller});
  }
  catch(error){
    res.status(500).json({message:'Error deleting Shopify seller',error});
  }
}

module.exports = {
    createShopifySeller,
    getAllShopifySellers,
    getShopifySellerById,
    updateShopifySeller,
    deleteShopifySeller 
};
