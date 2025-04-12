import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Calendar from "./components/Calendar/Calendar";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Calendar />
      </QueryClientProvider>
    </>
  );
}

export default App;
