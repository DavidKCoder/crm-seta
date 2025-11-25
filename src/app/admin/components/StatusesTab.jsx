import React from 'react';
import DealStatusManager from '@/components/DealStatusManager';

export default function StatusesTab() {
  return (
    <div className="mt-4">
      <DealStatusManager 
        show={true} 
        onClose={() => {}} 
        deals={[]} 
        inline={true} 
      />
    </div>
  );
}
