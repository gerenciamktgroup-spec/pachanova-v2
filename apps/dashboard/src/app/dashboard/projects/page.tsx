'use client';

import React, { useState } from 'react';

export default function ProjectsManagement() {
  const projects = [
    { id: '1', name: 'San Bartolo Genesis', totalSqm: 50000, pricePerSqm: 120, status: 'GENESIS' },
    { id: '2', name: 'Lurin Expansion', totalSqm: 20000, pricePerSqm: 150, status: 'DRAFT' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Land Projects</h1>
          <p className="text-gray-500 mt-2">Manage tokenized real estate projects and sale phases.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors">
          + New Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{project.name}</h2>
              <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'GENESIS' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                {project.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-6 flex-1">
              <div className="flex justify-between">
                <span className="text-gray-500">Total Area</span>
                <span className="font-medium text-gray-900 dark:text-white">{project.totalSqm.toLocaleString()} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Price per m²</span>
                <span className="font-medium text-gray-900 dark:text-white">${project.pricePerSqm} USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Total Value</span>
                <span className="font-medium text-gray-900 dark:text-white">${(project.totalSqm * project.pricePerSqm).toLocaleString()} USD</span>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <button className="flex-1 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 rounded-lg font-medium transition-colors border border-gray-200 dark:border-gray-600">
                Edit Details
              </button>
              <button className="flex-1 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 py-2 rounded-lg font-medium transition-colors">
                Manage Tokens
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
