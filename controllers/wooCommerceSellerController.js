const WooCommerceSeller = require('../models/WooCommerceSeller');

// Create a new WooCommerce seller
createWooCommerceSeller = async (req, res) => {
  try {
    const newSeller = new WooCommerceSeller(req.body);
    await newSeller.save();
    res.status(201).json({ message: 'WooCommerce seller created successfully', seller: newSeller });
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
     console.log(seller)
     res.status(200).json(seller);
  }
  catch(error){
    res.status(500).json({message:'Error fetching WooCommerce seller',error});
  }
}
// Update Woocommerce seller
updateWooCommerceSeller = async (req,res)=>{
  try{
     const seller=await WooCommerceSeller.findByIdAndUpdate(req.params.id,req.body,{new:true});
     res.status(200).json(seller);
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