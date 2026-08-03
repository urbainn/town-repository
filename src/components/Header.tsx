import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import BackIcon from "@mui/icons-material/ArrowBack";

interface HeaderProps {
    show: boolean;
    text: string;
    rightSideContent?: React.ReactNode;
    onBack?: () => void;
}

function Header({ show, text, rightSideContent, onBack }: HeaderProps) {
    if (!show) return null;
    return (
        <AppBar position="static" color="primary">
            <Toolbar>
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="back"
                    sx={{ mr: 2 }}
                    onClick={onBack}
                >
                    <BackIcon />
                </IconButton>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    {text}
                </Typography>
                {rightSideContent}
            </Toolbar>
        </AppBar>
    );
}

export { Header };
export type { HeaderProps };