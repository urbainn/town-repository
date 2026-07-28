import { HeaderProps } from "../components/Header";

export default interface AppPageProps {
    navigate: (page: React.ReactNode, headerProps?: HeaderProps) => void;
    setHeader: (headerProps: HeaderProps) => void;
}