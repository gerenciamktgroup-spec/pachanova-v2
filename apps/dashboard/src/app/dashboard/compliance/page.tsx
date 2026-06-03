'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ComplianceDashboard() {
  const complianceData = [
    { entity: 'Global Holdings LLC', jurisdiction: 'US (FATCA)', status: 'Pending UBO', riskScore: 'High' },
    { entity: 'PachaNova Foundation', jurisdiction: 'EU (MiCA)', status: 'Fully Compliant', riskScore: 'Low' },
    { entity: 'LatAm Retail Pool', jurisdiction: 'PE', status: 'Fully Compliant', riskScore: 'Medium' }
  ];

  return (
    <div className="space-y-8 pb-24">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Institutional Compliance & Tax</h1>
          <p className="text-gray-400">Motor automatizado de reportes regulatorios (FATCA, MiCA) y KYC/KYB institucional.</p>
        </div>
        <button className="bg-pn-gold text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-500 transition-colors">
          Generate Q2 Tax Reports
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-1">Total Tax Withheld (YTD)</div>
          <div className="text-3xl font-semibold text-white">$245,600.00</div>
          <div className="text-sm text-green-400 mt-2">Stored securely in Escrow</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-1">Institutional Entities</div>
          <div className="text-3xl font-semibold text-white">42</div>
          <div className="text-sm text-yellow-400 mt-2">3 pending KYB checks</div>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="text-gray-400 text-sm mb-1">Suspicious Activity Reports</div>
          <div className="text-3xl font-semibold text-white">0</div>
          <div className="text-sm text-green-400 mt-2">Clean regulatory state</div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
        <h2 className="text-lg font-semibold text-white mb-6">Institutional Entities Tracker</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-gray-400 border-b border-zinc-800">
              <tr>
                <th className="pb-4 font-medium">Entity Name</th>
                <th className="pb-4 font-medium">Jurisdiction</th>
                <th className="pb-4 font-medium">Risk Score</th>
                <th className="pb-4 font-medium">Compliance Status</th>
                <th className="pb-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {complianceData.map((data, i) => (
                <motion.tr 
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <td className="py-4 text-white font-medium">{data.entity}</td>
                  <td className="py-4 text-gray-300">{data.jurisdiction}</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      data.riskScore === 'Low' ? 'bg-green-900/30 text-green-400' :
                      data.riskScore === 'Medium' ? 'bg-yellow-900/30 text-yellow-400' :
                      'bg-red-900/30 text-red-400'
                    }`}>
                      {data.riskScore}
                    </span>
                  </td>
                  <td className="py-4 text-gray-300">{data.status}</td>
                  <td className="py-4 text-right">
                    <button className="text-blue-400 hover:text-blue-300 mr-4">View UBOs</button>
                    <button className="text-gray-400 hover:text-white">Audit Log</button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
