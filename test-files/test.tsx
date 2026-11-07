import React from 'react';

export const SampleComponent: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {/* 1. Test single tag: section/ + Tab */}
      
      {/* 2. Test tag with attributes: Card title="User Profile" isPrimary/ + Tab */}
      
      {/* 3. Test self-closing component: Avatar src="/profile.png"// + Tab */}
      
      {/* 4. Test void element: img/ + Tab */}
      
      {/* 5. Test auto-close on '>': type <aside className="sidebar"> */}
      
      {/* 6. Test wrap with tag: select any text below and press Alt+W */}
      Click Here To View Profile
    </div>
  );
};
