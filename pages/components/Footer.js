// src/components/Footer.jsx
export default function Footer() {
    return (
        <footer className="bg-gray-800 text-white py-6 mt-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="mb-4 md:mb-0">
                        <h3 className="text-xl font-semibold">Cricket Fixtures App</h3>
                        <p className="text-gray-400">Stay updated with the latest cricket matches</p>
                    </div>

                    <div className="flex space-x-4">
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Terms of Service
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-gray-400 hover:text-white transition-colors">
                            Contact Us
                        </a>
                    </div>
                </div>

                <div className="mt-6 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Cricket Fixtures App. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}