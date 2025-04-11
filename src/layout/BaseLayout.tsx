import Header from "../components/layout/Header";

interface BaseLayoutProps {
  children: React.ReactNode;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => (
  <div className="w-full h-full flex flex-col">
    <Header />
    {children}
  </div>
);
