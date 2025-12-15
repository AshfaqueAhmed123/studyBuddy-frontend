// import React from 'react';

// const Tabs = ({ tabs, activeTab, setActiveTab }) => {
//   return (
//     <div className="w-full">
//       {/* Tab buttons */}
//       <div className="border-b border-slate-200 mb-4">
//         <nav className="flex">
//           {tabs.map((tab) => (
//             <button
//               key={tab.name}
//               onClick={() => setActiveTab(tab.name)}
//               className={`relative pb-2 px-6 text-sm font-semibold transition-all duration-200 ${
//                 activeTab === tab.name
//                   ? 'text-emerald-600'
//                   : 'text-slate-600 hover:text-slate-900'
//               }`}
//             >
//               <span>{tab.label}</span>
//               {activeTab === tab.name && (
//                 <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded" />
//               )}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Tab content */}
//       <div>
//         {tabs.map((tab) => {
//           if (tab.name === activeTab) {
//             return (
//               <div key={tab.name} className="p-4">
//                 {tab.content}
//               </div>
//             );
//           }
//           return null;
//         })}
//       </div>
//     </div>
//   );
// };

// export default Tabs;
import React from 'react';

const Tabs = ({ tabs, activeTab, setActiveTab }) => {
  return (
    <div className="w-full">
      {/* Tab buttons */}
      <div className="border-b border-slate-200 mb-4">
        <nav className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => setActiveTab(tab.name)}
              className={`relative pb-2 px-6 text-sm font-semibold transition-all duration-200 ${
                activeTab === tab.name
                  ? 'text-emerald-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {activeTab === tab.name && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600 rounded" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div>
        {tabs.map((tab) => {
          if (tab.name === activeTab) {
            return (
              <div key={tab.name} className="p-4">
                {/* ✅ Call the content if it’s a function */}
                {typeof tab.content === 'function' ? tab.content() : tab.content}
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
};

export default Tabs;
