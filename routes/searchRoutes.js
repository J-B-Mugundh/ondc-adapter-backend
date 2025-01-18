const express = require("express");
const { searchProduct } = require("../controllers/searchController");


const router = express.Router();

router.post("/", searchProduct);

/**order for shopify */
router.post('/place-order', async (req, res) => {
    const { variantId, quantity, email } = req.body;
  
    try {
      // Create a draft order
      const draftOrder = await createDraftOrder(variantId, quantity, email);
      console.log('Draft order created:', draftOrder);
  
      // Complete the draft order (finalize the order)
      const draftOrderId = draftOrder.id;
      const completedOrder = await completeDraftOrder(draftOrderId);
      console.log('Order completed:', completedOrder);
  
      return res.json({ message: 'Order successfully completed!', order: completedOrder });
    } catch (error) {
      console.error('Error in placing order:', error);
      return res.status(500).json({ message: 'Failed to place order', error: error.message });
    }
  });
module.exports = router;
