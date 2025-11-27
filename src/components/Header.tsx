import { Truck, Menu } from "lucide-react";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shadow-glow">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Fleet Optimization</h1>
              <p className="text-xs text-muted-foreground">Montgomery County</p>
            </div>
          </div>
          
          <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary hover:bg-secondary/80 transition-colors lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
