import { type ReactNode } from "react";

export function Card({
  title,
  children,
  href,
}: {
  title: string;
  children: ReactNode;
  href: string;
}) {
  return (
    <a
      className="ui-group ui-rounded-lg ui-border ui-border-neutral-200 dark:ui-border-neutral-800 ui-bg-white dark:ui-bg-neutral-900 ui-px-6 ui-py-5 ui-shadow-sm ui-transition-all ui-duration-200 hover:ui-border-neutral-300 dark:hover:ui-border-neutral-700 hover:ui-bg-neutral-50 dark:hover:ui-bg-neutral-800/50 hover:ui-shadow-md"
      href={`${href}?utm_source=create-turbo&utm_medium=with-tailwind&utm_campaign=create-turbo"`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <h2 className="ui-mb-3.5 ui-text-2xl ui-font-semibold ui-text-neutral-800 dark:ui-text-neutral-200">
        {title}{" "}
        <span className="ui-inline-block ui-transition-transform ui-duration-200 group-hover:ui-translate-x-1 motion-reduce:ui-transform-none">
          -&gt;
        </span>
      </h2>
      <p className="ui-m-0 ui-max-w-[30ch] ui-text-sm ui-leading-relaxed ui-text-neutral-600 dark:ui-text-neutral-400">
        {children}
      </p>
    </a>
  );
}
