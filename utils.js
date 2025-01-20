const oldCustomers = [
    'John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown'
  ];
  
  const getCustomerName = () => oldCustomers[Math.floor(Math.random() * oldCustomers.length)];
  
  module.exports = { getCustomerName };
  