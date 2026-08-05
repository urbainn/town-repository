import { Stack, Typography } from "@mui/material";
import { ImageUploadImput } from "./ImageUploadInput";
import { t } from "../../core/i18n";
import { Check, LocationCity, Close } from "@mui/icons-material";

interface RepoLogoFormProps {
    logoUrl: string | null;
    onLogoChange: (logo: File | null, url: string | null) => void;
}

function RepoLogoForm({ logoUrl, onLogoChange }: RepoLogoFormProps) {
    return (
        <Stack direction="column" spacing={3}>

            <div className="flex gap-2 align-center">
                <div>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                        {t("Logo de l'annuaire")}
                    </Typography>
                    
                    <ImageUploadImput
                        width={250}
                        height={250}
                        imageUrl={logoUrl}
                        onChange={(file) => {
                            onLogoChange(file, URL.createObjectURL(file));
                        }}
                    />
                </div>

                <div>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {t("Ce logo doit être au format carré et ne pas contenir de texte.")}
                    </Typography>

                    <div className="flex gap-05 mt-1 align-center">
                        <div className="flex align-center center mr-05" style={{ borderRadius: 4, backgroundColor: "#f0f0f0", width: 65, height: 65 }}>
                            <LocationCity sx={{ fontSize: 35, color: "text.secondary" }} />
                        </div>
                        <Check sx={{ fontSize: 24, color: "green" }} />
                        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                            {t("CORRECT")}
                        </Typography>
                    </div>

                    <div className="flex gap-05 mt-1 align-center">
                        <div className="flex align-center center mr-05" style={{ borderRadius: 4, backgroundColor: "#f0f0f0", width: 65, height: 65 }}>
                            <LocationCity sx={{ fontSize: 25, color: "text.secondary" }} />
                            <p style={{ margin: 0, fontSize: 8, marginLeft: 2, color: "text.secondary", lineHeight: 1.2 }}>TEXTE<br/>VILLE</p>
                        </div>
                        <Close sx={{ fontSize: 24, color: "red" }} />
                        <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                            {t("INCORRECT")}
                        </Typography>
                    </div>

                </div>
            </div>
        </Stack>
    );
}

export default RepoLogoForm;