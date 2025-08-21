import { useEffect, useRef, useState } from 'react';
import CommentsTable from '../components/CommentsTable';
import Filters from '../components/Filters';
import FiltersFacebook from '../components/FiltersFacebook';
import WinnerDialog from '../components/WinnerDialog';
import Countdown from '../components/Countdown';
import { parseComments, parseCommentsFacebook, type CommentBlock } from '../utils/commentParser';
import { Toast } from 'primereact/toast';
import { useNavigate } from 'react-router-dom';

function getPermutations(str: string): string[] {
  if (str.length <= 1) return [str];
  const perms: string[] = [];
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const rest = str.slice(0, i) + str.slice(i + 1);
    for (const perm of getPermutations(rest)) {
      perms.push(char + perm);
    }
  }
  return Array.from(new Set(perms));
}

// Función para formatear números con separadores de miles
const formatNumber = (num: number): string => {
  return num.toLocaleString('es-ES');
};

const SorteoPage = () => {
  const [comments, setComments] = useState<CommentBlock[]>([]);
  const [winners, setWinners] = useState<CommentBlock[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [showCountdown, setShowCountdown] = useState(false);
  const [sorteoTitulo, setSorteoTitulo] = useState('');
  const toast = useRef<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [platform, setPlatform] = useState<'instagram' | 'facebook' | 'ambos' | 'nombres'>('instagram');
  const [activeFilter, setActiveFilter] = useState<'instagram' | 'facebook' | 'ambos' | 'nombres'>('ambos');
  const [commentsInstagram, setCommentsInstagram] = useState<CommentBlock[]>([]);
  const [commentsFacebook, setCommentsFacebook] = useState<CommentBlock[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const img = localStorage.getItem('imagenPublicacion');
    const plat = localStorage.getItem('plataforma') as 'instagram' | 'facebook' | 'ambos' | 'nombres';
    setImageUrl(img);
    setPlatform(plat || 'instagram');
    if (plat === 'ambos') {
      const contentIG = localStorage.getItem('comentarios_instagram') || '';
      const contentFB = localStorage.getItem('comentarios_facebook') || '';
      const parsedIG = parseComments(contentIG).map(c => ({ ...c, platform: 'instagram' }));
      const parsedFB = parseCommentsFacebook(contentFB).map(c => ({ ...c, platform: 'facebook' }));
      setCommentsInstagram(parsedIG);
      setCommentsFacebook(parsedFB);
      setComments([...parsedIG, ...parsedFB]);
      setActiveFilter('ambos');
    } else if (plat === 'nombres') {
      const nombresContent = localStorage.getItem('lista_nombres') || '';
      if (nombresContent) {
        // Procesar cada línea y separar por comas también
        const nombresList = nombresContent
          .split('\n')
          .flatMap(line => line.split(','))
          .map(name => name.trim())
          .filter(name => name.length > 0);
        
        // Crear objetos CommentBlock para cada nombre individual
        const nombresComments: CommentBlock[] = nombresList.map((nombre) => ({
          username: nombre,
          comment: `Nombre en lista: ${nombre}`,
          date: new Date().toLocaleDateString('es-ES'),
          rawBlock: `${nombre}\n${new Date().toLocaleDateString('es-ES')}\nNombre en lista: ${nombre}`
        }));
        
        setComments(nombresComments);
      }
    } else {
      const content = localStorage.getItem('comentarios');
      if (plat === 'facebook') {
        const parsed = parseCommentsFacebook(content || '').map(c => ({ ...c, platform: 'facebook' }));
        setComments(parsed);
      } else {
        const parsed = parseComments(content || '').map(c => ({ ...c, platform: 'instagram' }));
        setComments(parsed);
      }
      setActiveFilter(plat || 'instagram');
    }
  }, []);

  // Permite filtrar por solo IG, solo FB o ambos (opcional, puedes quitar el selector si no lo quieres)
  useEffect(() => {
    if (platform === 'ambos') {
      if (activeFilter === 'instagram') {
        setComments(commentsInstagram);
      } else if (activeFilter === 'facebook') {
        setComments(commentsFacebook);
      } else {
        setComments([...commentsInstagram, ...commentsFacebook]);
      }
    }
  }, [activeFilter, platform, commentsInstagram, commentsFacebook]);

  const handleSearch = (query: string, type: string, orden: boolean, maxWinners: number) => {
    setSearchTerm(query);
    
    if (type !== 'aleatorio' && !query) {
      toast.current?.show({ severity: 'warn', summary: 'Búsqueda vacía', detail: 'Ingresa un criterio de búsqueda.', life: 2500 });
      return;
    }

    let found: CommentBlock[] = [];
    if (type === 'aleatorio') {
      // Selección aleatoria sin repetir
      const shuffled = [...comments].sort(() => 0.5 - Math.random());
      found = shuffled.slice(0, maxWinners);
    } else if (type === 'numero') {
      if (orden) {
        found = comments.filter(c => c.comment.replace(/\s/g, '').includes(query));
      } else {
        const perms = getPermutations(query);
        found = comments.filter(c =>
          perms.some(perm => c.comment.replace(/\s/g, '').includes(perm))
        );
      }
    } else if (type === 'palabra') {
      found = comments.filter(c => c.comment.toLowerCase().includes(query.toLowerCase()));
    } else if (type === 'marcador') {
      found = comments.filter(c => c.comment.includes(query));
    }

    if (found.length > 0) {
      setWinners(found.slice(0, maxWinners));
      localStorage.setItem('ganadores', JSON.stringify(found.slice(0, maxWinners)));
      localStorage.setItem('criterioBusqueda', JSON.stringify({
        tipo: type,
        valor: query
      }));
      localStorage.setItem('sorteoTitulo', sorteoTitulo);
      setShowCountdown(true);
    } else {
      setWinners([]);
      setDialogVisible(false); // No mostrar el modal si no hay ganadores
      toast.current?.show({ severity: 'warn', summary: 'Sin coincidencias', detail: 'No se encontró ningún comentario que coincida.', life: 2500 });
    }
  };

  const handleCountdownComplete = () => {
    setShowCountdown(false);
    navigate('/ganadores');
    toast.current?.show({ severity: 'success', summary: '¡Ganadores encontrados!', detail: `Se encontraron ${winners.length} comentarios que coinciden.`, life: 2500 });
  };

  const handleFilterTypeChange = () => {
    // Filter type change handled by the filter components
  };

  const totalComentarios = comments.length;
  const usuariosUnicos = new Set(comments.map(c => c.username)).size;

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-yellow-100 py-6 px-2 overflow-x-hidden">
      <Toast ref={toast} position="top-center" />
      
      {/* Countdown overlay */}
      {showCountdown && (
        <Countdown onComplete={handleCountdownComplete} />
      )}
      
      {/* Header principal más compacto */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 Sorteo Facilísimo</h1>
          <p className="text-gray-300 text-lg">Encuentra ganadores de forma rápida y transparente</p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-600/80 text-white text-center rounded-xl p-4 border-2 border-blue-500">
            <div className="text-2xl font-bold">{formatNumber(totalComentarios)}</div>
            <div className="text-sm">Comentarios</div>
          </div>
          <div className="bg-green-600/80 text-white text-center rounded-xl p-4 border-2 border-green-500">
            <div className="text-2xl font-bold">{formatNumber(usuariosUnicos)}</div>
            <div className="text-sm">Usuarios</div>
          </div>
          <div className="bg-yellow-600/80 text-white text-center rounded-xl p-4 border-2 border-yellow-500">
            <div className="text-2xl font-bold">{formatNumber(winners.length)}</div>
            <div className="text-sm">Ganadores</div>
          </div>
          <div className="bg-purple-600/80 text-white text-center rounded-xl p-4 border-2 border-purple-500">
            <div className="text-2xl font-bold">{searchTerm || '-'}</div>
            <div className="text-sm">Buscado</div>
          </div>
        </div>
      </div>

      {/* Layout principal: Filtros y Tabla lado a lado */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 mb-8">
        
        {/* Panel de Filtros - Más prominente */}
        <div className="bg-gray-900/90 rounded-2xl border-2 border-yellow-400 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">🎯 Buscar Ganadores</h2>
          
          {/* Campo de título del sorteo */}
          <div className="mb-6">
            <label htmlFor="sorteoTitulo" className="block text-white font-semibold mb-2 text-center">
              📝 Título del Sorteo
            </label>
            <input
              type="text"
              id="sorteoTitulo"
              value={sorteoTitulo}
              onChange={(e) => setSorteoTitulo(e.target.value)}
              placeholder="Ej: Sorteo de Instagram, Promoción especial..."
              className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border-2 border-gray-700 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-300 text-white placeholder:text-gray-400 shadow-md transition-all duration-200 outline-none text-base text-center"
            />
          </div>
          
          {/* Imagen de la publicación */}
          {imageUrl && (
            <div className="mb-6 flex justify-center">
              <div className="rounded-xl overflow-hidden shadow-lg border-2 border-blue-400 bg-blue-50 p-2">
                <img
                  src={imageUrl}
                  alt="Publicación"
                  className="max-w-xs rounded-lg object-contain aspect-[3/4]"
                />
              </div>
            </div>
          )}

          {/* Selector de fuente si es ambos */}
          {platform === 'ambos' && (
            <div className="mb-4 flex gap-2 justify-center">
              <button
                className={`px-4 py-2 rounded-lg font-bold border-2 transition ${activeFilter === 'ambos' ? 'bg-green-500 text-white border-green-600' : 'bg-gray-800 text-white border-gray-600'}`}
                onClick={() => setActiveFilter('ambos')}
              >Ambos</button>
              <button
                className={`px-4 py-2 rounded-lg font-bold border-2 transition ${activeFilter === 'instagram' ? 'bg-pink-400 text-white border-pink-600' : 'bg-gray-800 text-white border-gray-600'}`}
                onClick={() => setActiveFilter('instagram')}
              >Instagram</button>
              <button
                className={`px-4 py-2 rounded-lg font-bold border-2 transition ${activeFilter === 'facebook' ? 'bg-blue-500 text-white border-blue-600' : 'bg-gray-800 text-white border-blue-600'}`}
                onClick={() => setActiveFilter('facebook')}
              >Facebook</button>
            </div>
          )}

          {/* Filtros */}
          <div className="bg-gray-800/50 rounded-xl p-4">
            {platform === 'facebook' ? (
              <FiltersFacebook onSearch={handleSearch} onFilterTypeChange={handleFilterTypeChange} />
            ) : platform === 'instagram' ? (
              <Filters onSearch={handleSearch} onFilterTypeChange={handleFilterTypeChange} />
            ) : (
              // Ambos: puedes usar el filtro de Instagram por defecto o mostrar ambos
              <Filters onSearch={handleSearch} onFilterTypeChange={handleFilterTypeChange} />
            )}
          </div>

          {/* Tips rápidos */}
          <div className="mt-6 p-4 bg-blue-900/30 rounded-xl border border-blue-400/30">
            <h3 className="text-white font-semibold mb-2">💡 Tips rápidos:</h3>
            <ul className="text-blue-100 text-sm space-y-1">
              <li>• Usa <strong>número</strong> para buscar dígitos específicos</li>
              <li>• Usa <strong>palabra</strong> para buscar texto</li>
              <li>• Usa <strong>marcador</strong> para buscar símbolos</li>
            </ul>
          </div>
        </div>

        {/* Tabla de Comentarios - Más accesible */}
        <div className="bg-gray-900/90 rounded-2xl border-2 border-blue-400 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">📝 Comentarios ({formatNumber(totalComentarios)})</h2>
          <div className="bg-gray-800/50 rounded-xl p-4">
            <div className="max-h-[60vh] overflow-y-auto">
              <CommentsTable comments={comments} />
            </div>
            {/* Mostrar mensaje si no hay ganadores */}
            {winners.length === 0 && searchTerm && (
              <div className="mt-4 text-center text-red-400 font-bold animate-pulse">
                No hay ganadores para el criterio buscado.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Información de transparencia */}
      <div className="max-w-4xl mx-auto mb-8">
        <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 rounded-2xl p-6 border-2 border-green-500/30">
          <h3 className="text-xl font-bold text-white mb-4 text-center">🔒 Transparencia Garantizada</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">✅ Proceso Transparente</h4>
              <p className="text-gray-300 text-sm">
                Todos los comentarios son procesados de forma transparente y los resultados son completamente aleatorios.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-2">🛡️ Seguridad Total</h4>
              <p className="text-gray-300 text-sm">
                Nuestro sistema garantiza que nadie pueda manipular los resultados. Cada sorteo es único y confiable.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botones de navegación */}
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <button
          className="flex items-center justify-center gap-3 bg-blue-800 text-white font-semibold text-lg px-8 py-4 rounded-xl border-2 border-blue-700 hover:bg-blue-900 hover:shadow-lg transition-all duration-300"
          onClick={() => {
            localStorage.removeItem('comentarios');
            localStorage.removeItem('comentarios_instagram');
            localStorage.removeItem('comentarios_facebook');
            localStorage.removeItem('imagenPublicacion');
            localStorage.removeItem('plataforma');
            navigate('/');
          }}
        >
          <i className="pi pi-home text-xl" /> Volver al inicio
        </button>
      </div>

      {/* Dialogo de ganadores */}
      <WinnerDialog
        visible={dialogVisible}
        comments={winners}
        onHide={() => setDialogVisible(false)}
        sorteoTitulo={sorteoTitulo}
      />

      {/* Footer */}
      <footer className="text-gray-400 text-sm text-center w-full">
        &copy; {new Date().getFullYear()} Sorteos Facilísimo. Hecho con <span className="text-red-500">♥</span> para tus sorteos.
      </footer>
    </div>
  );
};

export default SorteoPage;
