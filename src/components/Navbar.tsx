import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="p-2 px-6 shadow-md flex justify-between">
      <Link to="/" className="text-4xl font-semibold">
        Galery
      </Link>
      <nav className="flex items-center">
        <ul className="flex gap-4">
          <li>
            <Link to="/" className="hover:font-medium">
              Home
            </Link>
          </li>
          <li>
            <Link to="/history" className="hover:font-medium transition-all">
              History
            </Link>
          </li>
        </ul>
      </nav>
      <div></div>
    </header>
  );
}
