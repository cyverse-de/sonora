/**
 * A custom wrapper that builds the QueryClient and QueryClientProvider for React Query
 **/
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();
const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

export { Wrapper as RQWrapper };
