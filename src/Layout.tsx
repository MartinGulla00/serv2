export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-col p-20 overflow-auto">
      {children}
    </div>
  );
};
