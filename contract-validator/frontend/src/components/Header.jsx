function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CV</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">
              Contract Validator
            </span>
          </div>
          <nav className="flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-indigo-600">Home</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">About</a>
            <a href="#" className="text-gray-600 hover:text-indigo-600">Docs</a>
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;
