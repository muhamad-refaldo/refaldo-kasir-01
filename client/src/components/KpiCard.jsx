import React from 'react';

const KpiCard = ({ title, value, icon }) => {
  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body flex-row items-center">
        <div className="p-4 bg-primary rounded-lg text-primary-content">
          {icon}
        </div>
        <div className="ml-4">
          <h2 className="card-title text-gray-400">{title}</h2>
          <p className="text-3xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default KpiCard;