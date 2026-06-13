'use client';

import { useState } from 'react';
import { FileText, BookOpen, Book, ClipboardList, Microscope } from 'lucide-react';

interface ResourceTypeTabsProps {
  resourceTypes: any[];
  selectedTypeId: number;
  onSelectType: (typeId: number) => void;
}

const iconMap: { [key: string]: any } = {
  'FileText': FileText,
  'BookOpen': BookOpen,
  'Book': Book,
  'ClipboardList': ClipboardList,
  'Microscope': Microscope,
};

export function ResourceTypeTabs({ resourceTypes, selectedTypeId, onSelectType }: ResourceTypeTabsProps) {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-0">
        <div className="flex items-center overflow-x-auto scrollbar-hide gap-1">
          {resourceTypes.map((type) => {
            const IconComponent = iconMap[type.icon] || FileText;
            const isSelected = selectedTypeId === type.id;
            
            return (
              <button
                key={type.id}
                onClick={() => onSelectType(type.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium text-sm whitespace-nowrap transition-all border-b-2 ${
                  isSelected
                    ? `text-white bg-[${type.color}] border-b-2 border-[${type.color}]`
                    : 'text-gray-600 hover:text-gray-900 border-b-2 border-transparent hover:border-gray-300'
                }`}
                style={isSelected ? { backgroundColor: type.color } : {}}
              >
                <IconComponent size={18} />
                <span>{type.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
