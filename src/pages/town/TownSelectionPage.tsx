import { Stack, Typography } from "@mui/material";
import AppPageProps from "../AppPageProps";
import logo from "../../assets/app-icon.png";
import { t } from "../../core/i18n";
import "./TownSelectionPage.css";
import { blue } from "@mui/material/colors";
import TownCard from "../../components/cards/TownCard";

function TownSelectionPage({ }: AppPageProps) {

    return (
        <div>
            <div className="flex center town-selection-header" style={{ backgroundColor: blue[500] }}>
                <div className="flex align-center gap-2">

                    <img src={logo} alt="App Logo" width={150} height={150} />

                    <Stack direction="column" spacing={0.5}>
                        <Typography variant="h3" sx={{ fontWeight: "bold" }}>
                            Town Repository
                        </Typography>
                        <Typography variant="h4">{t("Créateur d'annuaire")}</Typography>
                    </Stack>
                    
                </div>
            </div>

            <div className="contain-center">
                <div className="content">

                    <Stack direction="column" spacing={2} className="mb-3 mt-2">
                        <TownCard />
                        <TownCard />
                        <TownCard />
                    </Stack>
                </div>
            </div>
        </div>
    );
}

export default TownSelectionPage;