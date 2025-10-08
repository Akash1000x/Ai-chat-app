import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"
import rehypeRaw from "rehype-raw"

export default function Markdown({ message }: { message: string }) {
  return (
    <ReactMarkdown
      children={message}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        code(props) {
          const { children, className, node, ref, ...rest } = props
          const match = /language-(\w+)/.exec(className || "")
          return match ? (
            <SyntaxHighlighter
              {...rest}
              PreTag="div"
              children={String(children).replace(/\n$/, "")}
              language={match[1]}
              style={dark}
            />
          ) : (
            <code {...rest} className="bg-accent px-1.5 mx-0.5 py-1 rounded-sm">
              {children}
            </code>
          )
        },
        ol(props) {
          return <ol className="list-decimal pl-4" {...props} />
        },
        ul(props) {
          return <ul className="list-disc pl-5 my-3" {...props} />
        },
        li(props) {
          return <li className="pl-1.5 my-2" {...props} />
        },
        p(props) {
          return <p className="my-5 text-justify" {...props} />
        },
      }}
    />
  )
}
