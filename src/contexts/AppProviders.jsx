import { CustomerProvider } from "./CustomerContext";
import { ServiceProvider } from "./ServiceContext";
import { QuoteProvider } from "./QuoteContext";
import { OfferedServicesProvider } from "./OfferedServicesContext";
import { AuthProvider } from "./AuthContext";

export function AppProviders({ children }) {
  return (
    <AuthProvider>
        <CustomerProvider>
                <ServiceProvider>
                    <QuoteProvider>
                        <OfferedServicesProvider>
                            {children}
                        </OfferedServicesProvider>
                    </QuoteProvider>
                </ServiceProvider>
            </CustomerProvider>
    </AuthProvider>
  );
}
