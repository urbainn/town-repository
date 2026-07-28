import { Stack, Typography } from "@mui/material";
import AppPageProps from "../AppPageProps";
import { useEffect } from "react";
import logo from "../../assets/app-icon.png";

function TownSelectionPage({ navigate, setHeader }: AppPageProps) {

    return (
        <div className="contain-center">
            <div className="content">

                <div className="flex center width-100">
                    <div className="flex align-center">

                        <img src={logo} alt="App Logo" width={200} height={200} />

                        <Stack direction="column" spacing={0}>
                            <Typography variant="h2" sx={{ fontWeight: "bold" }}>
                                Town Repository
                            </Typography>
                            <Typography variant="h3">Créateur d'annuaire</Typography>
                        </Stack>
                        
                    </div>
                </div>

            </div>
        </div>
    );
}

export default TownSelectionPage;