import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
const queryClient = new QueryClient();

function App() {
  return (
    <div className="m-3">
      {/* <Flex  align="center" vertical={true}> */}
        {/* <CustomTable />
        <NestedTable />
      
        <CustomForm/> */}
      {/* </Flex> */}
       <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
    </QueryClientProvider>
  </BrowserRouter>
    </div>
  );
}

export default App;
