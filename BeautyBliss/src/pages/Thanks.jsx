import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { MdShoppingCart } from 'react-icons/md';
import { GiPartyPopper } from 'react-icons/gi';

const Thanks = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 text-center">
                {/* Checkmark Icon */}
                <FaCheckCircle className="text-green-500 text-5xl mb-4" />

                <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
                <p className="text-lg mb-2">Your order has been successfully placed.</p>

                {/* Shopping Cart Icon */}
                <MdShoppingCart className="text-blue-500 text-4xl mb-2 mx-auto" />
                <p className="text-gray-600 mb-6">We appreciate your business!</p>

                {/* Party Popper Icon */}
                <GiPartyPopper className="text-yellow-400 text-4xl mb-4" />
                <p className="text-lg mb-4">Celebrate your purchase!</p>

                <a
                    href="/" // Update the link to the desired page
                    className="inline-block mt-4 bg-[#ef93db] text-white py-2 px-4 rounded-lg hover:bg-[#d68cb8] transition duration-200"
                >
                    Go to Homepage
                </a>
            </div>
        </div>
    );
}

export default Thanks;
