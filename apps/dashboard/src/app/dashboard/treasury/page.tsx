'use client';

import React, { useState } from 'react';

export default function TreasuryManagement() {
  const [balance, setBalance] = useState({
    usdc: 150000.00,
    locked: 25000.00,
    available: 125000.00
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Treasury & Dividends</h1>
          <p className="text-gray-500 mt-2">Manage fiat withdrawals and distribute rental/appreciation yields.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total USDC Balance</h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">${balance.usdc.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Locked in Escrow</h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">${balance.locked.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Available for Yields</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">${balance.available.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Distribute Dividends</h2>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Project</label>
              <select className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                <option>San Bartolo Genesis (PACHA)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Total Amount to Distribute (USDC)</label>
              <input type="number" className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white" placeholder="e.g. 5000" />
            </div>
            <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-4">
              Review Distribution
            </button>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Pending Fiat Withdrawals</h2>
          <div className="text-center py-8 text-gray-500">
            No pending withdrawal requests.
          </div>
        </div>
      </div>
    </div>
  );
}
