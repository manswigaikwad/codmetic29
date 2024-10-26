import { FaMinus, FaPlus, FaTrashAlt } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { userRequest } from "../requestMethods";
import { removeProduct, clearCart } from "../redux/cartRedux.js"; // Import the new actions
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const handleRemoveProduct = (product) => {
    dispatch(removeProduct(product));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = async () => {
    try {
      // Create a checkout session
      const res = await userRequest.post("/stripe/create-checkout-session", { // Ensure this endpoint is set up in your backend
        cart,
        userId: user.currentUser._id,
        email: user.currentUser.email,
        name: user.currentUser.name,
      });


      // Check if orderId is returned
      if (res.data.orderId) {
        const options = {
          key: res.data.key_id, // Razorpay key from backend
          amount: res.data.amount, // Total amount in paisa
          currency: res.data.currency, // INR
          name: user.currentUser.name,
          description: "Order Payment",
          order_id: res.data.orderId, // Razorpay Order ID from backend

          handler: async function (response) {
            const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
            navigate("/thanks")
            console.log("hello vushal")

            // Send payment details to backend for verification
            try {
              const verifyRes = await userRequest.post("/stripe/payment-success", { // Ensure this endpoint is correct
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
              });
              // navigate("/thanks")

              if (verifyRes.status === 200) {
                alert("Payment Successful! Your order has been placed.");
                window.location.href = "/orders";
              } else {

                navigate("/thanks")
                // alert("Payment verification failed. Please contact support.");
              }
            } catch (verificationError) {
              console.error("Verification Error:", verificationError.message);
              // alert("There was an error verifying your payment. Please try again.");
            }
          },
          prefill: {
            name: user.currentUser.name,
            email: user.currentUser.email,
          },
          theme: {
            color: "#F37254",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        alert("Failed to create order. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error.message);
      alert("An error occurred during checkout. Please check your cart and try again.");
    }
  };


  return (
    <div className="min-h-screen p-8">
      <h3 className="text-[18px] font-bold mb-6">Shopping Cart</h3>
      <div className="flex gap-8">
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Your Items</h2>
          <div className="flex flex-col space-y-4">
            {cart.products.map((product, index) => (
              <div className="flex items-center justify-between border-b border-gray-200 pb-4" key={index}>
                <img src={product.img} alt="Product" className="w-32 h-32 object-cover rounded-md" />
                <div className="flex-1 ml-4">
                  <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                  <p className="text-gray-600 mb-2">{product.desc.slice(0, 100)}...</p>
                  <div className="flex items-center">
                    <FaMinus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full text-3xl" />
                    <span className="text-lg font-semibold mx-4">{product.quantity}</span>
                    <FaPlus className="bg-[#ef93db] text-white cursor-pointer p-2 rounded-full text-3xl" />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${product.price * product.quantity}</p>
                  <FaTrashAlt className="text-red-600 cursor-pointer" onClick={() => handleRemoveProduct(product)} />
                </div>
              </div>
            ))}
          </div>
          <button className="bg-red-400 w-[200px] text-white p-3 mt-4 rounded-lg font-semibold" onClick={handleClearCart}>
            Clear Cart
          </button>
        </div>
        <div className="w-80 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-between">
              <span className="text-lg font-medium">Subtotal:</span>
              <span className="text-lg font-semibold">${cart.total}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-medium">Shipping:</span>
              <span className="text-lg font-semibold">$10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-lg font-medium">Total:</span>
              <span className="text-lg font-bold">${cart.total + 10}</span>
            </div>
            <button className="bg-[#ef93db] text-white p-3 w-full rounded-lg font-semibold" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
