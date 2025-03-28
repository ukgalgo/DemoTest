// src/components/Header.jsx
import Link from 'next/link';

export default function Header() {
    return (
        <header className="bg-blue-700 text-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold">
                        Cricket Fixtures
                    </Link>

                    <nav>
                        <ul className="flex space-x-6">
                            <li>
                                <Link href="/" className="hover:text-blue-200 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/Series" className="hover:text-blue-200 transition-colors">
                                    Series
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/matches" className="hover:text-blue-200 transition-colors">
                                    Matches
                                </Link>
                            </li> */}
                        </ul>
                    </nav>
                </div>
            </div>
        </header>
    );
}