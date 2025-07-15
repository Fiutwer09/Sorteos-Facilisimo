import React from 'react';
import Wave from 'react-wavify';

const HeaderLogo: React.FC = () => (
  <header className="w-full sticky top-0 z-50 min-h-[100px] px-3 md:px-12 bg-gradient-to-r from-yellow-400 via-yellow-300 to-blue-900 shadow-2xl overflow-hidden flex items-center justify-between">
    {/* Contenido del header */}
    <div className="relative z-10 flex items-center gap-3 md:gap-4 flex-1 md:flex-none justify-center md:justify-start">
      <img
        src="/images/icono-img-removebg-preview.png"
        alt="Facilísimo Logo"
        className="h-12 w-12 md:h-16 md:w-16 select-none drop-shadow-lg"
        draggable={false}
      />
      <span className="text-white text-2xl md:text-4xl font-extrabold drop-shadow-md whitespace-nowrap tracking-tight" style={{textShadow: '0 2px 8px rgba(0,0,0,0.10)'}}>
        Facilísimo
      </span>
    </div>
    <div className="hidden md:flex items-center justify-end flex-1 relative z-10">
      <span className="text-white/90 text-base md:text-xl font-semibold tracking-wider pr-4 md:pr-8" style={{textShadow: '0 2px 8px rgba(0,0,0,0.10)'}}>
        Sorteos Transparentes y Rápidos
      </span>
    </div>
    {/* Onda animada con react-wavify, más baja */}
    <div className="absolute bottom-0 left-0 w-full h-[20px] z-0 pointer-events-none select-none">
      <Wave
        fill="#1e3a8a"
        paused={false}
        options={{
          height: 6,
          amplitude: 5,
          speed: 0.18,
          points: 3
        }}
        style={{ minHeight: 18 }}
      />
    </div>
    {/* Línea amarilla sutil debajo de la onda */}
    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-yellow-400/70 backdrop-blur-sm shadow-md z-20" style={{boxShadow: '0 2px 8px 0 rgba(255, 221, 51, 0.15)'}}></div>
  </header>
);

export default HeaderLogo; 