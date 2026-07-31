import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownRendererProps {
  content: string;
  mono?: boolean;
}

const markdownComponents: Components = {
  a: ({ children, ...props }) => (
    <a
      {...props}
      className="text-cyan-200 underline decoration-cyan-300/40 underline-offset-4 transition-colors hover:text-white"
      target="_blank"
      rel="noreferrer"
    >
      {children}
    </a>
  ),
  h1: ({ children, ...props }) => (
    <h1 {...props} className="mt-0 text-3xl font-semibold text-white">
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 {...props} className="mt-8 text-2xl font-semibold text-white">
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 {...props} className="mt-6 text-xl font-semibold text-white">
      {children}
    </h3>
  ),
  hr: ({ ...props }) => <hr {...props} className="my-8 border-white/10" />,
  li: ({ children, ...props }) => (
    <li {...props} className="pl-1">
      {children}
    </li>
  ),
  ol: ({ children, ...props }) => (
    <ol {...props} className="my-4 list-decimal space-y-2 pl-5 text-slate-300">
      {children}
    </ol>
  ),
  p: ({ children, ...props }) => (
    <p {...props} className="my-4 leading-7 text-slate-300">
      {children}
    </p>
  ),
  strong: ({ children, ...props }) => (
    <strong {...props} className="font-semibold text-white">
      {children}
    </strong>
  ),
  table: ({ children, ...props }) => (
    <div className="my-6 overflow-x-auto rounded-lg border border-white/10">
      <table {...props} className="min-w-full border-collapse text-left text-sm">
        {children}
      </table>
    </div>
  ),
  tbody: ({ children, ...props }) => (
    <tbody {...props} className="divide-y divide-white/10">
      {children}
    </tbody>
  ),
  td: ({ children, ...props }) => (
    <td {...props} className="px-4 py-3 align-top text-slate-300">
      {children}
    </td>
  ),
  th: ({ children, ...props }) => (
    <th
      {...props}
      className="bg-white/[0.04] px-4 py-3 text-xs font-semibold uppercase text-slate-200"
    >
      {children}
    </th>
  ),
  ul: ({ children, ...props }) => (
    <ul {...props} className="my-4 list-disc space-y-2 pl-5 text-slate-300">
      {children}
    </ul>
  ),
};

export function MarkdownRenderer({
  content,
  mono = false,
}: MarkdownRendererProps) {
  return (
    <div
      className={`prose-custom ${
        mono ? "font-mono text-[13px] leading-6" : "font-sans"
      }`}
    >
      <ReactMarkdown components={markdownComponents} remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
