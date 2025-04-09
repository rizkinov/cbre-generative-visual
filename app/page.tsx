"use client";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-calibre text-sm lg:flex">
        <h1 className="text-4xl font-bold">CBRE Web Elements</h1>
        <div className="flex flex-col items-center justify-center">
          <p className="text-center text-lg">
            A modern React component library built with Next.js, Tailwind CSS, and shadcn/ui, 
            following CBRE design system guidelines.
          </p>
          <a 
            href="/elements-example"
            className="mt-4 px-4 py-2 bg-cbre-green text-white rounded-none"
          >
            View Components
          </a>
        </div>
      </div>
    </main>
  );
}
