export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen w-screen flex flex-col p-5 pb-0 overflow-auto">
      {children}
    </div>
  );
};
