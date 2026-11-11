"use client"

import { isAxiosError } from "axios"
import { useState } from "react"
import { useInventory } from "../hooks/useInventory"
import { usePurchase } from "../hooks/usePurchase"
import type { Receipt } from "../types/inventory"

export default function Home() {
  const date = new Date().getDate()
  const month = new Date().getMonth() + 1
  const year = new Date().getFullYear()
  const {isLoading, data, isError, error} = useInventory()
  const [receipt, setReceipt] = useState<Receipt | null>(null)
  const [quantity, setQuantity] = useState(1)

  const {
    mutate: purchaseTicket,
    isPending,
    isError: isPurchaseError,
    error: purchaseError,
    reset
} = usePurchase();

   if (isLoading) {
        return <div className="">Loading ticket details...</div>;
    }

    if (isError) {
        return <div>Something went wrong: {error.message}</div>;
    }

  const ticket = data?.[0]

  if (!ticket) {
    return <div>No tickets available.</div>;
  }

  const soldOut = ticket.quantity === 0

  const increment = ()=>{
    if(quantity < ticket.quantity){
    setQuantity((prev)=>prev + 1)
    }
  }

  const decrement = () =>{
    if(quantity > 1){
    setQuantity((prev)=>prev - 1)
    }
  }

  const handlePurchase = () => {
    purchaseTicket({
        productId: ticket._id,
        quantity
    }, {
        onSuccess: (data) => setReceipt(data)
    });
};

  const handleCancel = () => {
    setQuantity(1)
    reset()
  }

  const handleBuyAgain = () => {
    setReceipt(null)
    setQuantity(1)
    reset()
  }

  const purchaseMessage = isAxiosError(purchaseError)
    ? purchaseError.response?.data?.data?.message ?? purchaseError.message
    : purchaseError?.message

    const isSoldOutError = isAxiosError(purchaseError) && purchaseError.response?.status === 409


  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center p-4">
      <div className="bg-white shadow-lg p-6 flex gap-6 w-full max-w-4xl uppercase text-sm">

        <div className="flex-1 border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Ticket Details</h2>
            <p className="text-gray-300">Ready to lock in your night?</p>
          </div>

          <div className="p-6 flex flex-col gap-8 flex-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-gray-300">Ticket Name</p>
                <span className="text-gray-800">{ticket.name}</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-gray-300">Seating</p>
                <span className="text-gray-800">Row 18, Seat 21</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-gray-300">Tickets Left</p>
                <span className="text-gray-800">{soldOut ? "Sold Out" : ticket.quantity}</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-gray-300">Ticket Price</p>
                <span className="text-gray-800">{ticket.price} GBP</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-gray-300">Date</p>
                <span className="text-gray-800">{`${date}-${month}-${year}`}</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-gray-300">Start Time</p>
                <span className="text-gray-800">07:30 PM</span>
              </div>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="border border-gray-200 flex justify-between items-center px-6 py-3">
              <button className="text-gray-800 text-xl cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed" onClick={decrement} disabled={!!receipt || quantity <= 1}>-</button>
              <span className="text-gray-800">{quantity} {quantity === 1 ? "Ticket" : "Tickets"}</span>
              <button className="text-gray-800 text-xl cursor-pointer disabled:text-gray-300 disabled:cursor-not-allowed" onClick={increment} disabled={!!receipt || quantity >= ticket.quantity}>+</button>
            </div>
          </div>
        </div>

        {!receipt ? (
        <div className="flex-1 border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
            <p className="text-gray-300">Review before you buy</p>
          </div>

          <div className="p-6 flex flex-col gap-8 flex-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-gray-300">Ticket</p>
                <span className="text-gray-800">{ticket.name}</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-gray-300">Quantity</p>
                <span className="text-gray-800">{quantity}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-gray-300">Unit Price</p>
                <span className="text-gray-800">{ticket.price} GBP</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-gray-300">Total</p>
                <span className="text-gray-800 font-bold">{ticket.price * quantity} GBP</span>
              </div>
            </div>

            {isPurchaseError && !isSoldOutError && (
              <p className="text-red-500">{purchaseMessage}</p>
            )}

            {isSoldOutError && (
              <p className="text-gray-500">Sorry, not enough tickets left for this order.</p>
            )}
          </div>

          <div className="p-6 border-t border-gray-200 flex gap-6">
            <button onClick={handleCancel} className="flex-1 border border-gray-200 text-gray-300 py-3 cursor-pointer uppercase">Cancel</button>
            <button onClick={handlePurchase} disabled={isPending || soldOut || quantity > ticket.quantity} className="flex-1 border border-gray-800 text-gray-800 py-3 cursor-pointer uppercase disabled:border-gray-200 disabled:text-gray-300 disabled:cursor-not-allowed">
              {isPending ? "Processing..." : soldOut ? "Sold Out" : "Purchase"}
            </button>
          </div>
        </div>
        ) : (
        <div className="flex-1 border border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Receipt</h2>
            <p className="text-gray-300">{receipt.message}</p>
          </div>

          <div className="p-6 flex flex-col gap-8 flex-1">
            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-gray-300">Ticket</p>
                <span className="text-gray-800">{receipt.productName}</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-gray-300">Quantity</p>
                <span className="text-gray-800">{receipt.quantity}</span>
              </div>
            </div>

            <div className="flex justify-between">
              <div className="flex flex-col gap-3">
                <p className="text-gray-300">Date</p>
                <span className="text-gray-800">{`${date}-${month}-${year}`}</span>
              </div>
              <div className="flex flex-col gap-3 text-right">
                <p className="text-gray-300">Total Paid</p>
                <span className="text-gray-800 font-bold">{receipt.total} GBP</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <p className="text-gray-300">Tickets Left</p>
              <span className="text-gray-800">{receipt.remainingQuantity}</span>
            </div>
          </div>

          <div className="p-6 border-t border-gray-200">
            <button onClick={handleBuyAgain} className="w-full border border-gray-800 text-gray-800 py-3 cursor-pointer uppercase">Buy Again</button>
          </div>
        </div>
        )}

      </div>
    </div>
  );
}
