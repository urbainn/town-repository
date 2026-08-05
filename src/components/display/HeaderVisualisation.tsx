import { LocationCity } from "@mui/icons-material";
import { Typography } from "@mui/material";
import { t } from "../../core/i18n";
import { theme } from "../../core/theme";

interface HeaderVisualisationProps {
    name: string | null;
    logo: string | File | null;
    primaryColor?: string;
    secondaryColor?: string;
    logoEnableBg?: boolean;
    splashImage?: string | File;
}

function HeaderVisualisation({ name, logo, primaryColor, secondaryColor, logoEnableBg, splashImage }: HeaderVisualisationProps) {

    const displayPrimaryColor = primaryColor ?? "#f0f0f0"; 
    const textColor = theme.palette.getContrastText(displayPrimaryColor);

    return (
        <div>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                {t("Aperçu de l'en-tête")}
            </Typography>
            <div className={"width-100 " + (!splashImage ? " flex center" : "")}
                style={{ backgroundColor: displayPrimaryColor, padding: 30 }}>
            
                <div className="flex align-center gap-1">
                    {logo ? (
                        // Show the logo if it exists
                        <div className="flex align-center center" style={{ borderRadius: 10, backgroundColor: primaryColor && logoEnableBg ? 'white' : 'transparent', width: 100, height: 100 }}>
                            <img src={typeof logo === "string" ? logo : URL.createObjectURL(logo)} alt="Logo" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        </div>
                    ) : (
                        // No logo, show a placeholder
                        <div className="flex align-center center" style={{ width: 100, height: 100 }}>
                            <LocationCity sx={{ fontSize: 90, color: textColor }} />
                        </div>
                    )}

                    <div>
                        <div>
                            <Typography variant="h3" sx={{ fontWeight: 400, color: textColor, fontSize: 22 }}>
                                {t("Annuaire")}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 600, color: textColor, fontSize: 30 }}>
                                {name || t("Titre")}
                            </Typography>
                        </div>
                    </div>
                </div>
            
            </div>

            {secondaryColor && (
                <div className="width-100" style={{ backgroundColor: secondaryColor, height: 2 }} />
            )}
        </div>

    );

}

export default HeaderVisualisation;