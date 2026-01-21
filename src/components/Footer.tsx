import { Link } from 'react-router-dom';
import logo from '/Geek247 Logo.png';

export const Footer = () => {
  return (
    <footer className="border-t border-primary/10 bg-surface-darker py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link to="/" className="inline-block mb-6">
              <img src={logo} alt="Geek247" className="h-12 w-auto" />
            </Link>
            <p className="text-muted-foreground max-w-md mb-6">
              We build and maintain the systems that power your operations, so you can focus on growing your business.
            </p>
            <p className="text-sm text-primary">
              Continuous optimization, learning, and evolution — baked in.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold text-foreground mb-4">Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:amrish@geek247.co.za"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  amrish@geek247.co.za
                </a>
              </li>
              <li>
                <span className="text-muted-foreground">South Africa</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Geek247. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Helping businesses achieve greater efficiency through technology
          </p>
        </div>
      </div>
    </footer>
  );
};
