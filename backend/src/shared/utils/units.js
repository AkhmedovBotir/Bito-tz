/** Blok + dona → jami dona */
export function toPieces({ pieces = 0, blocks = 0 } = {}, unitsPerBlock = 1) {
  const upb = Math.max(1, Number(unitsPerBlock) || 1);
  return Number(pieces || 0) + Number(blocks || 0) * upb;
}

/** Dona → blok va qoldiq dona */
export function fromPieces(qtyPieces = 0, unitsPerBlock = 1) {
  const upb = Math.max(1, Number(unitsPerBlock) || 1);
  const pieces = Number(qtyPieces) || 0;
  const blocks = Math.floor(pieces / upb);
  const remainderPieces = pieces % upb;
  return {
    qtyPieces: pieces,
    qtyBlocks: blocks,
    remainderPieces,
    unitsPerBlock: upb,
    label: `${pieces} dona (${blocks} blok${remainderPieces ? ` + ${remainderPieces} dona` : ''})`,
  };
}
