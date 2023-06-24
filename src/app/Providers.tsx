import TrpcProvider from "./TrpcProvider";

const Providers: React.FC<Layout> = ({ children }) => (
  <TrpcProvider>{children}</TrpcProvider>
);

export default Providers;
