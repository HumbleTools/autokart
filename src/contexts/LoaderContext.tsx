import { createContext } from "react";
import { useLoader } from "../hooks/useLoader";

interface ILoaderContext {
    loader: React.ReactNode;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LoaderContext = createContext<ILoaderContext>({} as ILoaderContext);

interface ProviderProps {
    children: React.ReactNode;
};

export const LoaderProvider = (props: ProviderProps) => {
    const context = useLoader();
    return <LoaderContext.Provider value={context}>{props.children}</LoaderContext.Provider>;
};