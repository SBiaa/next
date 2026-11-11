import { existsSync } from "node:fs";
import path from "node:path";
import Image from "next/image";

type Mark = "center" | "bl" | "br" | "tr";

type PhotoProps = {
  /** Nome do arquivo dentro de /public/images */
  file: string;
  alt: string;
  /** Atributo sizes do next/image (largura real do espaço na tela) */
  sizes: string;
  /** Onde fica o bloco laranja do fallback enquanto a foto não existe */
  mark?: Mark;
  priority?: boolean;
};

/**
 * Foto do site. Se o arquivo ainda não estiver em /public/images, mostra um bloco
 * escuro com um elemento laranja no lugar — a checagem roda no servidor (no build,
 * pra página estática), então não sai pedido 404 nem ícone de imagem quebrada.
 * O pai precisa ter position: relative e overflow: hidden.
 */
export function Photo({ file, alt, sizes, mark = "br", priority }: PhotoProps) {
  const exists = existsSync(path.join(process.cwd(), "public", "images", file));

  if (!exists) {
    return <div className={`photo-fallback mark-${mark}`} aria-hidden="true" />;
  }

  return (
    <Image
      src={`/images/${file}`}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className="photo-img"
    />
  );
}
