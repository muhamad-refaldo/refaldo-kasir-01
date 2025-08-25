import React from 'react';
import Sidebar from './Sidebar'; // Pastikan path import ini benar

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-900 text-white font-sans">
      {/* Sidebar: 
        - Di layar besar (lg), sidebar akan statis.
        - Di layar kecil, sidebar akan dikontrol oleh state di dalam komponen Sidebar itu sendiri (slide-in/out).
      */}
      <Sidebar />

      {/* Konten Utama:
        - 'flex-1' membuat area ini mengisi semua sisa ruang horizontal.
        - 'overflow-y-auto' menambahkan scrollbar vertikal hanya jika kontennya lebih panjang dari layar.
        - 'w-full' ditambahkan untuk mengatasi potensi masalah lebar di beberapa browser.
      */}
      <main className="flex-1 w-full overflow-y-auto">
        {/* Konten dari setiap halaman akan dirender di sini */}
        {children}
      </main>
    </div>
  );
};

export default Layout;
