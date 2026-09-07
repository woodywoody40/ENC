import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';

const inlinePattern = /(\*\*.*?\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

const renderInline = (text: string): ReactNode[] =>
  text.split(inlinePattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return <code key={index}>{part.slice(1, -1)}</code>;
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const external = /^https?:\/\//.test(link[2]);
      return <a key={index} href={link[2]} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{link[1]}</a>;
    }
    return part;
  });

const headingId = (text: string, index: number) => {
  const id = text.toLowerCase().replace(/\*\*/g, '').replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '');
  return id || `section-${index + 1}`;
};

export default function MarkdownArticle({ content, skipImageSrc }: { content: string; skipImageSrc?: string }) {
  const [copied, setCopied] = useState<number | null>(null);
  const lines = (content || '').replace(/\r\n/g, '\n').split('\n');
  const nodes: ReactNode[] = [];

  const copyCode = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopied(index);
    window.setTimeout(() => setCopied(null), 1600);
  };

  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i += 1; continue; }

    if (line.startsWith('```')) {
      const language = line.slice(3).trim() || 'text';
      const start = i;
      const code: string[] = [];
      i += 1;
      while (i < lines.length && !lines[i].trim().startsWith('```')) {
        code.push(lines[i]);
        i += 1;
      }
      i += 1;
      const value = code.join('\n');
      nodes.push(
        <figure className="enc-code-block" key={`code-${start}`}>
          <figcaption><span>{language}</span><button type="button" onClick={() => copyCode(value, start)}>{copied === start ? <Check size={14} /> : <Copy size={14} />}{copied === start ? '已複製' : '複製'}</button></figcaption>
          <pre tabIndex={0}><code>{value}</code></pre>
        </figure>
      );
      continue;
    }

    const image = line.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/);
    if (image) {
      if (skipImageSrc && image[2] === skipImageSrc) {
        i += 1;
        continue;
      }
      nodes.push(
        <figure className="enc-article-figure" key={`image-${i}`}>
          <img src={image[2]} alt={image[1]} width={1600} height={900} loading="lazy" />
          {(image[3] || image[1]) && <figcaption>{image[3] || image[1]}</figcaption>}
        </figure>
      );
      i += 1;
      continue;
    }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length === 3 ? 3 : 2;
      const id = headingId(heading[2], i);
      nodes.push(level === 2
        ? <h2 id={id} key={`heading-${i}`}>{renderInline(heading[2])}</h2>
        : <h3 id={id} key={`heading-${i}`}>{renderInline(heading[2])}</h3>);
      i += 1;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      const start = i;
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ''));
        i += 1;
      }
      nodes.push(<ul key={`list-${start}`}>{items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}</ul>);
      continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      const start = i;
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ''));
        i += 1;
      }
      nodes.push(<ol key={`ordered-${start}`}>{items.map((item, index) => <li key={index}>{renderInline(item)}</li>)}</ol>);
      continue;
    }

    if (line.startsWith('> ')) {
      const quote: string[] = [];
      const start = i;
      while (i < lines.length && lines[i].trim().startsWith('> ')) {
        quote.push(lines[i].trim().slice(2));
        i += 1;
      }
      nodes.push(<blockquote key={`quote-${start}`}>{renderInline(quote.join(' '))}</blockquote>);
      continue;
    }

    const paragraph: string[] = [line];
    const start = i;
    i += 1;
    while (i < lines.length && lines[i].trim() && !/^(#{1,3})\s+|^```|^!\[|^[-*]\s+|^\d+\.\s+|^>\s+/.test(lines[i].trim())) {
      paragraph.push(lines[i].trim());
      i += 1;
    }
    nodes.push(<p key={`paragraph-${start}`}>{renderInline(paragraph.join(' '))}</p>);
  }

  return <div className="enc-markdown">{nodes}</div>;
}
