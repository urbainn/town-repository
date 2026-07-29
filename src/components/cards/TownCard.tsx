import { Card, CardActionArea, CardContent, Stack, Typography } from "@mui/material";
import { TownRepo } from "../../core/cache/TownRepoCache";
import { t } from "../../core/i18n";
import { AddLocationAlt } from "@mui/icons-material";

/**
 * Displays a clickable card for a town repository. If no town is provided, will show a "New Town" card.
 */
function TownCard({ town, onClick }: { town?: TownRepo, onClick?: () => void }) {

    return (
        <Card variant="outlined" sx={{ width: 500, borderRadius: 2 }}>
            <CardActionArea onClick={onClick}>
                <CardContent>
                    <div className="flex align-center gap-1">
                    
                        <div>
                            <AddLocationAlt color="primary" sx={{ fontSize: 50 }} />
                        </div>

                        <Stack direction="column" spacing={0.2}>
                            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                                {town ? town.townName : t("Nouvel annuaire")}
                            </Typography>
                            <Typography variant="body1">
                                {town ? town.townLAUcodes.length > 1 ?
                                    town.townLAUcodes.length + ' ' + t("communes") :
                                    t("Annuaire de la commune") :
                                    t("Créer un nouvel annuaire")}.
                            </Typography>
                        </Stack>

                    </div>
                </CardContent>
            </CardActionArea>
        </Card>
    );

}

export default TownCard;