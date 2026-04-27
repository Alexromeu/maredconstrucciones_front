import { CustomerProvider } from "./CustomerContext";
import { ServiceProvider } from "./ServiceContext";
import { QuoteProvider } from "./QuoteContext";
import { AuthProvider } from "./AuthContext";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
      <CustomerProvider>
        <ServiceProvider>
          <QuoteProvider>
            {children}
          </QuoteProvider>
        </ServiceProvider>
      </CustomerProvider>
    </AuthProvider>
  );
}
