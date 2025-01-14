const SaelorSeller = require('../models/SaelorSeller');

// Create a new Saelor seller
createSaelorSeller = async (req, res) => {
  try {
    const newSeller = new SaelorSeller(req.body);
    await newSeller.save();
    res.status(201).json({ message: 'Saelor seller created successfully', seller: newSeller });
  } catch (error) {
    res.status(500).json({ message: 'Error creating Saelor seller', error });
  }
};

// router.get('/', getAllSaelorSellers);
// router.get('/:id', getSaelorSellerById);
// router.put('/:id', updateSaelorSeller);
// router.delete('/:id', deleteSaelorSeller);

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
    res.status(200).json(seller);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Saelor seller', error });
  }
}

// Update Saelor seller
updateSaelorSeller = async (req, res) =>{
  try {
      const seller = await SaelorSeller.findByIdAndUpdate(req.params.id, req.body, {new:true});
      res.status(200).json(seller);
  }
  catch(error){
      res.status(500).json({message:'Error updating Saelor seller',error});
  }
}

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