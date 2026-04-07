export const metadata = {
  title: 'Dashboard | Asaya Control Panel',
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      
      {/* --- QUICK STATS GRID --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat Card 1 */}
        <div className="bg-white border border-[#e5e5e5] p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Total Revenue</span>
            <div className="p-2 bg-[#faf9f8] rounded-md">
              <svg className="w-4 h-4 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <h3 className="text-2xl font-light text-[#1a1a1a]">Rs. 428,500</h3>
          <p className="text-xs text-[#2b8a3e] mt-2 font-medium flex items-center gap-1">
            <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
            +12.5% this month
          </p>
        </div>

        {/* Stat Card 2 */}
        <div className="bg-white border border-[#e5e5e5] p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Total Orders</span>
            <div className="p-2 bg-[#faf9f8] rounded-md">
              <svg className="w-4 h-4 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>
            </div>
          </div>
          <h3 className="text-2xl font-light text-[#1a1a1a]">184</h3>
          <p className="text-xs text-[#2b8a3e] mt-2 font-medium flex items-center gap-1">
             <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25" /></svg>
            +5.2% this month
          </p>
        </div>

        {/* Stat Card 3 */}
        <div className="bg-white border border-[#e5e5e5] p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Active Products</span>
            <div className="p-2 bg-[#faf9f8] rounded-md">
              <svg className="w-4 h-4 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" /></svg>
            </div>
          </div>
          <h3 className="text-2xl font-light text-[#1a1a1a]">42</h3>
          <p className="text-xs text-[#888] mt-2 font-medium">
            3 items out of stock
          </p>
        </div>

        {/* Stat Card 4 */}
        <div className="bg-white border border-[#e5e5e5] p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <span className="text-[10px] uppercase tracking-widest text-[#888] font-bold">Customers</span>
            <div className="p-2 bg-[#faf9f8] rounded-md">
              <svg className="w-4 h-4 stroke-[#1a1a1a]" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /></svg>
            </div>
          </div>
          <h3 className="text-2xl font-light text-[#1a1a1a]">112</h3>
          <p className="text-xs text-[#888] mt-2 font-medium">
            14 guests this week
          </p>
        </div>

      </div>

      {/* --- RECENT ORDERS TABLE --- */}
      <div className="bg-white border border-[#e5e5e5] rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-[#e5e5e5] flex justify-between items-center">
          <h2 className="text-base font-medium text-[#1a1a1a]">Recent Orders</h2>
          <button className="text-[10px] uppercase tracking-widest font-bold text-[#1a1a1a] hover:text-[#888] transition-colors">
            View All
          </button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#faf9f8] border-b border-[#e5e5e5] text-[10px] uppercase tracking-widest text-[#888]">
                <th className="px-6 py-4 font-bold">Order ID</th>
                <th className="px-6 py-4 font-bold">Customer</th>
                <th className="px-6 py-4 font-bold">Date</th>
                <th className="px-6 py-4 font-bold">Total</th>
                <th className="px-6 py-4 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm font-light text-[#1a1a1a]">
              
              {/* Dummy Row 1 */}
              <tr className="border-b border-[#e5e5e5] hover:bg-[#faf9f8] transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium">ASAYA-F84A</td>
                <td className="px-6 py-4">Ayesha Khan</td>
                <td className="px-6 py-4 text-[#666]">Apr 7, 2026</td>
                <td className="px-6 py-4">Rs. 12,500</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-[#e6f4ea] text-[#2b8a3e] text-[10px] uppercase tracking-widest font-bold">
                    Paid
                  </span>
                </td>
              </tr>

              {/* Dummy Row 2 */}
              <tr className="border-b border-[#e5e5e5] hover:bg-[#faf9f8] transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium">ASAYA-B39C</td>
                <td className="px-6 py-4">Sarah Ahmed</td>
                <td className="px-6 py-4 text-[#666]">Apr 7, 2026</td>
                <td className="px-6 py-4">Rs. 8,250</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-[#fff3bf] text-[#e67700] text-[10px] uppercase tracking-widest font-bold">
                    Pending COD
                  </span>
                </td>
              </tr>

               {/* Dummy Row 3 */}
               <tr className="hover:bg-[#faf9f8] transition-colors cursor-pointer">
                <td className="px-6 py-4 font-medium">ASAYA-7D21</td>
                <td className="px-6 py-4">Fatima Ali</td>
                <td className="px-6 py-4 text-[#666]">Apr 6, 2026</td>
                <td className="px-6 py-4">Rs. 24,000</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-[#e6f4ea] text-[#2b8a3e] text-[10px] uppercase tracking-widest font-bold">
                    Shipped
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}