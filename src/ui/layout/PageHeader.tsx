export default function PageHeader({ name }: { name: string }) {
  return (
    <header className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <h1 className="text-lg font-semibold leading-6 text-gray-900">{name}</h1>
      </div>
    </header>
  );
}
