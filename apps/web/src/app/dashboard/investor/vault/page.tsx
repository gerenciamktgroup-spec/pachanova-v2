'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function DocumentVault() {
  const documents = [
    { id: '1', name: 'Certificado de Propiedad - San Bartolo', type: 'PDF', date: '2026-06-02', status: 'SIGNED', cid: 'QmYwAPJzv5CZsnA625s3Xf2sm5DyaRvPuFSzi1' },
    { id: '2', name: 'Acuerdo de Fideicomiso', type: 'PDF', date: '2026-06-01', status: 'PENDING_SIGNATURE', cid: null },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        <div>
          <h1 className="text-4xl font-bold mb-4">Legal Vault</h1>
          <p className="text-gray-400">Accede a tus certificados de propiedad, contratos y acuerdos fiduciarios. Todo respaldado criptográficamente y firmado digitalmente.</p>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-gray-400 border-b border-zinc-800">
                <tr>
                  <th className="pb-4 font-medium">Document Name</th>
                  <th className="pb-4 font-medium">Date</th>
                  <th className="pb-4 font-medium">Status</th>
                  <th className="pb-4 font-medium">IPFS CID</th>
                  <th className="pb-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {documents.map((doc, i) => (
                  <motion.tr 
                    key={doc.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <td className="py-4 text-white flex items-center gap-3">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      {doc.name}
                    </td>
                    <td className="py-4 text-gray-400">{doc.date}</td>
                    <td className="py-4">
                      {doc.status === 'SIGNED' ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">Signed</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-900/30 text-yellow-400 border border-yellow-800/50">Action Required</span>
                      )}
                    </td>
                    <td className="py-4 font-mono text-xs text-gray-500">
                      {doc.cid ? (
                        <a href={`ipfs://${doc.cid}`} className="hover:text-blue-400 truncate w-32 inline-block" title={doc.cid}>{doc.cid}</a>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="py-4 text-right">
                      {doc.status === 'PENDING_SIGNATURE' ? (
                        <button className="text-sm text-pn-gold hover:text-white transition-colors border border-pn-gold px-3 py-1.5 rounded-lg hover:bg-pn-gold/10">
                          Sign via DocuSign
                        </button>
                      ) : (
                        <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
                          Download PDF
                        </button>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
