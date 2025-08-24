import { ChartLine, Plus, Home } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function Header() {
  const [location] = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-netflix-black to-transparent p-6" data-testid="header">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity" data-testid="logo">
          <ChartLine className="text-gov-blue text-2xl" size={32} />
          <h1 className="text-2xl font-bold gradient-text" data-testid="app-title">
            GovGraph
          </h1>
        </Link>
        <nav className="flex items-center space-x-6" data-testid="navigation">
          <Link 
            href="/" 
            className={`flex items-center space-x-2 transition-colors ${
              location === "/" ? "text-white" : "text-gray-300 hover:text-white"
            }`} 
            data-testid="nav-home"
          >
            <Home size={18} />
            <span className="hidden md:inline">Home</span>
          </Link>
          <Link 
            href="/data-upload" 
            className={`flex items-center space-x-2 transition-colors ${
              location === "/data-upload" ? "text-white" : "text-gray-300 hover:text-white"
            }`} 
            data-testid="nav-data-upload"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Upload Data</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
