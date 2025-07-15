export interface CommentBlock {
  username: string;
  date: string;
  comment: string;
  rawBlock: string;
}

export function parseComments(text: string): CommentBlock[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const blocks: CommentBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const username = lines[i];
    const dateLine = lines[i + 1] || '';
    const commentLine = lines[i + 2] || '';
    const nextLine = lines[i + 3] || '';
    // Un bloque termina si la siguiente línea es 'Foto del perfil de ...' o 'Responder'
    if (/^Foto del perfil de /.test(nextLine) || nextLine === 'Responder') {
      const rawBlock = [username, dateLine, commentLine, nextLine].join('\n');
      blocks.push({
        username,
        date: dateLine,
        comment: commentLine,
        rawBlock,
      });
      i += 3;
      // Saltar líneas 'Foto del perfil de ...' repetidas
      while (lines[i + 1] && /^Foto del perfil de /.test(lines[i + 1])) i++;
      i++;
      continue;
    }
    // Detecta si la línea de fecha contiene 'sem', 'h', 'd', etc. (lógica anterior)
    if (/(\d+\s*(sem|h|d|min))/.test(dateLine)) {
      const rawBlock = [username, dateLine, commentLine].join('\n');
      blocks.push({
        username,
        date: dateLine,
        comment: commentLine,
        rawBlock,
      });
      i += 3;
      continue;
    }
    i++;
  }
  return blocks;
}

// Nuevo parser para Facebook
export function parseCommentsFacebook(text: string): CommentBlock[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const blocks: CommentBlock[] = [];
  let i = 0;
  while (i < lines.length) {
    const username = lines[i];
    const commentLine = lines[i + 1] || '';
    const dateLine = lines[i + 2] || '';
    const nextLine = lines[i + 3] || '';
    // Un bloque termina si la siguiente línea es 'Responder', 'Ocultar' o 'Foto del perfil de ...'
    if (nextLine === 'Responder' || nextLine === 'Ocultar' || /^Foto del perfil de /.test(nextLine)) {
      const rawBlock = [username, commentLine, dateLine, nextLine].join('\n');
      blocks.push({
        username,
        date: dateLine,
        comment: commentLine,
        rawBlock,
      });
      i += 3;
      // Saltar líneas 'Foto del perfil de ...' repetidas
      while (lines[i + 1] && /^Foto del perfil de /.test(lines[i + 1])) i++;
      i++;
      continue;
    }
    // Detecta si la línea de fecha contiene 'sem', 'h', 'd', etc. (lógica anterior)
    if (/(\d+\s*(sem|h|d|min))/.test(dateLine)) {
      const rawBlock = [username, commentLine, dateLine].join('\n');
      blocks.push({
        username,
        date: dateLine,
        comment: commentLine,
        rawBlock,
      });
      i += 3;
      continue;
    }
    i++;
  }
  return blocks;
}

export default parseComments;
