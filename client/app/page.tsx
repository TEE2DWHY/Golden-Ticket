export default function Home() {
  return (
    <div className="bg-gray-300 h-screen flex items-center justify-center">
      <div className="w-3/5 h-[60vh] z-50 bg-white rounded-3xl flex py-8 justify-center">
      <div className="flex justify-between gap-50 w-4/5 border border-gray-500 p-2">
          <div>
            <h2 className="tracking-tighter text-3xl uppercase font-bold">Ticket Details</h2>
            <p className="tracking-tight text-gray-600">First come, first serve</p>

            <div className="flex justify-between py-4">
              <div className="flex flex-col gap-2">
              <p>Ticket Name</p>
              <span>Golden Ticket</span>
              </div>
           <div className="flex flex-col gap-2">
              <p>Price</p>
              <span>50 GBP</span>
              </div>
            </div>
            <div className="w-full bg-amber-600 flex justify-between p-1">
              <button>+</button>
              <span>5 Ticket</span>
              <button>-</button>
            </div>
          </div>
          

         <div>
            <h2 className="tracking-tighter text-3xl uppercase font-bold">CHECKOUT</h2>
            <p className="tracking-tight text-gray-600">Checkout now....</p>

            <div className="flex justify-between py-4">
              <div className="flex flex-col gap-2">
              <p>Ticket Name</p>
              <span>Golden Ticket</span>
              </div>
           <div className="flex flex-col gap-2">
              <p>Price</p>
              <span>50 GBP</span>
              </div>
            </div>
          </div>
      </div>
      </div>
    </div>
  );
}
