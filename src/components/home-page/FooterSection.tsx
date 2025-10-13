import { Twitter, Linkedin, Github } from 'lucide-react';
import Link from 'next/link';

export function FooterSection() {
  return (
    <footer className="bg-muted border-t py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-foreground">
              Tender Track 360
            </h3>
            <p className="text-muted-foreground mb-4">
              Streamline your tender management process with our comprehensive
              platform.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/tendertrack360"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-secondary rounded flex items-center justify-center hover:bg-secondary/80 transition-colors text-secondary-foreground"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com/organization/tendertrack360"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-secondary rounded flex items-center justify-center hover:bg-secondary/80 transition-colors text-secondary-foreground"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com/tendertrack360"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-secondary rounded flex items-center justify-center hover:bg-secondary/80 transition-colors text-secondary-foreground"
                aria-label="View our GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Product</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link
                  href="#features"
                  className="hover:text-foreground transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  href="#pricing"
                  className="hover:text-foreground transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href="#security"
                  className="hover:text-foreground transition-colors"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link
                  href="#integrations"
                  className="hover:text-foreground transition-colors"
                >
                  Integrations
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Support</h4>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <a
                  href="https://docs.tendertrack360.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  Documentation
                </a>
              </li>
              <li>
                <Link
                  href="#help"
                  className="hover:text-foreground transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="#training"
                  className="hover:text-foreground transition-colors"
                >
                  Training
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-foreground">Contact</h4>
            <div className="space-y-2 text-muted-foreground">
              <div>📧 support@tendertrack360.com</div>
              <div>📞 +1 (555) 123-4567</div>
              <div>📍 123 Business Ave, Suite 100</div>
              <div>🌐 www.tendertrack360.com</div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2024 Tender Track 360. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link
                href="#privacy"
                className="hover:text-foreground transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#terms"
                className="hover:text-foreground transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#cookies"
                className="hover:text-foreground transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
