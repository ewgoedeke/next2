import Link from 'next/link';

export default function SideNav() {
  const tabs = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/dashboard/myfiles', label: 'myfiles' },
    { href: '/dashboard/upload', label: 'upload' },
    { href: '/dashboard/profile', label: 'profile' },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white">
      <nav className="flex flex-col p-4">
        {tabs.map((tab) => (
          <Link key={tab.href} href={tab.href} className="mb-4 p-2 hover:bg-gray-700">
            {tab.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
