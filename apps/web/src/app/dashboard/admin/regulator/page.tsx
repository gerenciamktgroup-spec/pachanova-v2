'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function RegulatorDashboard() {
  const entities = [
    { id: 0, name: 'PachaNova Global LLC', type: 'Series LLC', jurisdiction: 'Wyoming, US', regNumber: '2026-00018342', status: 'Active' },
    { id: 1, name: 'San Bartolo Sub-DAO', type: 'Foundation', jurisdiction: 'Zug, CH', regNumber: 'CH-170.3.045', status: 'Active' },
    { id: 2, name: 'PachaNova LatAm', type: 'SAC', jurisdiction: 'Lima, PE', regNumber: '20608552194', status: 'Pending Verification' }
  ];

  return (
    <div className="min-h-screen bg-white text-black p-8 font-sans">
      {/* Light theme for Legal / Auditor interface to differentiate from Crypto UI */}
      <div className="max-w-6xl mx-auto space-y-8">
        
        <div className="flex justify-between items-end border-b-2 border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Legal Wrapper & Auditor Portal</h1>
            <p className="text-gray-600">Read-only interface for legal auditors, regulators, and government agencies to verify ERC-3643 asset backing.</p>
          </div>
          <button className="bg-black text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-800 transition-colors">
            Export Cryptographic Audit
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Total AUM (Audited)</div>
            <div className="text-3xl font-bold text-gray-900">$45,250,000.00</div>
            <div className="text-sm text-green-600 mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Oracles in Sync
            </div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Active Entities</div>
            <div className="text-3xl font-bold text-gray-900">12</div>
            <div className="text-sm text-blue-600 mt-2">Across 4 jurisdictions</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">KYC/AML Incidents</div>
            <div className="text-3xl font-bold text-gray-900">0</div>
            <div className="text-sm text-gray-500 mt-2">Last 30 days</div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">On-Chain Legal Entities</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                  <th className="pb-4 font-semibold">Entity Name</th>
                  <th className="pb-4 font-semibold">Jurisdiction</th>
                  <th className="pb-4 font-semibold">Reg. Number</th>
                  <th className="pb-4 font-semibold">Status</th>
                  <th className="pb-4 font-semibold text-right">Bylaws / Docs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {entities.map((entity) => (
                  <tr key={entity.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4">
                      <div className="font-bold text-gray-900">{entity.name}</div>
                      <div className="text-xs text-gray-500">{entity.type}</div>
                    </td>
                    <td className="py-4 text-gray-600">{entity.jurisdiction}</td>
                    <td className="py-4 font-mono text-sm text-gray-600">{entity.regNumber}</td>
                    <td className="py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        entity.status === 'Active' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                      }`}>
                        {entity.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-semibold flex items-center justify-end gap-1 ml-auto">
                        View IPFS Hash
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Decentralized Arbitration (Kleros)</h2>
            <p className="text-sm text-gray-600 mb-4">Resolución de disputas vinculada legalmente a los estatutos de la DAO.</p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Active Cases</div>
              <div className="text-xl font-bold text-gray-900">None</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">ERC-3643 Registry Sync</h2>
            <p className="text-sm text-gray-600 mb-4">Verifica que los tokens en circulación coincidan exactamente con las acciones registradas corporativamente.</p>
            <div className="bg-green-50 p-4 rounded-xl border border-green-200 flex justify-between items-center">
              <div>
                <div className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1">State Verification</div>
                <div className="text-sm font-medium text-green-800">Fully Synchronized (Block 18,492,011)</div>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
